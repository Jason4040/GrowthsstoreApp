import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmModal from "../../components/ConfirmModal";
import { isValidVideoLink } from "../../Utils/videoHelper";
import ProductVideo from "../../components/ProductVideo";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [images, setImages] = useState(productData?.images || []);
  const [video, setVideo] = useState(productData?.video || ""); // Cloudinary uploaded video URL
  const [videoSourceType, setVideoSourceType] = useState("upload"); // 'upload' or 'link'
  const [videoLink, setVideoLink] = useState(""); // YouTube/TikTok URL
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [priceUGX, setPriceUGX] = useState(productData?.priceUGX || "");
  const [priceRWF, setPriceRWF] = useState(productData?.priceRWF || "");
  const [discountQtyThreshold, setDiscountQtyThreshold] = useState(productData?.discountQtyThreshold || 0);
  const [discountType, setDiscountType] = useState(productData?.discountType || "per_item");
  const [discountUSD, setDiscountUSD] = useState(productData?.discountUSD || 0);
  const [discountUGX, setDiscountUGX] = useState(productData?.discountUGX || 0);
  const [discountRWF, setDiscountRWF] = useState(productData?.discountRWF || 0);
  const [stockStatus, setStockStatus] = useState(productData?.stockStatus || "in_stock");
  const [negotiable, setNegotiable] = useState(productData?.negotiable || false);
  const [dateRange, setDateRange] = useState([
    productData?.availabilityStartDate ? new Date(productData.availabilityStartDate) : null,
    productData?.availabilityEndDate ? new Date(productData.availabilityEndDate) : null,
  ]);
  const [startDate, endDate] = dateRange;
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || 0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setPriceUGX(productData.priceUGX || "");
      setPriceRWF(productData.priceRWF || "");
      setDiscountQtyThreshold(productData.discountQtyThreshold || 0);
      setDiscountType(productData.discountType || "per_item");
      setDiscountUSD(productData.discountUSD || 0);
      setDiscountUGX(productData.discountUGX || 0);
      setDiscountRWF(productData.discountRWF || 0);
      setStockStatus(productData.stockStatus || "in_stock");
      setNegotiable(productData.negotiable || false);
      setDateRange([
        productData.availabilityStartDate ? new Date(productData.availabilityStartDate) : null,
        productData.availabilityEndDate ? new Date(productData.availabilityEndDate) : null,
      ]);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setImages(productData.images || []);
      if (productData.video) {
        if (isValidVideoLink(productData.video)) {
          setVideoSourceType("link");
          setVideoLink(productData.video);
          setVideo("");
        } else {
          setVideoSourceType("upload");
          setVideo(productData.video);
          setVideoLink("");
        }
      } else {
        setVideoSourceType("upload");
        setVideo("");
        setVideoLink("");
      }
      setStock(productData.countInStock || 0);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    let uploadedImages = [...images];
    let firstImage = image;

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await uploadProductImage(formData).unwrap();
        uploadedImages.push(res.image);
        if (!firstImage) firstImage = res.image;
        toast.success("Image uploaded successfully", { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
      } catch (error) {
        toast.error(error?.data?.message || error.error, { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
      }
    }
    setImages(uploadedImages);
    setImage(firstImage);
  };

  const uploadVideoHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]); // using 'image' field for video as per upload route
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Video uploaded successfully", { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
      setVideo(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error, { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Link validation check
    let finalVideoValue = "";
    if (videoSourceType === "link") {
      if (videoLink) {
        if (!isValidVideoLink(videoLink)) {
          toast.error("Please enter a valid YouTube or TikTok video URL.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          return;
        }
        finalVideoValue = videoLink;
      }
    } else {
      finalVideoValue = video;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("priceUGX", priceUGX);
      formData.append("priceRWF", priceRWF);
      formData.append("discountQtyThreshold", discountQtyThreshold);
      formData.append("discountType", discountType);
      formData.append("discountUSD", discountUSD);
      formData.append("discountUGX", discountUGX);
      formData.append("discountRWF", discountRWF);
      formData.append("stockStatus", stockStatus);
      if (startDate) formData.append("availabilityStartDate", startDate.toISOString());
      if (endDate) formData.append("availabilityEndDate", endDate.toISOString());
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      formData.append("negotiable", negotiable);
      formData.append("images", JSON.stringify(images));
      formData.append("video", finalVideoValue || "");

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* <AdminMenu /> */}
        <div className="w-full bg-gray-100 dark:bg-[#151515] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Update / Delete Product</h1>

          {image && (
            <div className="mb-8 text-center bg-gray-50 dark:bg-[#101010] p-4 rounded-xl border border-gray-200 dark:border-gray-800 inline-block w-full">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[300px] rounded-lg shadow-lg object-contain"
              />
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 hover:bg-white dark:bg-[#1A1A1A] transition-all text-gray-900 dark:text-white px-4 block w-full text-center rounded-xl cursor-pointer font-medium py-16 flex flex-col items-center justify-center group">
                <div className="w-12 h-12 mb-4 rounded-full bg-gray-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors text-lg">
                  {images.length > 0 ? `${images.length} images uploaded` : "Click or drag to upload Images"}
                </span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  multiple
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
              {images.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <img key={idx} src={img} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-800" />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Video Source (Select Only One)
              </label>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white font-medium">
                  <input
                    type="radio"
                    name="videoSourceType"
                    value="upload"
                    checked={videoSourceType === "upload"}
                    onChange={() => setVideoSourceType("upload")}
                    className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                  />
                  Upload Video File
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white font-medium">
                  <input
                    type="radio"
                    name="videoSourceType"
                    value="link"
                    checked={videoSourceType === "link"}
                    onChange={() => setVideoSourceType("link")}
                    className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                  />
                  Use Video Link
                </label>
              </div>

              {videoSourceType === "upload" ? (
                <div>
                  <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 hover:bg-white dark:bg-[#101010] transition-all text-gray-900 dark:text-white px-4 block w-full text-center rounded-xl cursor-pointer font-medium py-10 flex flex-col items-center justify-center group">
                    <div className="w-10 h-10 mb-3 rounded-full bg-gray-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors text-sm">
                      {video ? "Video File Uploaded" : "Click to upload Video file"}
                    </span>
                    <input
                      type="file"
                      name="video"
                      accept="video/*"
                      onChange={uploadVideoHandler}
                      className="hidden"
                    />
                  </label>
                  {video && (
                    <div className="mt-4">
                      <ProductVideo videoUrl={video} isCover={false} className="w-full h-32 rounded-lg border border-gray-200 dark:border-gray-800" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="videoLink" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    YouTube or TikTok Video URL
                  </label>
                  <input
                    type="text"
                    id="videoLink"
                    className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  />
                  {videoLink && isValidVideoLink(videoLink) && (
                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-gray-500 mb-2">Video Preview:</label>
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                        <ProductVideo videoUrl={videoLink} isCover={false} className="w-full h-full" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Regional Pricing <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <span className="bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-orange-500 border-r border-gray-200 dark:border-gray-800">USD</span>
                    <input
                      type="number"
                      className="bg-transparent text-gray-900 dark:text-white px-4 py-3 w-32 outline-none text-sm placeholder-gray-600"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <span className="bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-orange-500 border-r border-gray-200 dark:border-gray-800">UGX</span>
                    <input
                      type="number"
                      className="bg-transparent text-gray-900 dark:text-white px-4 py-3 w-32 outline-none text-sm placeholder-gray-600"
                      value={priceUGX}
                      onChange={(e) => setPriceUGX(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <span className="bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-orange-500 border-r border-gray-200 dark:border-gray-800">RWF</span>
                    <input
                      type="number"
                      className="bg-transparent text-gray-900 dark:text-white px-4 py-3 w-32 outline-none text-sm placeholder-gray-600"
                      value={priceRWF}
                      onChange={(e) => setPriceRWF(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A]/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bulk Discounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Required Quantity to Trigger Discount</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    value={discountQtyThreshold}
                    onChange={(e) => setDiscountQtyThreshold(Number(e.target.value))}
                    placeholder="e.g. 5"
                  />
                  <p className="text-xs text-gray-500 mt-2">Set to 0 to disable quantity discounts.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Discount Applied To:</label>
                  <select
                    className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="per_item">Each Item (Deducted from unit price)</option>
                    <option value="overall">Overall Total (Deducted once from total)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Discount Values</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <span className="bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-orange-500 border-r border-gray-200 dark:border-gray-800">USD</span>
                    <input
                      type="number"
                      className="bg-transparent text-gray-900 dark:text-white px-4 py-3 w-32 outline-none text-sm placeholder-gray-600"
                      value={discountUSD}
                      onChange={(e) => setDiscountUSD(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <span className="bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-orange-500 border-r border-gray-200 dark:border-gray-800">UGX</span>
                    <input
                      type="number"
                      className="bg-transparent text-gray-900 dark:text-white px-4 py-3 w-32 outline-none text-sm placeholder-gray-600"
                      value={discountUGX}
                      onChange={(e) => setDiscountUGX(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <span className="bg-white dark:bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-orange-500 border-r border-gray-200 dark:border-gray-800">RWF</span>
                    <input
                      type="number"
                      className="bg-transparent text-gray-900 dark:text-white px-4 py-3 w-32 outline-none text-sm placeholder-gray-600"
                      value={discountRWF}
                      onChange={(e) => setDiscountRWF(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Stock Status</label>
                <select
                  className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                >
                  <option value="in_stock">In Stock (Track Inventory)</option>
                  <option value="requires_shipping">Requires Shipping (Pre-order / Request)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Availability Date Range</label>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable={true}
                  className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholderText="Select start and end dates"
                  dateFormat="yyyy/MM/dd"
                />
              </div>
            </div>

            {stockStatus === "in_stock" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Count In Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="Choose Category">Choose Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pricing Type</label>
                <select
                  className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={negotiable}
                  onChange={(e) => setNegotiable(e.target.value === "true")}
                >
                  <option value="false">Fixed Price</option>
                  <option value="true">Negotiable</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all min-h-[150px] resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description..."
              />
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-4">
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-gray-900 dark:text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-green-500/30 active:scale-95"
              >
                Update Product
              </button>
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-gray-900 dark:text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-red-500/30 active:scale-95"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default AdminProductUpdate;
