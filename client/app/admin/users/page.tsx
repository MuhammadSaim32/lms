"use client";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import authApi from "../../../api/AuthApi";
import routes from "../../../routes";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const Items = [
    "ID",
    "name",
    "email",
    "role",
    "purchasedCourses",
    "Delete",
  ];

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await authApi.getUsers(routes.getAllUsers);
      setData(response.users ?? []);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeletingUserId(id);
    try {
      const response = await authApi.deleteUser(routes.deleteUser(id));
      toast.success(response?.message || "User deleted successfully");
      await fetchAllUsers();
    } catch (error: any) {
      console.error("Failed to delete user", error);
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);



  return (
    <div className="w-full bg-gray-600 h-full flex justify-center items-center">
      <table className="h-[95%] w-[95%] bg-gray-700 flex flex-col">
        <thead className="flex border">
          <tr className="flex justify-between w-full p-3">
            {Items.map((val, i) => (
              <th
                className="w-1/6"
                key={i}>{val}</th>
            ))}
          </tr>
        </thead>
        <tbody className="flex-1">
          { loading ? <Loading size={40} /> :
            data &&
            data.map((val: any) => (
              <tr key={val._id} className="flex justify-evenly p-2">
                <td className="w-1/4 truncate px-4 py-2">{val._id}</td>
                <td className="w-1/6 truncate px-4 py-2 ">{val.name}</td>
                <td className="w-1/4 truncate px-4 py-2">{val.email}</td>
                <td className="w-1/6 truncate">{val.role}</td>
                <td className="w-1/6 truncate px-4 py-2">{val.course.length}</td>
                <td className="w-1/6 truncate px-4 py-2">
                  <button
                    className={`rounded-full p-1 cursor-pointer ${deletingUserId === val._id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 hover:text-white"}`}
                    onClick={() => handleDeleteUser(val._id)}
                    disabled={deletingUserId === val._id}
                    aria-label="Delete user"
                  >
                    {deletingUserId === val._id ? (
                      <span className="text-sm">Deleting...</span>
                    ) : (
                      <DeleteIcon fontSize="small" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
