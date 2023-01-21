export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || 'ACa4234bf9038ae0707ef0ad68b2fa6fe3',
    twilio_account_token: process.env.TWILIO_ACCOUNT_TOKEN || 'dd420bd1cb83d6f588c8f49a2fbbafd0',
});
