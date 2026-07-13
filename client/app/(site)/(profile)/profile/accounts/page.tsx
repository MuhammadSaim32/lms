"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Input } from "@mui/material";
import { useEffect, useState } from "react";
import authApi from "../../../../../api/AuthApi";
import routes from "../../../../../routes/index";
import Avatar from "@mui/material/Avatar";

const AccountsSchema = yup.object({
  fullName: yup.string().required("Name is required"),
  emailAddress: yup.string().required("email address is required"),
});

export default function Account() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    authApi.profile(routes.me).then((data) => {
      setData(data.data.user);
      setLoading(false);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: data.name || " ",
      emailAddress: data.email || "",
    },
    enableReinitialize: true,
    validationSchema: AccountsSchema,
    onSubmit: async (values) => {
      const fullName = formik.getFieldMeta("fullName");
      const emailAddress = formik.getFieldMeta("emailAddress");
      const isEmailDirty = emailAddress.value != emailAddress.initialValue;
      const isfullNameDirty = fullName.value != fullName.initialValue;
      const data = {
        name: isfullNameDirty ? fullName.value : "",
        email: isEmailDirty ? emailAddress.value : "",
      };

      const res = await authApi.updateProfile(routes.updateProfile, data);
      setData(res.data.data.user);
    },
  });

  if (loading) return <div className="text-white  w-full"> Loading...</div>;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="h-[60%] w-[75%] flex  flex-col items-center justify-around bg-white"
    >
      <Avatar
        alt="Remy Sharp"
        src={data.avatar.url}
        sx={{ width: 56, height: 56 }}
      ></Avatar>
      <div>
        {" "}
        <label htmlFor="fullName">fullName</label>
        <br />
        <Input
          id="fullName"
          type="text"
          {...formik.getFieldProps("fullName")}
        />
        {formik.touched.fullName && formik.errors.fullName ? (
          <div>{formik.errors.fullName}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          {...formik.getFieldProps("emailAddress")}
        />
        {formik.touched.emailAddress && formik.errors.emailAddress ? (
          <div>{formik.errors.emailAddress}</div>
        ) : null}
      </div>

      <button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
        {formik.isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
