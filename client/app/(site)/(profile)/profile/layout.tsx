"use client"
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../../../../components/Loading"
import { usePathname } from "next/navigation";
import Button from "../../../../components/Button"
import toast from "react-hot-toast";
import authApi from "../../../../api/AuthApi";
import routes from "../../../../routes";
const sideBar = [
  { name: "Change Password", url: "change" },
  { name: "Enrolled Courses", url: "enrolled" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: userData, setData } = useAuth()

  const handleLogout = async () => {
    try {
      const res = await authApi.logout(routes.logout);
      toast.success(res.message);
      setData({ isAuth: false, userData: null, isLoading: false });
      router.replace("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const pathname = usePathname().split('/');
  useEffect(() => {
    if (!userData?.isLoading && !userData?.isAuth) {
      router.replace('/');
    }
  }, [userData, router]);

  if (userData?.isLoading) return <Loading size="5rem" />
  if (!userData?.isAuth) return <Loading size="5rem" />

  return (
    <div className="min-h-screen h-screen bg-slate-800  flex  items-center justify-between p-3.5 ">
      {/* wrapper of children and side bar */}
      <div className=" flex  justify-between   bg-slate-950 h-[90%] w-screen ">
        {/* side bar */}
        <div className="bg-gray-600 flex flex-col gap-6 p-3 h-full w-[20%] justify-center">

          <Link
            href={`/profile`}
            className={`text-center text-white h-8 ${pathname[pathname?.length - 1] == "profile" ? "bg-gray-500" : ""}`}
          >
            My Account
          </Link>
          {sideBar.map((item) => {
            return (
              <Link
                href={`/profile/${item.url}`}
                key={item.name}
                className={`text-center text-white h-8 ${pathname[pathname?.length - 1] == item.url ? "bg-gray-500" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}

          <Link
            className=" rounded-md"
            href={`/admin`}
          >
            <div className="text-center bg-blue-700 h-10 p-2 hover:bg-blue-950   rounded-md text-white">
              Admin Dashboard
            </div>
          </Link>
          <Button
            text="Logout"
            type="button"
            className={"bg-red-500 text-white cursor-pointer font-bold hover:bg-red-600"}
            onClick={handleLogout}
          />
        </div>
        {/* children */}
        <div className="flex justify-center items-center flex-1">
          {children}
        </div>
      </div>
    </div >
  );
}
