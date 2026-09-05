import { useSelector } from "react-redux";

const formatNumber = (value) => {
  const num = Number(value) || 0;
  const isWhole = Number.isInteger(num);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

export const useCurrency = () => {
  const { currentCurrency } = useSelector((state) => state.currency);

  const formatPrice = (productOrPrice) => {
    // If it's a number (e.g. cart total), we just format it as the base currency (USD) converted.
    // Wait, the backend stores product.priceUGX.
    // So if it's a product object, we fetch the specific field:
    if (typeof productOrPrice === "object" && productOrPrice !== null) {
      if (currentCurrency === "UGX") return `USh ${formatNumber(productOrPrice.priceUGX)}`;
      if (currentCurrency === "RWF") return `FRw ${formatNumber(productOrPrice.priceRWF)}`;
      return `$${formatNumber(productOrPrice.price)}`;
    }

    // If it's a raw number (like total items price), it's tricky because the cart needs to recalculate based on currency.
    // It's better if cart items store the product object so we can sum the specific currency fields.
    // Let's handle simple number formatting as USD (fallback) or assume it's already in the correct currency.
    if (currentCurrency === "UGX") return `USh ${formatNumber(productOrPrice)}`;
    if (currentCurrency === "RWF") return `FRw ${formatNumber(productOrPrice)}`;
    return `$${formatNumber(productOrPrice)}`;
  };

  const getPriceValue = (product) => {
    if (currentCurrency === "UGX") return product.priceUGX || 0;
    if (currentCurrency === "RWF") return product.priceRWF || 0;
    return product.price || 0;
  };

  const getDiscountValue = (product) => {
    if (currentCurrency === "UGX") return product.discountUGX || 0;
    if (currentCurrency === "RWF") return product.discountRWF || 0;
    return product.discountUSD || 0;
  };

  return { currentCurrency, formatPrice, getPriceValue, getDiscountValue };
};
