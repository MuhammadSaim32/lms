"use client";

import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import authApi from "../../../api/AuthApi";
import routes from "../../../routes";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Users() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await authApi.getUsers(routes.getAllUsers);
      setData(response.users ?? []);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

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

  const filteredUsers = data.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term) ||
      user._id?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 text-slate-100 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <GroupIcon className="text-indigo-400" style={{ fontSize: 30 }} />
              Users Management
            </h1>
            <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-900/80">
              Total: {data.length}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage student and administrator accounts, inspect enrolled courses, and manage platform permissions.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            style={{ fontSize: 18 }}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
          />
        </div>
      </div>

      {/* Main Users Table Container */}
      <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base text-white font-semibold">
            All Registered Accounts
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Click on actions to perform operations on selected user profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loading size={45} />
              <span className="text-xs font-medium">Fetching registered users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              No users found matching your search.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4 font-semibold">User Profile</th>
                    <th className="py-3.5 px-4 font-semibold">User ID</th>
                    <th className="py-3.5 px-4 font-semibold">Email Address</th>
                    <th className="py-3.5 px-4 font-semibold">Role</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Purchased Courses</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((val: any) => {
                    const isAdmin = val.role?.toLowerCase() === "admin";
                    const courseCount = Array.isArray(val.course) ? val.course.length : 0;

                    return (
                      <tr
                        key={val._id}
                        className="hover:bg-slate-800/50 transition-colors group text-slate-200"
                      >
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                              {val.name ? val.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <span className="font-semibold text-slate-100 truncate max-w-[150px] sm:max-w-[200px]">
                              {val.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          <span className="truncate block max-w-[120px]" title={val._id}>
                            {val._id}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <span className="truncate block max-w-[180px]" title={val.email}>
                            {val.email}
                          </span>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          {isAdmin ? (
                            <Badge variant="default" className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 gap-1 px-2 py-0.5 text-[11px]">
                              <AdminPanelSettingsIcon style={{ fontSize: 13 }} />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 gap-1 px-2 py-0.5 text-[11px]">
                              <PersonIcon style={{ fontSize: 13 }} />
                              User
                            </Badge>
                          )}
                        </td>

                        {/* Purchased Courses Count */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700/80">
                            {courseCount}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(val._id)}
                            disabled={deletingUserId === val._id}
                            className={`p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50 ${
                              deletingUserId === val._id ? "cursor-wait" : ""
                            }`}
                            title="Delete User"
                            aria-label="Delete user"
                          >
                            {deletingUserId === val._id ? (
                              <span className="text-[10px] text-rose-400 font-semibold animate-pulse">
                                Deleting...
                              </span>
                            ) : (
                              <DeleteIcon style={{ fontSize: 18 }} />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
