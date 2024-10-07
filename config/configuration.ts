export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || 'ACbdd871f36cdd40265aeb5fb0b1fda496',
  twilio_account_token: process.env.TWILIO_ACCOUNT_TOKEN || '68acc2da18262be27413381fe2c6d284',
  twilio_messaging_sid: process.env.TWILIO_MESSAGING_SID || 'MG1219345642ed31d3905a97f7ecdf2507',
  secret_reference: process.env.SECRET_REFERENCE || 'secret',
});

