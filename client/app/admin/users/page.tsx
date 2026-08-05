"use client";
import { useEffect, useState } from "react";
import authApi from "../../../api/AuthApi";
import routes from "../../../routes";
import Loading from "../../../components/Loading";

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      await authApi.deleteUser(routes.deleteUser(id));
    } catch (error) {
      console.error("Failed to delete user", error);
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
                    className="cursor-pointer"
                    onClick={() => {
                      handleDeleteUser(val._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
