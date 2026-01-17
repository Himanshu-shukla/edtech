// Generate unique ID with prefix
export const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`.toUpperCase();
};

// Generate customer ID
export const generateCustomerId = (): string => {
  return generateId('CUST');
};

// Generate inquiry ID
export const generateInquiryId = (): string => {
  return generateId('INQ');
};

// Generate payment order ID
export const generatePaymentOrderId = (): string => {
  return generateId('ORD');
};

// Generate payment transaction ID
export const generatePaymentTransactionId = (): string => {
  return generateId('TXN');
};
