require("dotenv").config();
const jwt = require("express-jwt");
const _ = require("lodash");
const httpStatus = require("http-status");
const aclConfig = require("../../acl.json");
const APIError = require("../helpers/APIError.helper");
const userAccess = require("../users/services/userAccess.service");

const configuration = require("../../config/config");
const decrypter = require("../helpers/decrypter.helper");

// Example of ROLE array : ['USER','ADMIN', 'MANAGER', 'ROOT']
const roles = JSON.parse(process.env.ROLE);
const rank = [
  { role: "USER", priority: 6 },
  { role: "VISITORS", priority: 5 },
  { role: "DOCTORS", priority: 4 },
  { role: "MODERATOR", priority: 3 },
  { role: "ADMIN", priority: 2 },
  { role: "ROOT", priority: 1 },
];

const config = {};
const unSecureRoots = [];
if (!process.env.JWT_SECRET) {
  throw new Error("Environment variable not found : JWT_SECRET");
}
if (!aclConfig) {
  throw new Error("acl configuration json file not found : acl.json");
}
const roleManager = {
  getMaxRole() {
    return roles[roles.length - 1];
  },

  hasRole(role, checkRole) {
    return roles.indexOf(role) >= roles.indexOf(checkRole);
  },

  isRoot(role) {
    return roles.indexOf(role) === roles.length - 1;
  },

  isUser(role) {
    return roles.indexOf(role) === 0;
  },
  getRoles() {
    return roles;
  },
  // if role is valid, normalize. Otherwise throw error
  isValid(role) {
    if (roles.indexOf(role) > -1) {
      return role;
    }
    throw new Error("Invalid Role");
  },
};

const permission = (allowed) => {
  const isAllowed = (req) => {
    if (roleManager.isUser(req.user.role) && config.userValidator) {
      return config.userValidator(req);
    }
    return roleManager.hasRole(req.user.role, allowed);
  };

  return (req, res, next) => {
    if (req.user && isAllowed(req)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

const security = jwt({
  secret: function secretCallback(req, payload, done) {
    try {
      const value = decrypter.decrypt(configuration.extras.jwt_secret);
      done(null, value);
    } catch (e) {
      done(e, null);
    }
  },
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
}).unless({ path: unSecureRoots });

const addUnsecureRoute = (endPoint, methods, regex) => {
  const unsecureMethods = Array.isArray(methods) ? methods : [methods];
  unSecureRoots.push({ url: endPoint, methods: unsecureMethods, regex });
};

const findPath = (unsecured, find) => {
  return _.findIndex(unsecured, (o) => {
    if (o.regex) {
      return find.match(o.url);
    }
    return find === o.url;
  });
};

const checkAuthorisation = (ruleList, path, method) => {
  const status = _.map(ruleList, (o) => {
    let value;
    if (path.indexOf(o.resource) > -1) {
      if (o.action === "deny") {
        value = o.methods.indexOf(method) > -1 ? "deny" : "allow";
      } else if (o.action === "allow") {
        value = o.methods.indexOf(method) > -1 ? "allow" : "deny";
      }
      if (o.subResource) {
        let innerValue;
        _.map(o.subResource, (action) => {
          if (path.indexOf(action.resource) > -1) {
            if (action.action === "deny") {
              innerValue =
                action.methods.indexOf(method) > -1 ? "deny" : "allow";
            } else if (action.action === "allow") {
              innerValue =
                action.methods.indexOf(method) > -1 ? "allow" : "deny";
            }
          }
        });
        if (innerValue) {
          value = innerValue;
        }
      }
    }

    return value;
  });
  return status.indexOf("allow") > -1 ? "allow" : "deny";
};

const accessRights = () => {
  return async (req, res, next) => {
    const { path, method } = req;
    const rules = aclConfig;
    if (!req.user) {
      const index = findPath(unSecureRoots, path);
      if (index >= 0) {
        return next();
      }

      return next(
        new APIError(
          "Forbidden to access this resource",
          httpStatus.FORBIDDEN,
          true,
          "UnauthorizedError"
        )
      );
    }
    try {
      const roleList = JSON.parse(req.user.role);
      req.user.role = roleList;
      const finalList = _.filter(rank, (ranking) => {
        return roleList.indexOf(ranking.role) > -1;
      });
      const sorted = _.sortBy(finalList, (o) => o.priority);
      const role = sorted.length > 0 ? sorted[0].role : "USER";
      const byGroup = _.keyBy(rules, "group");
      if (byGroup[role].access && byGroup[role].access === "module") {
        const status = checkAuthorisation(
          byGroup[role].permissions,
          path,
          method
        );
        if (status === "allow") {
          return next();
        }
        return next(
          new APIError(
            "Forbidden to access this resource",
            httpStatus.FORBIDDEN,
            true,
            "UnauthorizedError"
          )
        );
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
};

const accessCheck = () => {
  return async (req, res, next) => {
    try {
      const { headers, path } = req;
      const { authorization } = headers;
      const index = findPath(unSecureRoots, path);
      if (index >= 0) {
        return next();
      }
      if (authorization && authorization.split(" ")[0] === "Bearer") {
        const tokenArray = authorization.split(" ");
        const query = {
          sessions: {
            $elemMatch: { accessToken: tokenArray[1], status: true },
          },
          isBlocked: false,
        };
        const access = await userAccess.getAccessData(query);
        if (access == null) {
          return next(
            new APIError(
              "Forbidden to access this resource",
              httpStatus.FORBIDDEN,
              true,
              "UnauthorizedError"
            )
          );
        }
        return next();
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
};

module.exports = {
  roleManager,
  permission,
  security,
  accessRights,
  addUnsecureRoute,
  accessCheck,
};

// removed options from module.exports
