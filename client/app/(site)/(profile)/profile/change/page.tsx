"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../../../components/Input";
import Button from "../../../../../components/Button";
import toast from "react-hot-toast";
import authApi from "../../../../../api/AuthApi";
import routes from "../../../../../routes/index";

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

      try {
        const res = await authApi.updatePassword(routes.updatePassword, data);
        toast.success(res?.message || "Password updated successfully");
        resetForm();
      } catch (error: any) {
        toast.error(error?.message || "Unable to update password");
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="gap-3 flex justify-evenly flex-col items-center"
    >



      <div className="flex justify-between flex-col">
        <Input
          id="oldPassword"
          type="password"
          htmtFor="oldPassword"
          labelclassName="text-white"
          labelText="Current Password"
          className="w-full mt-2 text-white"
          error={formik.touched.oldPassword && formik.errors.oldPassword ? formik.errors.oldPassword : null}
          {...formik.getFieldProps("oldPassword")}
        />
      </div>


      <div className="flex justify-between flex-col">
        <Input
          id="newPassword"
          type="password"
          htmtFor="newPassword"
          labelclassName="text-white"
          labelText="Confirm Password "
          className="w-full mt-2 text-white"
          error={formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : null}
          {...formik.getFieldProps("newPassword")}
        />
      </div>
      <div className="flex justify-between flex-col">
        <Input
          id="confirmPassword"
          type="password"
          htmtFor="confirmPassword"
          labelText="Confirm Password"
          className="w-full mt-2 text-white"
          labelclassName="text-white"

          error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : null}
          {...formik.getFieldProps("confirmPassword")}
        />
      </div>

      <Button
        text={formik.isSubmitting ? "Updating..." : "Update Password"}
        type="submit"
        className={`w-full cursor-pointer ${  formik.dirty ?'hover:bg-blue-700 active:bg-blue-900':""} ${formik.isSubmitting ? "pointer-events-none" : ""}`}
        disabled={!formik.dirty || formik.isSubmitting}
      />
    </form>
  );
}
