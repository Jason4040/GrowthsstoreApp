import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12 md:py-24 text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-8 tracking-tight">About Us</h1>
      
      <div className="prose prose-invert max-w-none text-gray-300">
        <p className="text-lg leading-relaxed mb-6">
          Welcome to Growthsstore, your number one source for all things premium. We're dedicated to providing you the best of products, with a focus on dependability, customer service, and uniqueness.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        
        <div className="mt-12">
          <Link
            to="/shop"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 text-lg transition-all border border-orange-500 hover:border-orange-400"
          >
            Explore Our Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
