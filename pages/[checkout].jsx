// nahla-naturals\pages\[checkout].jsx
import React, { useState } from "react";
import { useStateContext } from "../context/StateContext";
import toast, { Toaster } from 'react-hot-toast';
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

    const paymentPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(API_ENDPOINTS.push, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: formattedPhoneNumber,
            amount: totalPrice,
          }),
        });

        const data = await response.json();
        if (data[0] === "success") {
          const checkoutRequestID = data[1].CheckoutRequestID;
          setCheckoutRequestID(checkoutRequestID);
          setShowModal(true);
          setTimeout(async () => {
            try {
              await pollPaymentStatus(checkoutRequestID);
              resolve();
            } catch (error) {
              reject(error);
            }
          }, 75000);
        } else {
          reject(new Error("STK push request failed"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(
      paymentPromise,
      {
        loading: 'Awaiting Payment...',
        success: <b>Payment Successful!</b>,
        error: (err) => <b>{err.message}</b>,
      }
    );
  };

  const pollPaymentStatus = async (checkoutRequestID) => {
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
      window.location.href = "/success";
    } else {
      throw new Error(pollingData[1].ResultDesc);
    }
  };

  // manual payment verification to '/polling_payment
  const handleManualCheck = async () => {
    if (checkoutRequestID) {
      try {
        await pollPaymentStatus(checkoutRequestID);
        toast.success("Payment verified successfully!");
      } catch (error) {
        toast.error("Error during payment verification. Please try again.");
      }
    } else {
      toast.error("No payment in process to check.");
    }
  };

  const handleModalBackgroundClick = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowModal(false);
    }
  };

  return (
    <div className="checkout-container">
      <Toaster />
      <h2 className="checkout-title">Your Cart</h2>
      <div className="checkout-details">
        {cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <img src={urlFor(item?.image[0])} alt={item.name} className="checkout-item-image" />
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
            <p>We are checking your payment and we shall verify it in 1 minute
            and 15 seconds.</p>
            <p>If nothing happens in over a minute's time, please hit the verify payment button.</p>
            <button onClick={() => setShowModal(false)} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
