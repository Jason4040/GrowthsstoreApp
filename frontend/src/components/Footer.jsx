import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const socials = [
  { icon: FaFacebookF, name: "Facebook", color: "hover:bg-[#3b5998]", link: "https://www.facebook.com/profile.php?id=61574254704789" },
  { icon: FaInstagram, name: "Instagram", color: "hover:bg-[#e4405f]", link: "https://www.instagram.com/growthsstore" },
  { icon: FaTiktok, name: "TikTok", color: "hover:bg-[#010101]", link: "https://www.tiktok.com/@growthsstore?_r=1&_t=ZS-94vl9X96Py" },
  { icon: () => <img src="/icons/whatsapp.png" className="w-3.5 h-3.5 object-contain" alt="" />, name: "WhatsApp", color: "hover:bg-[#25D366]", link: "https://wa.me/256771204748" },
  { icon: () => <img src="/icons/rwanda tele code.png" className="w-3.5 h-3.5 object-contain" alt="" />, name: "Call us", color: "hover:bg-[#4CAF50]", link: "tel:+250793392762" },
  { icon: Mail, name: "Email us", color: "hover:bg-[#EA4335]", link: "mailto:jaygrowth01@gmail.com" },
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 py-6 mt-12 w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Side: Brand & Copyright */}
        <div className="flex items-center gap-3">
          <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">Growthsstore</span>
          <span className="text-gray-500 text-sm">© {new Date().getFullYear()}</span>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">About</Link>
          <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">FAQ</Link>
          <Link to="/favorite" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">Saved</Link>
          <Link to="/shop" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">Shop</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white ${social.color} transition-colors text-xs`}
            >
              <social.icon />
            </a>
          ))}
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
