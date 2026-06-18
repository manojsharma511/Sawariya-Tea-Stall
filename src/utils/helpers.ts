/**
 * Formats a currency amount into Indian Rupee format.
 * @param amount Number to format
 */
export const formatRupee = (amount: number | string): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return `₹${amount}`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};
