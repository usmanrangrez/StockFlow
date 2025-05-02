import { Codes } from "../config/codes.js";
import GeneralService from "../services/general.service.js";

class GeneralController {
  constructor() {
    this.generalService = new GeneralService();
  }

  getAllDropDowns = async (req, res, next) => {
    try {
      const dropdowns = await this.generalService.getAllDropDowns();
      res.sendSuccess(200, Codes.STX0084, dropdowns);
    } catch (error) {
      next(error);
    }
  };

  

  
}

export default GeneralController;
