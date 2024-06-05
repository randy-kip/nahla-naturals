// nahla-naturals\config\api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  push: `${API_BASE_URL}/stkpush`,
  polling: `${API_BASE_URL}/polling_payment`,
//   products: `${API_BASE_URL}/api/products`,
//   checkout: `${API_BASE_URL}/api/checkout`,
  // Add more endpoints as needed
};

export default API_ENDPOINTS;
