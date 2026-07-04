"use client";

import { useEffect, useState } from "react";
import authApi from "../../../../api/AuthApi";
import routes, { route } from "../../../../routes/index";
export default function Account() {
  const [data, setData] = useState("");
  console.log(data);
  useEffect(() => {
    authApi.profile(routes.me).then((data) => {
      setData(data);
    });
  }, []);
  return <div className="bg-white">My Accounts</div>;
}
