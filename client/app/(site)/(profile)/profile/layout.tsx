"use client";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../../../../components/Loading";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import authApi from "../../../../api/AuthApi";
import routes from "../../../../routes";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

const sideBar = [{ name: "Change Password", url: "change", provider: "local" }];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: userData, setData } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await authApi.logout(routes.logout);
      toast.success(res.message || "Logged out successfully");
      setData({ isAuth: false, userData: null, isLoading: false });
      router.replace("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const pathname = usePathname().split("/");
  const currentTab = pathname[pathname?.length - 1];

  useEffect(() => {
    if (!userData?.isLoading && !userData?.isAuth) {
      router.replace("/");
    }
  }, [userData, router]);

  if (userData?.isLoading || !userData?.isAuth) {
    return <Loading size="5rem" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-6xl w-full bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Sidebar */}
        <aside className="md:col-span-4 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <Avatar
                src={userData?.userData?.avatar?.url}
                sx={{ width: 44, height: 44, bgcolor: "#6366f1", fontWeight: "bold" }}
              >
                {userData?.userData?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-white truncate">
                  {userData?.userData?.name || "Student"}
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  {userData?.userData?.email}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              <Link
                href="/profile"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentTab === "profile"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <PersonIcon className="w-5 h-5" />
                My Account
              </Link>

              {sideBar.map((item) => {
                return (
                  userData?.userData?.provider === "local" && (
                    <Link
                      href={`/profile/${item.url}`}
                      key={item.name}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        currentTab === item.url
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <LockIcon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                );
              })}

              {userData?.userData?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all mt-4"
                >
                  <DashboardIcon className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-sm rounded-xl transition-all cursor-pointer"
          >
            <LogoutIcon className="w-4 h-4" />
            Sign Out
          </button>
        </aside>

        {/* Form Body Area */}
        <main className="md:col-span-8 p-6 sm:p-10 flex items-center justify-center bg-slate-950/40">
          {children}
        </main>
      </div>
    </div>
  );
}

