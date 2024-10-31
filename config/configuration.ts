export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || '',
  twilio_account_token: process.env.TWILIO_ACCOUNT_TOKEN || '',
  twilio_messaging_sid: process.env.TWILIO_MESSAGING_SID || '',
  secret_name: process.env.SECRET_NAME || 'SECRET_ADMIN_PANEL',
  gcp_project_id_name: process.env.SECRET_NAME || 'tasky-operation-dev',
});