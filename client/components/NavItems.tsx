import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomModel from "./CustomModel";
import Login from "./Login";
import Singup from "./Singup";
import verification from "./verification";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";

const navElements = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "courses",
  },
  {
    name: "About",
    url: "about",
  },
  {
    name: "Policy",
    url: "policy",
  },
  {
    name: "FAQ",
    url: "faq",
  },
];

const NavItems = ({ className }: { className: string }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("");
  console.log(route);
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

      <button
        className="text-white"
        onClick={() => {
          setRoute("login");
          setOpen(true);
        }}
      >
        Login
      </button>
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

      <Link href={"/profile"}>
        <Avatar sx={{ width: 24, height: 24 }}>H</Avatar>
      </Link>
    </div>
  );
};

export default NavItems;
