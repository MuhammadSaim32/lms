"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import courseApi from "../../../api/CourseApi";
import routes from "../../../routes";
export default function Courses() {
  const [data, setData] = useState([]);
  const Items = ["ID", "CourseTitle", "Rating", "Purchased", "Edit", "Delete"];

  const fetchAllCourses = async () => {
    try {
      const response = await courseApi.getCourses(routes.getAllCoursesForAdmin);
      setData(response.data?.courses ?? []);
    } catch (error) {
      console.error("Failed to load admin courses", error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await courseApi.deleteCourse(routes.deleteCourse(id));
    } catch (error) {
      console.error("Failed to delete course", error);
    }
  };

  useEffect(() => {
    fetchAllCourses();
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
                <td>{val.rating}</td>
                <td>{val.purchased}</td>
                <td>
                  <Link href={`/admin/edit-course/${val._id}`} className="cursor-pointer text-blue-500 hover:underline">
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleDeleteCourse(val._id)}
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
