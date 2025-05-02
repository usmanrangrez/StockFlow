import { Codes } from "../config/codes.js";
import BillsService from "../services/bills.service.js";

class BillsController {
  constructor() {
    this.billsService = new BillsService();
  }

  generateBill = async (req, res, next) => {
    try {
      const body = req.body;
      const { stream, filename } = await this.billsService.generateBill(body);
      const prefferedUiMode = req.body.prefferedUiMode || "download";


      if (prefferedUiMode == "show") {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
        stream.pipe(res);
        return;
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
      }

      // Pipe the PDF stream to the response
      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  };

  generateBillForSale = async (req, res, next) => {
    try {
      const { saleIds } = req.body;
      const { stream, filename } = await this.billsService.generateBillForSale(saleIds, res);
      
      //set headers for streaming PDF and displaying in new tab
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

      //pipe the PDF stream to the response
      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
}

export default BillsController;
