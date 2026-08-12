"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import courseApi from "../../../api/CourseApi";
import routes from "../../../routes";
import toast from "react-hot-toast";

export default function Courses() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!window.confirm("Are you sure you want to delete this course?")) return;
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

  const filteredCourses = data.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c._id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <SchoolIcon className="text-indigo-400" />
              All Managed Courses
            </h1>
            <p className="text-xs text-slate-400">
              Overview, edit details, or delete active course programs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/create-course"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <AddIcon className="w-4 h-4" />
              Create New Course
            </Link>
          </div>
        </div>

        {/* Filters & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search courses by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span>
              Total Courses: <strong className="text-white">{data.length}</strong>
            </span>
          </div>
        </div>

        {/* Courses Table Container */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium">Loading courses catalog...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Course Title</th>
                    <th className="py-4 px-6">Rating</th>
                    <th className="py-4 px-6">Enrolled</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((val: any) => (
                      <tr
                        key={val._id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* ID */}
                        <td className="py-4 px-6 font-mono text-slate-500 text-[11px] truncate max-w-[120px]">
                          {val._id}
                        </td>

                        {/* Title */}
                        <td className="py-4 px-6 font-bold text-slate-100 text-sm max-w-[240px] truncate">
                          {val.name}
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg font-bold">
                            <StarIcon className="w-3.5 h-3.5" />
                            {val.rating || 0}
                          </span>
                        </td>

                        {/* Purchased */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg font-semibold">
                            <ShoppingBagIcon className="w-3.5 h-3.5 text-indigo-400" />
                            {val.purchased || 0} Sales
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/edit-course/${val._id}`}
                              className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 transition-all hover:scale-105"
                              title="Edit Course"
                            >
                              <EditIcon className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDeleteCourse(val._id)}
                              disabled={deletingCourseId === val._id}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all hover:scale-105 cursor-pointer disabled:opacity-40"
                              title="Delete Course"
                            >
                              {deletingCourseId === val._id ? (
                                <span className="text-[10px] font-bold px-1">...</span>
                              ) : (
                                <DeleteIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-slate-500 text-xs"
                      >
                        No matching courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

