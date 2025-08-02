import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/paynow`, { amount });
      setQrCode(res.data.qrCode);
      setReference(res.data.reference);
    } catch (err) {
      alert('Failed to generate QR');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Math4052 - Pay with PayNow</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          placeholder="Amount (SGD)" 
          className="input block w-full mb-4 focus:outline-none" 
          required 
          min="0.01" 
          step="0.01" 
        />
        <button type="submit" disabled={loading} className="button bg-primary text-white w-full hover:bg-blue-600 disabled:bg-gray-300">
          {loading ? 'Generating...' : 'Generate QR'}
        </button>
      </form>
      {qrCode && (
        <div className="mt-6 text-center">
          <QRCode value={qrCode} size={256} className="mx-auto mb-4" />
          <p className="text-sm text-gray-600">Reference: {reference}</p>
          <p className="text-sm text-gray-600">Scan to pay {amount} SGD for Math4052. Verify manually after payment.</p>
        </div>
      )}
    </div>
  );
};

export default Payment;