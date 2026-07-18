import { useSelector } from "react-redux";
import { useToggleProductPinMutation, useDeleteProductMutation } from "../redux/api/productApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Pin } from "lucide-react";

const AdminProductControls = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [toggleProductPin] = useToggleProductPinMutation();
  const [deleteProduct] = useDeleteProductMutation();

  if (!userInfo?.isAdmin) {
    return null;
  }

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/product/update/${product._id}`);
  };

  const handleTogglePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleProductPin(product._id).unwrap();
      toast.success(res.isPinned ? "Product pinned to homepage" : "Product unpinned", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update pin status", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product._id).unwrap();
        toast.success("Product deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } catch (err) {
        toast.error(err?.data?.message || err.error || "Failed to delete product", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-white dark:bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        onClick={handleTogglePin} 
        title={product.isPinned ? "Unpin Product" : "Pin to Homepage Slider"}
        className={`p-1.5 rounded-full transition-colors ${product.isPinned ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white'}`}
      >
        <Pin size={14} className={product.isPinned ? "" : "transform rotate-45"} />
      </button>
      
      <button 
        onClick={handleEdit} 
        title="Edit Product"
        className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors"
      >
        <Edit size={14} />
      </button>
      
      <button 
        onClick={handleDelete} 
        title="Delete Product"
        className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default AdminProductControls;
