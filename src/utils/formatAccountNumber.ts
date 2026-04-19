export const formatAccountNumber = (number: string, masked = true) => {
  const digits = number.replace(/\s+/g, "");

  if (!masked) {
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  if (digits.length <= 4) {
    return digits;
  }

  return `****  ****  ****  ${digits.slice(-4)}`;
};
