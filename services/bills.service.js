import { Logger } from "../integrations/winston.js";
import { Database } from "../integrations/database.js";
import Products from "../models/products.model.js";
import Colors from "../models/colors.model.js";
import Sizes from "../models/sizes.model.js";
import Cartons from "../models/cartons.model.js";
import Customers from "../models/customers.model.js";
import ProductVariants from "../models/productVariants.model.js";
import PDFDocument from "pdfkit";
import { Codes } from "../config/codes.js";
import moment from "moment";
import { PassThrough } from "stream";
import ProductVariantsService from "./productsVariant.service.js";
import Sales from "../models/sales.models.js";

const logger = new Logger();
const sequelize = Database.getSequelize();

class BillsService {
  constructor() {
    this.products = Products;
    this.colors = Colors;
    this.sizes = Sizes;
    this.cartons = Cartons;
    this.customers = Customers;
    this.productVariants = ProductVariants;
    this.productVariantsService = new ProductVariantsService();
    this.sales = Sales;
  }

  async generateBill(payload, res) {
    try {
      const { items, paymentMethod, referenceNo, note } = payload;

      await this.validatePayload(items, paymentMethod);

      const customer = await this.validateAndFetchCustomer(items);

      const billItems = await this.processBillItems(items);

      // Generate PDF
      const pdfStream = await this.generateBillPDF(billItems, customer, paymentMethod, referenceNo, note, res);

      logger.info("Bill generated successfully", { customerId: customer.id });
      return pdfStream;
    } catch (error) {
      logger.error("Error generating bill", { error: error.message, payload });
      throw error;
    }
  }

  async generateBillForSale (saleIds, res) {
    try {
      const sales = await this.sales.findAll({
        where: { id: saleIds },
        include: [
          {
            model: ProductVariants,
            as: "variant",
            include: [
              {
                model: Products,
                as: "product",
              },
              {
                model: Colors,
                as: "color",
              },
              {
                model: Sizes,
                as: "sizeRange",
              },
            ],
          },
        ],
        raw:true,
        nest:true
      });

      await this.checkAllSalesBelongToSameCustomer(sales);

      const items = sales.map((sale) => ({
        productId: sale.variant.productId,
        colorId: sale.variant.colorId,
        sizeRangeId: sale.variant.sizeRangeId,
        quantity: sale.quantity,
        discountPercentage: sale.discountPercentage,
      }));

      const customer = await this.customers.findOne({ where: { id: sales[0].customerId } });
      const billItems = await this.processBillItems(items);

      // Generate PDF
      // * refers to bill has been generated second time using multipleSales api
      const pdfStream = await this.generateBillPDF(billItems, customer, "*", "", "", res)
      logger.info("Bill generated successfully", { customerId: customer.id });

      return pdfStream;
    } catch (error) {
      logger.error("Error generating bill", { error: error.message });
      throw error;
    }
  }

  async checkAllSalesBelongToSameCustomer(sales) {
    const customerId = sales[0].customerId;
    const allSame = sales.every(sale => sale.customerId === customerId);
    if (!allSame) throw new Error(Codes.STX0076);
  }

  async validatePayload(items, paymentMethod) {
    // Check items array
    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 20) {
      throw new Error("Items array must have 1-20 items");
    }

    // Check all customerIds are the same
    const customerId = items[0].customerId;
    const allSame = items.every(item => item.customerId === customerId);
    if (!allSame) throw new Error(Codes.STX0076);

