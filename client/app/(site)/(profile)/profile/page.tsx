"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../../components/Input";
import authApi from "../../../../api/AuthApi";
import routes from "../../../../routes/index";
import { useAuth } from "../../../../context/AuthContext";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";

const AccountsSchema = yup.object({
  fullName: yup.string().required("Name is required"),
  emailAddress: yup.string().required("email address is required"),
});

export default function Account() {
  const { data: userdata } = useAuth()
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
      const isEmailDirty = emailAddress.value != emailAddress.initialValue;
      const isfullNameDirty = fullName.value != fullName.initialValue;
      const data = {
        name: isfullNameDirty ? fullName.value : "",
        email: isEmailDirty ? emailAddress.value : "",
      };

      let res
      try {

        res = await authApi.updateProfile(routes.updateProfile, data);
        toast.success(res.message)
      } catch (error) {
        toast.error(error.message)

      }

    },
  });


  return (
    <form
      onSubmit={formik.handleSubmit}
      className="h-[60%] w-[75%] flex flex-col items-center justify-around"
    >
      <div className="w-full">
        <Input
          id="fullName"
          type="text"
          htmtFor="fullName"
          labelText="Full Name"
          labelclassName="text-white"
          className="w-full mt-2 border-2 border-white text-white font-bold"
          error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : null}
          {...formik.getFieldProps("fullName")}
        />
      </div>

      <div className="w-full">
        <Input
          id="emailAddress"
          type="email"
          htmtFor="emailAddress"
          labelText="Email Address"
          className="w-full mt-2 border-2 border-white text-white font-bold"
          labelclassName="text-white"
          error={formik.touched.emailAddress && formik.errors.emailAddress ? formik.errors.emailAddress : null}
          {...formik.getFieldProps("emailAddress")}
        />
      </div>

      <Button
        text={`${formik.isSubmitting ? "updating..." : "Update"}`}
        type="submit"
        disabled={!formik.dirty || formik.isSubmitting}
        className="bg-blue-600  text-white py-2 px-4 rounded-md disabled:opacity-50"
      />

    </form>
  );
}
