"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';
import courseApi from "../../../api/CourseApi";
import routes from "../../../routes";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";

export default function Courses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const Items = ["ID", "CourseTitle", "Rating", "Purchased", "Edit", "Delete"];

  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getCourses(routes.getAllCoursesForAdmin);
      setData(response.data?.courses ?? []);
    } catch (error) {
      console.error("Failed to load admin courses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    setDeletingCourseId(id);
    try {
      const response = await courseApi.deleteCourse(routes.deleteCourse(id));
      toast.success(response?.message || "Course deleted successfully");
      await fetchAllCourses();
    } catch (error: any) {
      console.error("Failed to delete course", error);
      toast.error(error?.message || "Failed to delete course");
    } finally {
      setDeletingCourseId(null);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    <div className="w-full bg-gray-600 h-full flex justify-center items-center">
      <table className="h-[95%] w-[95%] bg-gray-700 flex flex-col">
        <thead className="flex border">
          <tr className="flex justify-between w-full p-3">
            {Items.map((val, i) => (
              <th className="w-1/6" key={i}>
                {val}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="flex-1">
          {loading ? (
            <Loading size={40} />
          ) : (
            data &&
            data.map((val: any) => (
              <tr key={val._id} className="flex justify-between w-full p-2">
                <td className="w-1/6 truncate px-4 py-2">{val._id}</td>
                <td className="w-1/6 truncate px-4 py-2">{val.name}</td>
                <td className="w-1/6 truncate px-4 py-2">{val.rating}</td>
                <td className="w-1/6 truncate px-4 py-2">{val.purchased}</td>
                <td className="w-1/6 truncate px-4 py-2">
                  <Link href={`/admin/edit-course/${val._id}`} className="cursor-pointer text-blue-500 hover:underline">
                    Edit
                  </Link>
                </td>
                <td className="w-1/6 truncate px-4 py-2">
                  <button
                    className={`rounded-full p-1 cursor-pointer ${deletingCourseId === val._id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 hover:text-white"}`}
                    onClick={() => handleDeleteCourse(val._id)}
                    disabled={deletingCourseId === val._id}
                    aria-label="Delete course"
                  >
                    {deletingCourseId === val._id ? (
                      <span className="text-sm">Deleting...</span>
                    ) : (
                      <DeleteIcon fontSize="small" />
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
