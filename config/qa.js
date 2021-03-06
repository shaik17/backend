module.exports = {
  database: {},
  aws: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    bucket: "influencer",
  },
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  jwt_secret: process.env.JWT_SECRET,
  forex: process.env.FOREX,
  key: process.env.ENCRYPTION_KEY,
  ivString: process.env.IV_STRING,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  email: {
    from: "noreply@higglerslab.com",
  },
  sendGrid_templates: {
    email_verify: "d-e836ddba7652470e83befd2e3b6cd4c3",
  },
  rekognition: {
    collection: `Exp-${process.env.ENV}`,
  },
  pk_config: [
    "aws.accessKeyId",
    "aws.secretAccessKey",
    "forex",
    "db_username",
    "db_password",
    "jwt_secret",
    "sendgrid_api_key",
  ],
  base_url: `https://api.staging.influencer.com`,
};
