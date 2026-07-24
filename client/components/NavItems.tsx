import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomModel from "./CustomModel";
import Login from "./Login";
import Singup from "./Singup";
import verification from "./verification";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { CircularProgress } from "@mui/material"
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
  const { data: userData } = useAuth()
  console.log("hey", userData?.userData?.avatar?.url)
  return (
    <div className={`${className}`}>
      {navElements.map((item, idx) => {
        return (
          <Link
            className={`${pathname == item.url ? "text-blue-600" : "text-white"} `}
            href={`${item.url}`}
            key={idx}
          >
            {" "}
            {item.name}
          </Link>
        );
      })}



      {userData.isLoading ?
        <CircularProgress size="20px" aria-label="Loading…" /> : (
          <>
            {!userData.isAuth && (
              <button
                className="text-white cursor-pointer"
                onClick={() => {
                  setRoute("login");
                  setOpen(true);
                }}
              >
                Login
              </button>
            )}
          </>
        )
      }
      {route == "login" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          Component={Login}
          setRoute={setRoute}
        />
      )}


      {route == "singup" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          Component={Singup}
          setRoute={setRoute}
        />
      )}

      {route == "verification" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          Component={verification}
          setRoute={setRoute}
        />
      )}

      {userData.isLoading ?
        <CircularProgress size="20px" aria-label="Loading…" /> : (
          <>
            {userData.isAuth && (
              <Link href={"/profile"}>
                <Avatar sx={{ width: 24, height: 24 }}
                  src={`${userData?.userData?.avatar?.url}`}
                />
              </Link>
            )}
          </>
        )
      }

    </div>
  );
};

export default NavItems;
