/* Third Part NPMs */
const express = require("express");
const i18n = require("i18n");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const uuid = require("uuid");
const httpContext = require("express-http-context");
const methodOverride = require("method-override");
const swig = require("swig");
const helmet = require("helmet");
const cors = require("cors");
const sts = require("strict-transport-security");
const authSupport = require("../server/middleware/auth.middleware");

/* Internal files or modules */
const routes = require("../server/index");
const unroute = require("./unsecured");
const resources = require("../server/resources");
const initAWS = require("../config/aws");

const globalSTS = sts.getSTS({
  "max-age": { days: 365 },
  includeSubDomains: true,
});

const generateRequestId = () => {
  return (req, res, next) => {
    try {
      const requestId = req.headers["x-request-id"] || uuid.v4();
      httpContext.set("requestId", requestId);
      return next();
    } catch (e) {
      console.log(`Unique id generation Error: ${JSON.stringify(e)}`);
      return next(e);
    }
  };
};

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || process.env.ENV || "development";

  if (env !== "development") {
    const envConfig = `./config/${env}.js`;
    protectConfig.init(envConfig);
  }
  app.engine("swig", swig.renderFile);
  if (env === "development") {
    app.set("view cache", false);
    swig.setDefaults({ cache: false });
  }

  app.set("view engine", "swig");
  app.use(helmet());
  app.use(globalSTS);

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(cors());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(authSupport.security);
  app.use(authSupport.accessRights());

  unroute.auth.forEach((route) => {
    authSupport.addUnsecureRoute(route.url, route.method, route.regex);
  });
  app.use(httpContext.middleware);
  app.use(generateRequestId());
  app.use(initAWS());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${config.root}/public`));
  app.use(methodOverride());

  /*
    Localisation configuration:
    This takes locales to be supported. en will be our default locale.
    In future we need to add new locale to locales array.
  */
  i18n.configure({
    locales: ["en"],
    defaultLocale: "en",
    directory: path.join(__dirname, "../locales"),
  });

  /*
   This will populate in res object of express middleware, with the locale.
   Which can be accessed as res.__('<Placeholder Value>').
   Placeholder keys and translations are in corresponding locale files in locales directory.
  */
  app.use(i18n.init);

  app.use("/api/", routes);
  app.use("/resources/", resources);

  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  if (app.get("env") === "development") {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err,
        title: `Error Code: ${err.errorCode || ""} ${err.name}`,
      });
    });
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {},
      title: `Error Code: ${err.errorCode || ""} ${err.name}`,
    });
  });

  return app;
};
