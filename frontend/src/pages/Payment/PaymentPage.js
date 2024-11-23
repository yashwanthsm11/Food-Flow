import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';

export default function PaymentPage() {
  const location = useLocation();
  const { clearCart } = useCart();
  const { cart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [ setAmount] = useState(location.state?.amount || '');
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleClick = async () => {
    // Validate the fields before proceeding with payment
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error('Please fill in all payment details (Card Number, Expiry Date, and CVV).');
      return; // Prevent payment if any field is empty
    }
  
    setIsLoading(true);
    showLoading();
  
    try {
      // Simulate a delay as if processing the payment
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Fake payment ID
      const fakePaymentId = 'payment-id-12345';
      
      // Simulate saving the payment
      await pay(fakePaymentId);
  
      clearCart();
      toast.success('Payment Saved Successfully');
      navigate('/orders'); // Navigate to OrderTrackPage with fake order ID
    } catch (error) {
      toast.error('Payment Save Failed');
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };
  

  const formatCardNumber = (number) => {
    return number
      .replace(/\D/g, '') // Remove non-digits
      .match(/.{1,4}/g) // Split into groups of 4
      .join('-'); // Join with dashes
  };

  const handleCardNumberChange = (e) => {
    const inputValue = e.target.value;
    // Remove non-numeric characters
    const numericValue = inputValue.replace(/\D/g, '');
    // Limit to 12 characters
    if (numericValue.length <= 16) {
      setCardNumber(formatCardNumber(numericValue));
    }
  };

  const handleExpiryDateChange = (e) => {
    const inputValue = e.target.value;
    // Remove non-numeric characters
    const numericValue = inputValue.replace(/\D/g, '');
    // Format to MM/YY
    if (numericValue.length <= 4) {
      const formattedValue = numericValue.length > 2 
        ? `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}`
        : numericValue;
      setExpiryDate(formattedValue);
    }
  };

  const handleCvvChange = (e) => {
    const inputValue = e.target.value;
    // Remove non-numeric characters and limit to 3 digits
    const numericValue = inputValue.replace(/\D/g, '').slice(0, 3);
    setCvv(numericValue);
  };

  // Inline styles for centering content
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4', // Optional: background color
    margin: 0,
  };

  const formStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'black',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Make Payment</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Amount-₹:
            <input
              type="text"
              value={cart.totalPrice}
              readOnly
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ 
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </label>
          <br />
          <label>Card Number:</label>
          <input
            id="credit-card"
            type="text"
            placeholder="1234-5678-9012"
            value={cardNumber}
            onChange={handleCardNumberChange}
            style={{ 
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <br />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: '1' }}>
              <label>Expiry:</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength="5"
                style={{ 
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>CVV:</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength="3"
                style={{ 
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          <br />
          <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            style={isLoading ? buttonDisabledStyle : buttonStyle}
          >
            {isLoading ? 'Processing…' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  );
}
