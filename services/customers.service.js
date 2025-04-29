import { Op } from "sequelize";
import { Logger } from "../integrations/winston.js";
import Customers from "../models/customers.model.js";
import { Codes } from "../config/codes.js";

const logger = new Logger();

class CustomersService {
  constructor() {
    this.customer = Customers;
  }

  async createCustomer(body) {
    try {
      body.name = body.name?.toUpperCase().trim();
      const existingCustomer = await this.customer.findOne({
        where: {
          [Op.or]: [
            { phone: body?.phone },
            { name: body?.name }
          ]
        }
      });
      if (existingCustomer) throw new Error(`Customer with phone ${body.phone} or name ${body.name} already exists`);
      const customer = await this.customer.create(body);
      return customer;
    } catch (error) {
      logger.error(`CustomersService.createCustomer: ${error}`);
      throw error;
    }
  }

  async getCustomers(limit, offset, name, phone, district) {
    try {
      const whereClause = {};
      if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
      if (phone) whereClause.phone = { [Op.iLike]: `%${phone}%` };
      if (district) whereClause.district = district;

      const customers = await this.customer.findAndCountAll({
        limit,
        offset,
        where: whereClause,
      });

      return customers;
    } catch (error) {
      logger.error(`CustomersService.getCustomers: ${error}`);
      throw error;
    }
  }

  async updateCustomer(id, body) {
    try {
      if(body.name) body.name = body.name?.toUpperCase().trim();
      const existingCustomer = await this.customer.findOne({ where: { id } });
      if (!existingCustomer) throw new Error(`Customer with id ${id} does not exist`);

      await this.customer.update(body, { where: { id } });
      return { name: existingCustomer?.name.trim() };
    } catch (error) {
      logger.error(`CustomersService.updateCustomer: ${error}`);
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      const existingCustomer = await this.customer.findOne({ where: { id } });
      if (!existingCustomer) throw new Error(`Customer with id ${id} does not exist`);

      await this.customer.destroy({ where: { id } });
      return { name: existingCustomer?.name.trim() };
    } catch (error) {
      logger.error(`CustomersService.deleteCustomer: ${error}`);
      throw error;
    }
  }
 
}

export default CustomersService;
