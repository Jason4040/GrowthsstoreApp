import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useCurrency } from "../../hooks/useCurrency";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { currentCurrency, formatPrice, getPriceValue, getDiscountValue } = useCurrency();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const calculateItemTotal = (item) => {
    let total = item.qty * getPriceValue(item);
    if (item.discountQtyThreshold > 0 && item.qty >= item.discountQtyThreshold) {
      const discount = getDiscountValue(item);
      if (item.discountType === 'per_item') {
        total -= discount * item.qty;
      } else {
        total -= discount;
      }
    }
    return Math.max(0, total); // Prevent negative prices
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  // Recalculate totals based on currency
  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  const shippingPrice = itemsPrice > 100 ? 0 : (currentCurrency === "UGX" ? 38000 : currentCurrency === "RWF" ? 13000 : 10);
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        currency: currentCurrency,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-6 pb-[10rem] md:pb-8 max-w-[1200px]">
      <ProgressSteps step1 step2 step3 />

      <div className="mt-10">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Order Items */}
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    Order Items ({cart.cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-800">
                  {cart.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-16 h-16 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover border border-gray-200 dark:border-gray-800"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-orange-500 hover:text-orange-400 font-medium text-sm truncate block transition-colors"
                        >
                          {item.name}
                        </Link>
                        <span className="text-gray-600 text-xs mt-0.5 block">
                          Qty: {item.qty}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-600">
                          {formatPrice(getPriceValue(item))} × {item.qty}
                          {item.discountQtyThreshold > 0 && item.qty >= item.discountQtyThreshold && (
                            <span className="block text-green-500 mt-1">Discount Applied</span>
                          )}
                        </div>
                        <div className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">
                          {formatPrice(calculateItemTotal(item))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Summary Sidebar */}
            <div className="w-full lg:w-[360px] space-y-6">
              {/* Shipping Info */}
              <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">
                    Shipping Address
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {cart.shippingAddress.address},{" "}
                    {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                    {cart.shippingAddress.country}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                    Shipping Details
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <p><strong>Method:</strong> Standard Delivery (3-5 Business Days)</p>
                    <p><strong>Cost:</strong> {shippingPrice === 0 ? "Free Shipping" : formatPrice(shippingPrice)}</p>
                    {itemsPrice > 100 && (
                      <p className="text-green-500 font-medium text-xs mt-1">✓ You qualified for Free Shipping (Orders over $100)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none p-6">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">
                  Payment Method
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{cart.paymentMethod}</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none p-6">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-5">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Items</span>
                    <span className="text-gray-900 dark:text-white font-medium text-sm">
                      {formatPrice(itemsPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Shipping</span>
                    <span className="text-gray-900 dark:text-white font-medium text-sm">
                      {formatPrice(shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Tax</span>
                    <span className="text-gray-900 dark:text-white font-medium text-sm">
                      {formatPrice(taxPrice)}
                    </span>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white font-semibold">Total</span>
                      <span className="text-2xl font-semibold text-orange-500">
                        {formatPrice(totalPrice.toFixed(2))}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4">
                    <Message variant="danger">{error.data.message}</Message>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 mt-6 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>

                {isLoading && <Loader />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
