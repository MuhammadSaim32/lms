"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Input } from "@mui/material";
import authApi from "../../../../api/AuthApi";
import routes from "../../../../routes/index";

const PasswordSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ChangePassword() {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      await authApi.updatePassword(routes.updatePassword, data);
      resetForm();
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="h-[60%] w-[75%] flex  flex-col items-center justify-around bg-white"
    >
      <div>
        {" "}
        <label htmlFor="oldPassword">Current Password</label>
        <br />
        <Input
          id="oldPassword"
          type="password"
          {...formik.getFieldProps("oldPassword")}
        />
        {formik.touched.oldPassword && formik.errors.oldPassword ? (
          <div>{formik.errors.oldPassword}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="newPassword">New Password</label>
        <br />
        <Input
          id="newPassword"
          type="password"
          {...formik.getFieldProps("newPassword")}
        />
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <div>{formik.errors.newPassword}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <br />
        <Input
          id="confirmPassword"
          type="password"
          {...formik.getFieldProps("confirmPassword")}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
      </div>

      <button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
        {formik.isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
