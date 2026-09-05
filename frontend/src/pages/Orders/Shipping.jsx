import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import { useGetLocationsQuery } from "../../redux/api/locationApiSlice";
import { LOCATION_LEVELS, SHIPPING_COUNTRIES } from "../../Utils/locationLevels";
import ProgressSteps from "../../components/ProgressSteps";

const selectClasses =
  "w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [country, setCountry] = useState(
    SHIPPING_COUNTRIES.includes(shippingAddress.country) ? shippingAddress.country : SHIPPING_COUNTRIES[0]
  );
  const [selectedL1, setSelectedL1] = useState(null);
  const [selectedL2, setSelectedL2] = useState(null);
  const [selectedL3, setSelectedL3] = useState(null);

  const levels = LOCATION_LEVELS[country];

  const { data: level1Options } = useGetLocationsQuery({ country, level: 0 });
  const { data: level2Options } = useGetLocationsQuery(
    { country, level: 1, parent: selectedL1?._id },
    { skip: !selectedL1 }
  );
  const { data: level3Options } = useGetLocationsQuery(
    { country, level: 2, parent: selectedL2?._id },
    { skip: !selectedL2 }
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setSelectedL1(null);
    setSelectedL2(null);
    setSelectedL3(null);
  };

  const pickFrom = (options, id) => options?.find((o) => o._id === id) || null;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        country,
        location: [
          { level: levels[0], name: selectedL1.name },
          { level: levels[1], name: selectedL2.name },
          { level: levels[2], name: selectedL3.name },
        ],
        address,
      })
    );
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
                Country
              </label>
              <select
                className={selectClasses}
                value={country}
                required
                onChange={handleCountryChange}
              >
                {SHIPPING_COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {levels[0]}
                </label>
                <select
                  className={selectClasses}
                  value={selectedL1?._id || ""}
                  required
                  onChange={(e) => {
                    setSelectedL1(pickFrom(level1Options, e.target.value));
                    setSelectedL2(null);
                    setSelectedL3(null);
                  }}
                >
                  <option value="">Select {levels[0]}</option>
                  {level1Options?.map((o) => (
                    <option key={o._id} value={o._id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {levels[1]}
                </label>
                <select
                  className={selectClasses}
                  value={selectedL2?._id || ""}
                  required
                  disabled={!selectedL1}
                  onChange={(e) => {
                    setSelectedL2(pickFrom(level2Options, e.target.value));
                    setSelectedL3(null);
                  }}
                >
                  <option value="">Select {levels[1]}</option>
                  {level2Options?.map((o) => (
                    <option key={o._id} value={o._id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {levels[2]}
                </label>
                <select
                  className={selectClasses}
                  value={selectedL3?._id || ""}
                  required
                  disabled={!selectedL2}
                  onChange={(e) => setSelectedL3(pickFrom(level3Options, e.target.value))}
                >
                  <option value="">Select {levels[2]}</option>
                  {level3Options?.map((o) => (
                    <option key={o._id} value={o._id}>{o.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Address Details
              </label>
              <input
                type="text"
                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                placeholder="Street, plot number, or landmark for the courier"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
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
