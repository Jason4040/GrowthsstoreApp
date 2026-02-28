import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaRegFrownOpen } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-8 max-w-[1400px]">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#101010] border border-gray-800 rounded-none w-full shadow-none mt-8">
            <FaRegFrownOpen size={80} className="text-gray-700 mb-6" />
            <h2 className="text-2xl font-medium text-white mb-2 uppercase tracking-widest">Your Cart Is Empty</h2>
            <p className="text-gray-500 mb-8 italic">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/shop"
              className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-10 rounded-none transition-all shadow-none border border-pink-500 active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <h1 className="text-3xl font-medium mb-8 text-white">Shopping Cart</h1>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-center gap-4 hover:border-pink-500 transition-all">
                    <div className="w-full sm:w-24 h-24 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <Link to={`/product/${item._id}`} className="text-lg font-medium text-pink-500 hover:text-pink-400">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-400 mt-1">{item.brand}</div>
                      <div className="text-lg font-medium text-white mt-1">$ {item.price}</div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                      <div className="w-20">
                        <select
                          className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-pink-500 outline-none"
                          value={item.qty}
                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-900 rounded-lg"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Summary */}
            <div className="w-full lg:w-[25rem]">
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 sticky top-24">
                <h2 className="text-2xl font-medium mb-6 text-white border-b border-gray-800 pb-4">Order Summary</h2>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total Items:</span>
                  <span className="text-white font-medium">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-3xl font-medium text-pink-500">
                    $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                  </span>
                </div>

                <button
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-4 rounded-xl text-lg transition-all transform active:scale-95 disabled:bg-gray-600 shadow-lg flex items-center justify-center gap-2"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
