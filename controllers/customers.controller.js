import { Codes } from "../config/codes.js";
import { getPaginationParams } from "../helpers/getPagination.helper.js";
import CustomersService from "../services/customers.service.js";

class CustomersController {
  constructor() {
    this.customersService = new CustomersService();
  }

  createCustomer = async (req, res, next) => {
    try {
      const body = req.body;
      const customer = await this.customersService.createCustomer(body);
      res.sendSuccess(201, Codes.STX0070, customer);
    } catch (error) {
      next(error);
    }
  };

  getCustomers = async (req, res, next) => {
    try {
      let {limit,offset} = getPaginationParams(req);
      let { name, phone, district } = req.query;
      name = name?.trim();
      phone = phone?.trim();
      district = district?.trim();
      const customers = await this.customersService.getCustomers(limit, offset, name, phone, district);
      res.sendSuccess(200, Codes.STX0071, customers);
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req, res, next) => {
    try {
      const customerId = req.params.customerId;
      const body = req.body;
      const customer = await this.customersService.updateCustomer(customerId, body);
      res.sendSuccess(200, Codes.STX0072, customer);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req, res, next) => {
    try {
      const customerId = req.params.customerId;
      const customer = await this.customersService.deleteCustomer(customerId);
      res.sendSuccess(200, Codes.STX0074, customer);
    } catch (error) {
      next(error);
    }
  };
}

export default CustomersController;
