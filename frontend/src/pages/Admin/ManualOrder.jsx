import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { useCreateManualOrderMutation } from "../../redux/api/orderApiSlice";
import { useCurrency } from "../../hooks/useCurrency";

const ManualOrder = () => {
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  
  const { currentCurrency, formatPrice, getPriceValue } = useCurrency();

  const { data: products } = useAllProductsQuery();
  const [createManualOrder, { isLoading }] = useCreateManualOrderMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !qty || !paidAmount) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createManualOrder({
        productId,
        qty: Number(qty),
        customerName: customerName || "Guest",
        paidAmount: Number(paidAmount),
        currency: currentCurrency,
      }).unwrap();

      toast.success("Offline order recorded successfully");
      setProductId("");
      setQty(1);
      setCustomerName("");
      setPaidAmount("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Auto-fill price based on product and qty
  useEffect(() => {
    if (productId && products) {
      const selectedProduct = products.find((p) => p._id === productId);
      if (selectedProduct) {
        const unitPrice = getPriceValue(selectedProduct);
        setPaidAmount(unitPrice * qty);
      }
    }
  }, [productId, qty, products, currentCurrency]); // Depend on currency to update price if currency changes

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="w-full bg-gray-100 dark:bg-[#151515] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Record Offline Sale</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Product *</label>
            <select
              className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select a product</option>
              {products?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - {formatPrice(p)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Quantity *</label>
              <input
                type="number"
                min="1"
                className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Customer Name (Optional)</label>
              <input
                type="text"
                className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Guest"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Amount Paid in {currentCurrency} *
            </label>
            <input
              type="number"
              className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-gray-900 dark:text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-green-500/30 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Recording..." : "Record Offline Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualOrder;
