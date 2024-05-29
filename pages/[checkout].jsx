// nahla-naturals\pages\[checkout].jsx
import React, { useState } from 'react';
import { useStateContext } from '../context/StateContext';

const Checkout = () => {
  const { totalPrice, cartItems } = useStateContext();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCheckout = async () => {
    if (!phoneNumber) {
      alert('Please enter your phone number.');
      return;
    }

    // Replace with your actual checkout logic, such as sending a request to your backend
    const response = await fetch('http://localhost:3000/stkpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber, // Use the phone number entered by the user
        amount: totalPrice,
      }),
    });

    const data = await response.json();
    if (data.success) {
      history.push('/payment-success'); // Redirect to a success page
    } else {
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="checkout-container">
      <h2>Your Cart</h2>
      <div className="checkout-details">
        {cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h4>{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: Ksh {item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <h3>Total: Ksh {totalPrice}</h3>
      <div className="phone-number-input">
        <label htmlFor="phoneNumber">Enter your phone number to complete the payment:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. 0712345678"
        />
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Checkout;
