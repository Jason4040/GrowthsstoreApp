import { useGetAnnouncementsQuery } from "../redux/api/announcementApiSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const TopAnnouncement = () => {
  const { data: announcements, isLoading, isError } = useGetAnnouncementsQuery();

  if (isLoading || isError || !Array.isArray(announcements) || announcements.length === 0) {
    return null;
  }

  const activeAnnouncements = announcements.filter(ann => ann.isActive);

  if (activeAnnouncements.length === 0) {
    return null;
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  return (
    <div className="bg-[#2B429F] text-[#D8E2DC] w-full overflow-hidden z-[100] relative min-h-[40px] flex items-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        {activeAnnouncements.length === 1 ? (
          <div className="py-2 flex items-center justify-center">
            <div 
              className="quill-content-preview text-sm text-center"
              dangerouslySetInnerHTML={{ __html: activeAnnouncements[0].text }} 
            />
          </div>
        ) : (
          <Slider {...sliderSettings} className="py-2">
            {activeAnnouncements.map((ann) => (
              <div key={ann._id} className="flex items-center justify-center focus:outline-none">
                <div 
                  className="quill-content-preview text-sm text-center"
                  dangerouslySetInnerHTML={{ __html: ann.text }} 
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
      <style>{`
        .quill-content-preview p { margin: 0; display: inline; }
      `}</style>
    </div>
  );
};

export default TopAnnouncement;
