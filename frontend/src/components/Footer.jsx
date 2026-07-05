import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 py-6 mt-12 w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Brand & Copyright */}
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg tracking-tight">Growthsstore</span>
          <span className="text-gray-500 text-sm">© {new Date().getFullYear()}</span>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/about" className="text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">About</Link>
          <Link to="/faq" className="text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">FAQ</Link>
          <Link to="/favorite" className="text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">Saved</Link>
          <Link to="/shop" className="text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">Shop</Link>
        </div>

        {/* Right Side: Designed By */}
        <div className="flex items-center">
          <a
            href="https://www.irabaruta.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-orange-500 text-[10px] tracking-widest transition-colors font-medium"
          >
            Designed by willynorbert
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
