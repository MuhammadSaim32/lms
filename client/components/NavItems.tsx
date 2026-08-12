import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomModel from "./CustomModel";
import Login from "./Login";
import Singup from "./Singup";
import verification from "./verification";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const navElements = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "#courses",
  },
  {
    name: "FAQ",
    url: "#faq",
  },
];

const NavItems = ({ className }: { className: string }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("");
  const { data: userData } = useAuth();

  return (
    <div className={`${className}`}>
      {navElements.map((item, idx) => {
        const isActive = pathname === item.url;
        return (
          <Link
            className={`transition-colors duration-200 py-1 px-3 rounded-lg text-sm font-semibold ${
              isActive
                ? "text-indigo-400 bg-indigo-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
            href={`${item.url}`}
            key={idx}
          >
            {item.name}
          </Link>
        );
      })}

      {userData.isLoading ? (
        <CircularProgress size="20px" sx={{ color: "#6366f1" }} aria-label="Loading…" />
      ) : (
        <>
          {!userData.isAuth && (
            <button
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              onClick={() => {
                setRoute("login");
                setOpen(true);
              }}
            >
              Login
            </button>
          )}

          {userData.isAuth && (
            <Link href={"/profile"} className="relative group">
              <Avatar
                sx={{ width: 34, height: 34, border: "2px solid #6366f1" }}
                src={`${userData?.userData?.avatar?.url}`}
                className="transition-transform group-hover:scale-105 shadow-md shadow-indigo-500/20"
              />
            </Link>
          )}
        </>
      )}

      {route === "login" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          Component={Login}
          setRoute={setRoute}
        />
      )}

      {route === "singup" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          Component={Singup}
          setRoute={setRoute}
        />
      )}

      {route === "verification" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          Component={verification}
          setRoute={setRoute}
        />
      )}
    </div>
  );
};

export default NavItems;

