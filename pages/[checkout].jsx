import React, { useState, useEffect } from 'react';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const CheckoutPage = ({ items, total }) => {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');

//   const clientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Logic for creating a PayPal order
  const createOrder = async (data, actions) => {
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: 'Your Order',
            amount: {
              currency_code: 'USD',
              value: total,
              breakdown: {
                item_total: { currency_code: 'USD', value: total },
              }
            },
            items: items.map((item) => ({
              name: item.name,
              description: item.description || '', 
              unit_amount: { currency_code: 'USD', value: item.price },
              quantity: item.quantity
            }))
          }
        ]
      });

      const response = await actions.order.create(request);
      setOrderId(response.result.id);
      return response.result.id;
    } catch (error) {
      console.error(error);
      setErrorMessage("Error creating order");
    }
  };

  // Logic for capturing a PayPal order
  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      setSuccess(true);
      console.log('Order captured:', order);
      // Redirect to success page or update order status
    } catch (error) {
      console.error(error);
      setErrorMessage("Error capturing order");
    }
  };

  useEffect(() => {
    if (success) {
      // Handle successful payment (e.g., redirect, update order status)
      console.log('Payment Successful! Update your backend database to reflect this.');
    }
  }, [success]);

  return (
    // <PayPalScriptProvider options={{ "client-id": clientID }}>
    //   {/* ... Your styling/layout for the checkout page ... */}
    //   <PayPalButtons
    //      createOrder={createOrder}
    //      onApprove={onApprove}
    //   />
    //   {/* ... Handle error messages or success messages ... */}
    // </PayPalScriptProvider>
    
    <>
        <h3>CheckOut</h3>
    </>
  );
};

export default CheckoutPage;