    // Check payment method
    const validMethods = ["Cash", "UPI", "Cheque", "Others", "*"];
    if (!validMethods.includes(paymentMethod)) throw new Error(`Invalid payment method: ${paymentMethod}`);
  }

  async validateAndFetchCustomer(items) {
    const customerId = items[0].customerId;
    const customer = await this.customers.findOne({ where: { id: customerId } });

    if (!customer) throw new Error(Codes.STX0086);

    return customer;
  }

  async processBillItems(items) {
    const billItems = [];

    for (const item of items) {
      const { productId, colorId, sizeRangeId, quantity, discountPercentage } = item;

      // Validate product variant
      const variant = await this.productVariants.findOne({
        where: { productId, colorId, sizeRangeId }
      });
      if (!variant) {
        logger.error(`Invalid product variant: ${productId}, ${colorId}, ${sizeRangeId}`);
        throw new Error(`Invalid product variant: ${productId}, ${colorId}, ${sizeRangeId}`);
      }

      // Fetch pairsPerCarton (take first record) since all cartons have same pairsPerCarton
      const carton = await this.cartons.findOne({ where: { variantId: variant.id } });
      if (!carton) throw new Error("Carton data not found for product variant");

      // Fetch product, color, and size details
      const product = await this.products.findOne({ where: { id: productId } });
      const color = await this.colors.findOne({ where: { id: colorId } });
      const size = await this.sizes.findOne({ where: { id: sizeRangeId } });

      if (!product || !color || !size) {
        logger.error(`Product ${product?.name}, color ${color?.name}, or size ${size?.range} not found`);
        throw new Error("Product, color, or size not found");
      }

      billItems.push({
        mrp: variant.mrp,
        productName: product.name,
        colorName: color.name,
        sizeRange: size.sizeRange,
        quantity,
        discountPercentage,
        pairsPerCarton: carton.pairsPerCarton
      });
    }

    return billItems;
  }
  async generateBillPDF(billItems, customer, paymentMethod, referenceNo, note) {
    const now = moment();
    const dateStr = now.format('DDMMMYYYY');
    const timeStr = now.format('HHmm');
    const billName = `cost_${customer.name}${dateStr}${timeStr}`;

    const doc = new PDFDocument({ size: 'A4', margin: 40, font: 'Helvetica' });

    const stream = new PassThrough();

    // Handle stream errors
    stream.on('error', (error) => {
      logger.error("PDF stream error", { error: error.message });
      throw new Error("Failed to generate PDF stream");
    });

    doc.pipe(stream);

    const currentDate = now.format('DD-MMM-YYYY');

    let y = 40;

    doc.font('Helvetica-Bold').fontSize(12).text("N_Welcome Traders", 40, y);
    y += 15;
    doc.font('Helvetica').fontSize(9).text("Nursingarh, Balgarden", 40, y);
    y += 12;
    doc.text("Srinagar, Jammu and Kashmir", 40, y);
    y += 12;
    doc.text("E-Mail: nwelcometraders@gmail.com", 40, y);
    y += 15;

    doc.font('Helvetica').fontSize(9)
      .text(`Dated: ${currentDate}`, doc.page.width - 140, 40, { width: 100, align: 'right' });

    doc.font('Helvetica-Bold').fontSize(9).text("Bill To:", 40, y);
    y += 12;
    doc.font('Helvetica').fontSize(8).text(customer.displayName, 40, y);
    y += 12;
    doc.text(customer.address, 40, y);
    y += 12;
    doc.text(customer.phone, 40, y);
    y += 15;

    doc.moveTo(40, y).lineTo(doc.page.width - 40, y)
      .strokeColor('#000').lineWidth(0.5).dash(5, { space: 5 }).stroke().undash();
    y += 10;

    doc.font('Helvetica-Bold').fontSize(12)
      .text("INVOICE", 40, y, { align: "center", width: doc.page.width - 80 });
    y += 20;

    const tableHeaders = ['Sno', 'Description', 'MRP', 'Quantity', 'Discount %', 'Rate', 'Amount'];
    const columnWidths = [30, 135, 60, 85, 60, 60, 60];
    const columnPositions = [40];
    for (let i = 0; i < columnWidths.length - 1; i++) {
      columnPositions.push(columnPositions[i] + columnWidths[i]);
    }

    doc.font('Helvetica-Bold').fontSize(8);
    tableHeaders.forEach((header, i) => {
      const align = i === 0 || i === 1 ? 'left' : 'right';
      doc.text(header, columnPositions[i], y, { width: columnWidths[i], align });
    });
    y += 10;

    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor('#000').lineWidth(0.5).stroke();
    y += 5;

    doc.font('Helvetica').fontSize(8);
    let totalAmount = 0;

    billItems.forEach((item, index) => {
      const mrp = item.mrp;
      const quantityCartons = item.quantity;
      const totalPairs = quantityCartons * item.pairsPerCarton;
      const discount = (mrp * item.discountPercentage) / 100;
      const rate = mrp - discount;
      const amount = totalPairs * rate;
      const description = `${item.productName} | ${item.colorName} | ${item.sizeRange.join('-')}`;

      doc.text((index + 1).toString(), columnPositions[0], y, { width: columnWidths[0], align: 'left' });
      doc.text(description, columnPositions[1], y, { width: columnWidths[1], align: 'left' });
      doc.text(`${mrp.toLocaleString('en-IN')}`, columnPositions[2], y, { width: columnWidths[2], align: 'right' });
      doc.text(`${totalPairs} Pairs (${quantityCartons} cartons)`.padStart(20), columnPositions[3], y, { width: columnWidths[3], align: 'right' });
      doc.text(`${item.discountPercentage}%`.padStart(5), columnPositions[4], y, { width: columnWidths[4], align: 'right' });
      doc.text(`${rate.toLocaleString('en-IN')}`, columnPositions[5], y, { width: columnWidths[5], align: 'right' });
      doc.text(`${amount.toLocaleString('en-IN')}`, columnPositions[6], y, { width: columnWidths[6], align: 'right' });

      totalAmount += amount;
      y += 15;

      if (y > doc.page.height - 150 && index < billItems.length - 1) {
        doc.addPage();
        y = 50;
        this.recreateTableHeader(doc, columnPositions, columnWidths);
      }
    });

    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor('#000').lineWidth(0.5).stroke();
    y += 5;

    doc.font('Helvetica-Bold').fontSize(8)
      .text(`${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`, columnPositions[6], y, { width: columnWidths[6], align: 'right' });
    y += 15;

    doc.font('Helvetica').fontSize(8).text(`Payment Method: ${paymentMethod}`, 40, y);
    y += 15;

    if (referenceNo) {
      doc.font('Helvetica').fontSize(8).text(`Reference No: ${referenceNo}`, 40, y);
      y += 15;
    }

    doc.font('Helvetica-Bold').fontSize(8).text('Important Information:', 40, y);
    y += 12;
    doc.font('Helvetica').fontSize(8).text('1. This is a computer generated bill.', 40, y);
    y += 12;
    doc.text('2. Goods once sold will not be taken back.', 40, y);
    y += 15;

    if (note) {
      doc.font('Helvetica-Bold').fontSize(8).text('NOTE:', 40, y);
      y += 12;
      doc.font('Helvetica').fontSize(8).text(note, 40, y, { width: doc.page.width - 80 });
      y += 15;
    }

    doc.font('Helvetica-Bold').fontSize(8)
      .text('Authorized Signatory:', doc.page.width - 140, doc.page.height - 50);

    doc.end();

    return { stream, filename: `${billName}.pdf` };
  }

  recreateTableHeader(doc, columnPositions, columnWidths) {
    const y = 50;
    const tableHeaders = ['Sno', 'Description', 'MRP', 'Quantity', 'Discount %', 'Rate', 'Amount'];

    doc.font('Helvetica-Bold').fontSize(8);
    tableHeaders.forEach((header, i) => {
      const align = i === 0 || i === 1 ? 'left' : 'right';
      doc.text(header, columnPositions[i], y, { width: columnWidths[i], align });
    });
    doc.moveTo(40, y + 10).lineTo(doc.page.width - 40, y + 10).strokeColor('#000').lineWidth(0.5).stroke();
  }
}

export default BillsService;