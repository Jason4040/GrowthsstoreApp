import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto px-4 mt-6 pb-[10rem] md:pb-8 max-w-[700px]">
      <ProgressSteps step1 step2 />

      <div className="mt-10">
        <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-none shadow-none">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
              Shipping Address
            </h1>
            <p className="text-gray-500 text-sm">
              Where should we deliver your order?
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Street Address
              </label>
              <input
                type="text"
                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                placeholder="Enter your street address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  City
                </label>
                <input
                  type="text"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Enter your city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Country
              </label>
              <input
                type="text"
                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                placeholder="Enter your country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div className="pt-6 mt-2 border-t border-gray-200 dark:border-gray-800">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Payment Method
              </label>
              <label className="flex items-center gap-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 cursor-pointer hover:border-orange-500/30 transition-colors">
                <input
                  type="radio"
                  className="w-4 h-4 text-orange-600 border-gray-300 dark:border-gray-700 bg-gray-900 focus:ring-orange-500 focus:ring-offset-gray-900"
                  name="paymentMethod"
                  value="Mobile Money"
                  checked={paymentMethod === "Mobile Money"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-gray-900 dark:text-white text-sm font-medium">
                  Mobile Money (MTN / Airtel)
                </span>
              </label>
            </div>

            <button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 mt-4 transition-all active:scale-[0.98]"
              type="submit"
            >
              Continue to Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
