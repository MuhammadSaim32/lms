"use client"

import * as yup from "yup"
import { useFormik } from 'formik';
import authApi from "../api/AuthApi"
import route from "../routes"
import Input from "./Input";
import Button from "./Button"
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import toast from "react-hot-toast";
import Link from "next/link";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const signupSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),
    email: yup
        .string()
        .trim()
        .required("Email is required")
        .min(5, 'Email is too short')
        .max(254, 'Email cannot exceed 254 characters')
        .matches(emailRegex, 'Invalid email format'),
    password: yup
        .string()
        .required("Password is required")
        .min(6)
        .max(32)
        .matches(/^\S*$/, 'Spaces are not allowed in password'),
})

const Singup = ({ setRoute }: { setRoute: (val: string) => void }) => {


    const handleGoolgeAuth = () => {
        const params = {
            client_id: process.env.NEXT_PUBLIC_GOOGE_CLIENT_ID,
            response_type: "code",
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            access_type: "online"
        }

        const urlParams= new URLSearchParams(params).toString()
    
        window.location.href=`${process.env.NEXT_PUBLIC_GOOGLE_URI}?${urlParams}`
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: signupSchema,
        onSubmit: async values => {
            try {
                const res = await authApi.register(values.name, values.email, values.password, route.register)
                toast.success(res.message)
                localStorage.setItem("activation_token", res.data.token)
                setRoute("verification")
            } catch (error) {
                toast.error(error.message)
            }
        },
    });
    return (

        <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-white text-center bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">Join Elearning</h1>
                <p className="text-sm text-slate-400 text-center mt-2">Create an account to start learning</p>
            </div>


            <div className="flex justify-between flex-col">
                <Input
                    id="name"
                    type="text"
                    htmtFor={"name"}
                    placeholder="Enter your name"
                    labelText="Full Name"
                    className=""

                    {...formik.getFieldProps('name')}

                    error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                />


            </div>
            <div className="flex justify-between flex-col">
                <Input
                    id="email"
                    type="email"
                    htmtFor={"email"}
                    placeholder="Enter your email address"
                    labelText="Email Address"
                    className=""


                    {...formik.getFieldProps('email')}
                    error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                />


            </div>

            <div className="flex justify-between flex-col">
                <Input
                    id="password"
                    type="password"
                    htmtFor="password"
                    placeholder="Enter your password"
                    labelText="Password"
                    className=""
                    error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                    {...formik.getFieldProps('password')}

                />


            </div>
            <Button
                text={formik.isSubmitting ? "Signing Up..." : "Sign Up"}
                type="submit"
                className={`w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40 ${formik.isSubmitting ? "pointer-events-none opacity-70" : ""}`}
                disabled={formik.isSubmitting}
            />
            <div className="flex flex-col items-center mt-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 relative w-full text-center">
                    <span className="bg-[#0f172a] px-3 relative z-10">Or Join With</span>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 -z-0"></div>
                </div>
                <div className="flex justify-center gap-4 w-full">
                    <Link href={`${process.env.NEXT_PUBLIC_GITHUB_URI}`} className="flex-1 flex justify-center py-2.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all cursor-pointer text-slate-300 hover:text-white">
                        <GitHubIcon />
                    </Link>
                    <button
                        type="button"
                        className="flex-1 flex justify-center py-2.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all cursor-pointer text-slate-300 hover:text-white"
                        onClick={handleGoolgeAuth}
                    >
                        <GoogleIcon />
                    </button>
                </div>
            </div>

            <div className="text-center text-sm text-slate-400 mt-6 pt-4 border-t border-slate-800">
                Already have an account?{" "}
                <button
                    type="button"
                    className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all cursor-pointer"
                    onClick={() => setRoute("login")}
                >
                    Login
                </button>
            </div>
        </form>

    );

}

export default Singup