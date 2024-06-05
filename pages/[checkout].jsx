// nahla-naturals\pages\[checkout].jsx
import React, { useState } from "react";
import { useStateContext } from "../context/StateContext";

import API_ENDPOINTS from "@/config/api";
import { urlFor } from "@/lib/client";

const Checkout = () => {
  const { totalPrice, cartItems } = useStateContext();
  const [phoneNumber, setPhoneNumber] = useState("");

  const reformatPhoneNumber = (number) => {
    // Remove any non-digit characters
    let formattedNumber = number.replace(/\D/g, "");

    if (formattedNumber.startsWith("0")) {
      // Replace the starting 0 with 254
      formattedNumber = "254" + formattedNumber.substring(1);
    } else if (formattedNumber.startsWith("+254")) {
      // Remove the leading +
      formattedNumber = formattedNumber.substring(1);
    }

    return formattedNumber;
  };

  const handleCheckout = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }

    const formattedPhoneNumber = reformatPhoneNumber(phoneNumber);

    // Validate the reformatted phone number
    if (formattedPhoneNumber.length !== 12) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Checkout logic, posting to stkpush
    try {
      const response = await fetch(API_ENDPOINTS.push, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber, // Use the formatted phone number
          amount: totalPrice,
        }),
      });

      const data = await response.json();

      if (data[0] === "success") {
        const checkoutRequestID = data[1].CheckoutRequestID;

        // Polling payment status
        const pollingResponse = await fetch(API_ENDPOINTS.polling, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkoutRequestID: checkoutRequestID,
          }),
        });

        const pollingData = await pollingResponse.json();

        if (pollingData[0] === "success" && pollingData[1].ResultDesc === "The service request is processed successfully.") {
          // Redirect to success page
          window.location.href = "/success";
        } else {
          // Handle other ResultDesc cases
          console.log("Payment status:", pollingData[1].ResultDesc);
          alert("Payment status: " + pollingData[1].ResultDesc);
        }
      } else {
        // Handle initial request failure
        console.error("STK push request failed:", data);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Error during payment process. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Your Cart</h2>
      <div className="checkout-details">
        {cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <img src={urlFor(item?.image[0])} alt={item.name} />
            <div>
              <h4>{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: Ksh. {item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <h3>Total: Ksh. {totalPrice}</h3>
      <div className="phone-number-input">
        <label htmlFor="phoneNumber">
          Enter your phone number to complete the payment:
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. 254712345678"
        />
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>
        Pay 🫰🏿
      </button>
    </div>
  );
};

export default Checkout;