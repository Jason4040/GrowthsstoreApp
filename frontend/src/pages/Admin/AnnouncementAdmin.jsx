import { useState, useEffect } from "react";
import { 
  useGetAnnouncementsQuery, 
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation
} from "../../redux/api/announcementApiSlice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AnnouncementAdmin = () => {
  const { data: announcements, refetch } = useGetAnnouncementsQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || text === "<p><br></p>") {
      toast.error("Announcement text cannot be empty");
      return;
    }

    try {
      if (editingId) {
        await updateAnnouncement({ id: editingId, text, isActive }).unwrap();
        toast.success("Announcement updated successfully");
      } else {
        await createAnnouncement({ text, isActive }).unwrap();
        toast.success("Announcement created successfully");
      }
      setText("");
      setIsActive(true);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save announcement");
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setText(announcement.text);
    setIsActive(announcement.isActive);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id).unwrap();
        toast.success("Announcement deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete announcement");
      }
    }
  };

  const resetForm = () => {
    setText("");
    setIsActive(true);
    setEditingId(null);
  };

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="bg-gray-100 dark:bg-white dark:bg-[#151515] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl mb-8">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">
          {editingId ? "Edit Announcement" : "Create New Announcement"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-[#202020] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 text-black dark:text-white">
            <style>
              {`
                .ql-toolbar { background: white; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; }
                .ql-container { min-height: 150px; font-size: 1rem; }
                .dark .ql-editor.ql-blank::before { color: #a0aec0; }
                .quill-content-preview p { margin: 0; display: inline; }
              `}
            </style>
            <ReactQuill 
              theme="snow" 
              value={text} 
              onChange={setText} 
              modules={modules}
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
                Active (Will be displayed in the top carousel)
              </div>
            </label>
          </div>

          {/* Preview Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Live Preview</h3>
            <div className="bg-[#2B429F] text-[#D8E2DC] py-3 px-4 rounded-xl shadow-inner min-h-[50px] flex items-center justify-center">
              <div 
                className="quill-content-preview text-sm text-center" 
                dangerouslySetInnerHTML={{ __html: text || "Your announcement will appear here..." }}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex gap-4">
            <button
              type="submit"
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-orange-500/30 active:scale-95"
            >
              {editingId ? "Update Announcement" : "Save Announcement"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-lg font-bold transition-all shadow-lg active:scale-95"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-100 dark:bg-white dark:bg-[#151515] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Manage Announcements</h2>
        <div className="space-y-4">
          {Array.isArray(announcements) && announcements.map((ann) => (
            <div key={ann._id} className="bg-white dark:bg-gray-50 dark:bg-[#101010] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 overflow-hidden">
                <div 
                  className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 quill-content-preview"
                  dangerouslySetInnerHTML={{ __html: ann.text }}
                />
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${ann.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {ann.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(ann)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ann._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {Array.isArray(announcements) && announcements.length === 0 && (
            <p className="text-gray-500 text-center py-4">No announcements created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementAdmin;
