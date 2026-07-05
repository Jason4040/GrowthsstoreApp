import { useState, useEffect } from "react";
import { useGetAnnouncementQuery, useUpdateAnnouncementMutation } from "../../redux/api/announcementApiSlice";
import { toast } from "react-toastify";

const AnnouncementAdmin = () => {
  const { data: announcement, isLoading } = useGetAnnouncementQuery();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (announcement) {
      setText(announcement.text);
      setIsActive(announcement.isActive);
    }
  }, [announcement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAnnouncement({ text, isActive }).unwrap();
      toast.success("Announcement updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update announcement");
    }
  };

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-gray-100 dark:bg-[#151515] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Top Header Announcement</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Announcement Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter the scrolling announcement text..."
              required
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isActive} 
                  onChange={(e) => setIsActive(e.target.checked)} 
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                Show Announcement Banner
              </div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="submit"
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-orange-500/30 active:scale-95"
            >
              Save Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementAdmin;
