const _ = require("lodash");
const $ = require("mongo-dot-notation");
 const httpStatus = require("http-status");
 const jwtDecode = require("jwt-decode");
 const toonavatar = require("cartoon-avatar");
 const md5 = require("md5");
 const userService = require("../services/users.service");
 const userAccessService = require("../services/userAccess.service");
const APIError = require("../../helpers/APIError.helper");
 const logger = require("../../../config/winston")(module);
 const CONSTANTS = require("../../helpers/Constants");
 const helpers = require("../../helpers/helpers");
 const config = require("../../../config/config");
module.exports.createUser = (req, res, next) => {
    const { body } = req;
    body.username = body.username.toLowerCase();
    if (
      body.role.indexOf("ROOT") > -1 &&
      typeof body.regionId === "string" &&
      !body.regionId
    ) {
      const code = `Err${CONSTANTS.MODULE_CODE.USER}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
  
      logger.log({
        level: "info",
        message: `Missing regionId ${code}`,
      });
      return next(
        new APIError(
          "Missing region Id",
          httpStatus.NOT_FOUND,
          true,
          res.__("missing_parameter_in_body"),
          code
        )
      );
    }
    return userService
    .createUser(body)
    .then(async (response) => {
       console.log(response)
    })
  
};

        
  