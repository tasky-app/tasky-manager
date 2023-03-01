export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || "ACa4234bf9038ae0707ef0ad68b2fa6fe3",
  twilio_account_token: process.env.TWILIO_ACCOUNT_TOKEN || "dd420bd1cb83d6f588c8f49a2fbbafd0",
  twilio_verify_sid: process.env.TWILIO_VERIFY_SID || "VA6b36c1961e6a5af9d29ead2d87a22b77",
  db_port: parseInt(process.env.DB_PORT) || 3306,
  db_username: process.env.DB_USERNAME || "root",
  db_pass: process.env.DB_PASS || "Colombia1*",
  db_name: process.env.DB_NAME || "tasky_db"
});
