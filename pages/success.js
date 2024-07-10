import React, { useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import Cookies from 'js-cookie';

import { useStateContext } from "@/context/StateContext";
import { runFireworks } from "@/lib/utils";

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    // Clear local storage
    localStorage.clear();

    // Clear cart context state
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);

    // Clear cookies
    Cookies.remove('cartItems');
    Cookies.remove('totalPrice');
    Cookies.remove('totalQuantities');

    // Run fireworks animation
    runFireworks();
  }, [setCartItems, setTotalPrice, setTotalQuantities]);

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any questions, please email
          <a className="email" href="mailto:lumumbastacey@gmail.com">
            lumumbastacey@gmail.com
          </a>
        </p>
        <Link href="/">
          <button type="button" width="300px" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;