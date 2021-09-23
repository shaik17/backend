/* Third Party Modules  */
const express = require("express");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();

/* Internal Modules */
const logger = require("../config/winston")(module);


/* Start Requiring Different Modules for router */
const register = require('./register/routes/register.routes');
const profile = require('./Profile/routes/profile.routes');
const mobile= require('./User/routes/mobile.route');
// const user = require("./users/routes/users.routes");
// const resources = require("./resources/routes/resources.routes");

// const rekogntion = require("./faceRekognition/routes/faceRekognition.routes");
// const wallet = require("./wallet/routes/wallet.routes");
// const regions = require("./regions/routes/regions.route");
// const configurations = require("./configurations/routes/configurations.route");
// const payments = require("./payments/routes/payments.routes");
// const notifications = require("./notifications/routes/notification.routes");
// const hooks = require("./hooks/routes/hooks.routes");
// const stripe = require("./stripe/routes/stripe.routes");
// const razorPay = require("./razorpay/routes/razor.route");
// const ledger = require("./ledger/routes/ledger.routes");
// const profile = require("./Profile/routes/profile.routes");


/* End Requiring Different Modules for router */

router.get("/health-check", (req, res) => {
  logger.info(req.subscribe);
  res.send(res.__("ok"));
});

const options = {
  swaggerDefinition: {
    authAction: {
      JWT: {
        name: "JWT",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "",
        },
        value:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJZZ1kydzEyMmsiLCJyb2xlIjoiW1wiVVNFUlwiXSIsInJlZ2lvbklkIjoiUnR5dWd1Z3V1IiwiaWF0IjoxNTkyMjAyOTcwLCJleHAiOjE1OTIyMDM4NzB9.cPdupQ6NUMcJ1FbcQMjrL_N697snJb1nxRE0vj3hDVA",
      },
    },
    openapi: "3.0.0",
    info: {
      title: "Experience Service",
      version: "1.0.0",
      description: "Visa demo Experience service swagger documentation ",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
      },
    ],
  },
  apis: [
    "./server/**/models/*",
    "./server/**/models/*.schema",
    "./server/**/models/*.schema.yaml",
    "./server/**/controllers/*.js",
  ],
};
const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get(
  "/docs",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

/*
  Start routing different modules here. For code clarity
  please route them in the same order they are required above.
 */
router.use('/v1/register',register);
router.use('/v1/profile',profile);
router.use('/v1/mobile/otp',mobile)

// router.use("/v1/users", user);
// router.use("/v1/resources", resources);
// router.use("/v1/rekogntion", rekogntion);
// router.use("/v1/wallets", wallet);
// router.use("/v1/regions", regions);
// router.use("/v1/configurations", configurations);
// router.use("/v1/payments", payments);
// router.use("/v1/notifications", notifications);
// router.use("/v1/hooks", hooks);
// router.use("/v1/stripe", stripe);
// router.use("/v1/pay", razorPay);
// router.use("/v1/ledgers", ledger);
// router.use("/v1/profile", profile);

/* End routing here */

// 

module.exports = router;
