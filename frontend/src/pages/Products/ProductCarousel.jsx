import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import HeartIcon from "../Products/HeartIcon";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full lg:w-[45rem] xl:w-[50rem] 2xl:w-[60rem]"
        >
          {products.map((product) => (
            <div key={product._id} className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-none object-cover h-[20rem] md:h-[30rem] 2xl:h-[35rem] shadow-none border border-gray-800"
              />
              <div className="absolute top-4 right-4 z-10">
                <HeartIcon product={product} />
              </div>

              <div className="mt-8 flex flex-col lg:flex-row justify-between gap-8 px-4">
                <div className="flex-1">
                  <h2 className="text-2xl 2xl:text-3xl font-semibold text-white">{product.name}</h2>
                  <p className="text-pink-500 font-semibold text-xl mt-2">$ {product.price}</p>
                  <p className="mt-4 text-gray-400 leading-relaxed max-w-2xl">
                    {product.description.substring(0, 160)}...
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:w-[20rem] 2xl:w-[25rem] bg-gray-900/50 p-6 rounded-none border border-gray-800 backdrop-blur-sm">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-gray-300">
                      <FaStore className="mr-2 text-pink-500" /> {product.brand}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-300">
                      <FaClock className="mr-2 text-pink-500" />{" "}
                      {moment(product.createdAt).fromNow()}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-300">
                      <FaStar className="mr-2 text-pink-500" /> {product.numReviews} Reviews
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-gray-300">
                      <FaStar className="mr-2 text-pink-500" /> {Math.round(product.rating)} Ratings
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-300">
                      <FaShoppingCart className="mr-2 text-pink-500" /> {product.quantity} Qty
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-300">
                      <FaBox className="mr-2 text-pink-500" /> {product.countInStock} Stock
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
