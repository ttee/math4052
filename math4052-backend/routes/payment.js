const express = require('express');
const QRCode = require('qrcode');

const router = express.Router();

router.post('/paynow', async (req, res) => {
  try {
    const { amount, reference } = req.body;
    const payNowDetails = {
      proxyType: 'UEN',
      proxyValue: process.env.PAYNOW_UEN,
      amount: parseFloat(amount).toFixed(2),
      editable: '0',
      reference: reference || `MATH4052-${Date.now()}`,
      companyName: process.env.COMPANY_NAME,
    };

    const proxyLength = payNowDetails.proxyValue.length.toString().padStart(2, '0');
    const qrPayload = [
      '000201',
      '010211',
      '26040010A000000677010111',
      `02${proxyLength}${payNowDetails.proxyValue}`,
      '52040000',
      '5303702',
      `540${payNowDetails.amount.padStart(8, '0')}`,
      '5802SG',
      `590${payNowDetails.companyName.padEnd(25, ' ')}`,
      '6008SINGAPORE',
      '6304',
    ].join('');

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);
    res.json({ qrCode: qrCodeDataUrl, reference: payNowDetails.reference });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;