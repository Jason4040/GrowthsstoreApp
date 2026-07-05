import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const About = () => {
  return (
    <>
      <SEO 
        title="About Us | GrowthsStore" 
        description="Learn more about GrowthsStore, a trusted online store dedicated to serving customers across Uganda and East Africa with quality products." 
      />
      <div className="max-w-[1000px] mx-auto px-4 py-12 md:py-24 text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-8 tracking-tight">About Us</h1>
      
      <div className="prose prose-invert max-w-none text-gray-300">
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <strong className="text-white">GrowthsStore</strong>.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          GrowthsStore is a trusted online store dedicated to serving customers across <strong className="text-white">Uganda</strong> and, where possible, other <strong className="text-white">East African</strong> countries. We offer a wide range of quality products, including <strong className="text-white">electronics, art, fashion, and accessories</strong>, carefully selected to meet our customers' needs.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          We are committed to providing quality products, excellent customer service, and a smooth shopping experience. Orders are typically delivered within <strong className="text-white">10–15 days</strong>, depending on the product and destination. In the event of unexpected delays, we keep our customers informed throughout the process and stay in touch until every order is successfully completed.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          We invite you to visit our social media pages to learn more about us, explore our latest collections, and read reviews from our satisfied customers.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          Thank you for choosing GrowthsStore. We look forward to serving you and making your shopping experience enjoyable.
        </p>
        
        <div className="mt-12">
          <Link
            to="/shop"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 text-lg transition-all border border-orange-500 hover:border-orange-400 shadow-lg"
          >
            Explore Our Shop
          </Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default About;
