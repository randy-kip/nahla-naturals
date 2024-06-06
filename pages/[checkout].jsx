// nahla-naturals\pages\[checkout].jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useStateContext } from "../context/StateContext";

import API_ENDPOINTS from "@/config/api";
import { urlFor } from "@/lib/client";

const Checkout = () => {
  const { totalPrice, cartItems } = useStateContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutRequestID, setCheckoutRequestID] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      toast.error("Please enter your phone number.");
      return;
    }

    const formattedPhoneNumber = reformatPhoneNumber(phoneNumber);

    // Validate the reformatted phone number
    if (formattedPhoneNumber.length !== 12) {
      toast.error("Please enter a valid phone number.");
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
        setCheckoutRequestID(checkoutRequestID);

        // Show the modal
        setShowModal(true);

        // Wait for 1 minute and 15 seconds before polling payment status
        setTimeout(async () => {
          await pollPaymentStatus(checkoutRequestID);
        }, 75000); // 1 minute and 15 seconds = 75000 milliseconds
      } else {
        // Handle initial request failure
        console.error("STK push request failed:", data);
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      toast.error("Error during payment process. Please try again.");
    }
  };

  const pollPaymentStatus = async (checkoutRequestID) => {
    try {
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

      if (
        pollingData[0] === "success" &&
        pollingData[1].ResultDesc ===
          "The service request is processed successfully."
      ) {
        // Redirect to success page
        toast.success("Payment Successful!")
        window.location.href = "/success";
      } else {
        // Handle other ResultDesc cases
        console.log("Payment status:", pollingData[1].ResultDesc);
        toast.error("Payment status: " + pollingData[1].ResultDesc);
      }
    } catch (error) {
      console.error("Error during polling process:", error);
      toast.error("Error during polling process. Please try again.");
    }
  };

  // manual payment verification to '/polling_payment
  const handleManualCheck = async () => {
    if (checkoutRequestID) {
      await pollPaymentStatus(checkoutRequestID);
    } else {
      toast.error("No payment in process to check.");
    }
  };

  const handleModalBackgroundClick = (e) => {
    // Close the modal if the user clicks outside the modal content
    if (e.target.classList.contains("modal")) {
      setShowModal(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Your Cart</h2>
      <div className="checkout-details">
        {cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <img
              src={urlFor(item?.image[0])}
              alt={item.name}
              className="checkout-item-image"
            />
            <div>
              <h4>{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: Ksh. {item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <h3 className="total-price">Total: Ksh. {totalPrice}</h3>
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
      <div className="buttons-container">
        <button className="checkout-btn" onClick={handleCheckout}>
          Pay 🫰🏿
        </button>
        <button className="manual-check-btn" onClick={handleManualCheck}>
          Verify Payment
        </button>
      </div>

      {showModal && (
        <div className="modal" onClick={handleModalBackgroundClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Processing Payment</h2>
            <p>
              We are checking your payment and we shall verify it in 1 minute
              and 15 seconds.
            </p>
            <p>
              If nothing happens in over a minute's time, please hit the verify
              payment button.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="close-modal-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
