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

        <form onSubmit={formik.handleSubmit} className="gap-3 flex justify-evenly flex-col items-center ">

            <h1 className="text-2xl font-bold mb-5">Join With Elearning</h1>


            <div className="flex justify-between flex-col">
                <Input
                    id="name"
                    type="text"
                    htmtFor={"name"}
                    placeholder="Enter your name"
                    labelText="Enter Your Name"
                    className={"w-full mt-2"}

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
                    labelText="Enter Your Email"
                    className={"w-full mt-2"}


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
                    labelText="Enter Your Password"
                    className="w-full mt-2"
                    error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                    {...formik.getFieldProps('password')}

                />


            </div>
            <Button
                text={formik.isSubmitting ? "Submitting..." : "Sign Up"}
                type="submit"
                className={`w-full mr-2a active:bg-blue-900  cursor-pointer hover:bg-blue-700 ${formik.isSubmitting ? "pointer-events-none" : ""}`}
                disabled={formik.isSubmitting}

            />
            <div className=" flex flex-col mt-2">
                <div className="font-bold">Or Join with</div>
                <div className="flex justify-center gap-1 mt-3">
                    <Link href={`${process.env.NEXT_PUBLIC_GITHUB_URI}`} >

                        <GitHubIcon />
                    </Link>
                    <button
                    type="button"
                        className="cursor-pointer"
                        onClick={handleGoolgeAuth}>
                        <GoogleIcon />
                    </button>
                </div>
            </div>

            <div>Already Have And  Account?
                <Button
                    text="Login"
                    type="submit"
                    className={"bg-slate-900 text-blue-500 cursor-pointer"}
                    onClick={() => setRoute("login")}
                />
            </div>
        </form>

    );

}

export default Singup