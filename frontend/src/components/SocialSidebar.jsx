import { Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const SocialSidebar = () => {
  const socials = [
    { icon: FaFacebookF, name: 'FACEBOOK', color: 'bg-[#3b5998]', link: 'https://www.facebook.com/profile.php?id=61574254704789' },
    { icon: FaInstagram, name: 'INSTAGRAM', color: 'bg-[#e4405f]', link: 'https://www.instagram.com/growthsstore' },
    { icon: FaTiktok, name: 'TIKTOK', color: 'bg-[#010101]', link: 'https://www.tiktok.com/@growthsstore?_r=1&_t=ZS-94vl9X96Py' },
    { icon: FaWhatsapp, name: 'WHATSAPP', color: 'bg-[#25D366]', link: 'https://wa.me/256771204748' },
    { icon: Phone, name: 'CALL US', color: 'bg-[#4CAF50]', link: 'tel:+250793392762' },
    { icon: Mail, name: 'EMAIL US', color: 'bg-[#EA4335]', link: 'mailto:jaygrowth01@gmail.com' },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end shadow-2xl">
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative w-[40px] h-[40px] hover:w-[140px] md:w-[50px] md:h-[50px] md:hover:w-[160px] transition-all duration-300 ease-in-out text-gray-900 dark:text-white overflow-hidden ${social.color} flex items-center shadow-lg group`}
        >
          <div className="absolute right-[40px] md:right-[50px] w-[100px] md:w-[110px] h-full flex items-center justify-center whitespace-nowrap font-bold text-xs md:text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {social.name}
          </div>
          <div className="absolute right-0 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center text-lg md:text-xl bg-white dark:bg-black/10">
            <social.icon />
          </div>
        </a>
      ))}
    </div>
  );
};

export default SocialSidebar;
