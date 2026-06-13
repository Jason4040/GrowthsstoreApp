import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
// ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
// import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* <AdminMenu /> */}
          <div className="w-full overflow-x-auto bg-gray-100 dark:bg-[#151515] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">NAME</th>
                  <th className="px-6 py-4 font-semibold">EMAIL</th>
                  <th className="px-6 py-4 font-semibold text-center">ADMIN</th>
                  <th className="px-6 py-4 font-semibold text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white dark:bg-[#1A1A1A]/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{user._id}</td>
                    <td className="px-6 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#101010] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-lg transition-colors"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="text-gray-500 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#101010] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-lg transition-colors"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <a href={`mailto:${user.email}`} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white transition-colors">{user.email}</a>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="text-gray-500 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500">
                          <FaCheck />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500">
                          <FaTimes />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!user.isAdmin && (
                        <button
                          onClick={() => {
                            setUserToDelete(user._id);
                            setIsConfirmOpen(true);
                          }}
                          className="bg-red-900/30 hover:bg-red-800/50 text-red-500 p-2.5 rounded-lg transition-colors border border-red-900/50 hover:border-red-700 inline-flex items-center justify-center"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserList;
