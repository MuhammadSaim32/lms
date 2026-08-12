"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../../components/Input";
import authApi from "../../../../api/AuthApi";
import routes from "../../../../routes/index";
import { useAuth } from "../../../../context/AuthContext";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";
import SaveIcon from "@mui/icons-material/Save";
import BadgeIcon from "@mui/icons-material/Badge";

const AccountsSchema = yup.object({
  fullName: yup.string().required("Name is required"),
  emailAddress: yup.string().required("Email address is required"),
});

export default function Account() {
  const { data: userdata } = useAuth();
  const formik = useFormik({
    initialValues: {
      fullName: userdata?.userData?.name || "",
      emailAddress: userdata?.userData?.email || "",
    },
    enableReinitialize: true,
    validationSchema: AccountsSchema,
    onSubmit: async () => {
      const fullName = formik.getFieldMeta("fullName");
      const emailAddress = formik.getFieldMeta("emailAddress");
      const isEmailDirty = emailAddress.value !== emailAddress.initialValue;
      const isfullNameDirty = fullName.value !== fullName.initialValue;
      const data = {
        name: isfullNameDirty ? fullName.value : "",
        email: isEmailDirty ? emailAddress.value : "",
      };

      try {
        const res = await authApi.updateProfile(routes.updateProfile, data);
        toast.success(res.message || "Profile updated successfully!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to update profile");
      }
    },
  });

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <BadgeIcon className="text-indigo-400" />
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details and account info
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Input
            id="fullName"
            type="text"
            htmtFor="fullName"
            labelText="Full Name"
            labelclassName="text-slate-300 font-semibold text-sm"
            className="w-full mt-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            error={
              formik.touched.fullName && formik.errors.fullName
                ? formik.errors.fullName
                : null
            }
            {...formik.getFieldProps("fullName")}
          />
        </div>

        <div className="space-y-1">
          <Input
            id="emailAddress"
            type="email"
            htmtFor="emailAddress"
            labelText="Email Address"
            labelclassName="text-slate-300 font-semibold text-sm"
            className="w-full mt-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            error={
              formik.touched.emailAddress && formik.errors.emailAddress
                ? formik.errors.emailAddress
                : null
            }
            {...formik.getFieldProps("emailAddress")}
          />
        </div>

        {userdata?.userData?.provider === "local" && (
          <div className="pt-3">
            <Button
              text={formik.isSubmitting ? "Updating..." : "Save Changes"}
              type="submit"
              disabled={!formik.dirty || formik.isSubmitting}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40"
            />
          </div>
        )}
      </form>
    </div>
  );
}

