"use client";
import { useEffect, useState } from "react";
import authApi from "../../../api/AuthApi";
import routes from "../../../routes";
export default function Users() {
  const [data, setData] = useState([]);
  const Items = [
    "ID",
    "name",
    "email",
    "role",
    "purchased",
    "courses",
    "Delete",
  ];

  const fetchAllUsers = async () => {
    try {
      const response = await authApi.getUsers(routes.getAllUsers);
      setData(response.users ?? []);
    } catch (error) {
      console.error("Failed to load  users", error);
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
    <div className="w-full  bg-gray-600 h-screen flex justify-center items-center">
      <table className="h-[95%] w-[95%] bg-gray-700 flex flex-col">
        <thead className="flex border">
          <tr className="flex justify-between w-full p-3">
            {Items.map((val, i) => (
              <th key={i}>{val}</th>
            ))}
          </tr>
        </thead>
        <tbody className="flex-1 ">
          {data &&
            data.map((val: any) => (
              <tr key={val._id} className="flex justify-between ">
                <td>{val._id}</td>
                <td>{val.name}</td>
                <td>{val.email}</td>
                <td>{val.role}</td>
                <td>{val.course.length}</td>
                <td>
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
