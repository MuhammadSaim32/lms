"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../../../components/Input";
import Button from "../../../../../components/Button";
import toast from "react-hot-toast";
import authApi from "../../../../../api/AuthApi";
import routes from "../../../../../routes/index";
import LockResetIcon from "@mui/icons-material/LockReset";

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
    <div className="w-full max-w-lg space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <LockResetIcon className="text-indigo-400" />
          Change Password
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ensure your account is using a long, random password to stay secure
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <Input
            id="oldPassword"
            type="password"
            htmtFor="oldPassword"
            labelclassName="text-slate-300 font-semibold text-sm"
            labelText="Current Password"
            className="w-full mt-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            error={
              formik.touched.oldPassword && formik.errors.oldPassword
                ? formik.errors.oldPassword
                : null
            }
            {...formik.getFieldProps("oldPassword")}
          />
        </div>

        <div>
          <Input
            id="newPassword"
            type="password"
            htmtFor="newPassword"
            labelclassName="text-slate-300 font-semibold text-sm"
            labelText="New Password"
            className="w-full mt-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            error={
              formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword
                : null
            }
            {...formik.getFieldProps("newPassword")}
          />
        </div>

        <div>
          <Input
            id="confirmPassword"
            type="password"
            htmtFor="confirmPassword"
            labelText="Confirm New Password"
            labelclassName="text-slate-300 font-semibold text-sm"
            className="w-full mt-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : null
            }
            {...formik.getFieldProps("confirmPassword")}
          />
        </div>

        <div className="pt-4">
          <Button
            text={formik.isSubmitting ? "Updating..." : "Update Password"}
            type="submit"
            className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40"
            disabled={!formik.dirty || formik.isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

