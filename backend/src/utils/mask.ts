export const maskAadhaar = (aadhaar: string): string => {
  if (!aadhaar || aadhaar.length < 4) return aadhaar;
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
};
