export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || 'ACa4234bf9038ae0707ef0ad68b2fa6fe3',
  twilio_account_token: process.env.TWILIO_ACCOUNT_TOKEN || 'dd420bd1cb83d6f588c8f49a2fbbafd0',
  twilio_messaging_sid: process.env.TWILIO_MESSAGING_SID || 'MG1219345642ed31d3905a97f7ecdf2507',
  secret_name: process.env.SECRET_NAME || 'SECRET_ADMIN_PANEL',
  gcp_project_id_name: process.env.SECRET_NAME || 'tasky-operation-dev',
});