import { useGetAnnouncementQuery } from "../redux/api/announcementApiSlice";

const TopAnnouncement = () => {
  const { data: announcement, isLoading, isError } = useGetAnnouncementQuery();

  if (isLoading || isError || !announcement?.isActive || !announcement?.text) {
    return null;
  }

  return (
    <div className="bg-[#2B429F] text-[#D8E2DC] py-2 w-full overflow-hidden flex items-center z-[100] relative">
      <div className="whitespace-nowrap animate-marquee flex items-center justify-center min-w-full font-mono text-sm tracking-wider">
        <span className="mx-4">{announcement.text}</span>
      </div>
    </div>
  );
};

export default TopAnnouncement;
