import toast from "react-hot-toast";
import * as yup from "yup"
import { useFormik } from 'formik';
import Input from "./Input";
import authApi from "../api/AuthApi"
import route from "../routes"
import Button from "./Button";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const loginSchema = yup.object({
    email: yup.string().required("Email is required")
        .min(5, 'Email is too short')
        .max(254, 'Email cannot exceed 254 characters')
        .matches(emailRegex, 'Invalid email format'),
    password: yup.string().required("password is required")
        .min(6)
        .max(32)
        .matches(/^\S*$/, 'Spaces are not allowed in password')
})

const Login = ({ setRoute, setOpen }) => {
    const { setData } = useAuth()

    const handleGoogleAuth = () => {
        const params = {
            client_id: process.env.NEXT_PUBLIC_GOOGE_CLIENT_ID,
            response_type: "code",
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            access_type: "online"
        }

        const urlParams = new URLSearchParams(params).toString()
        window.location.href = `${process.env.NEXT_PUBLIC_GOOGLE_URI}?${urlParams}`
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {

            let res
            try {
                res = await authApi.login(values.email, values.password, route.login)
                toast.success(res.message)
                setData({ isAuth: true, userData: res.data.user, isLoading: false })
                setOpen(false)
            } catch (error: any) {
                toast.error(error.message)
            }

        },
    });
    return (

        <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-white text-center bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">Welcome Back</h1>
                <p className="text-sm text-slate-400 text-center mt-2">Login to your Elearning account</p>
            </div>

            <div className="flex justify-between flex-col">
                <Input
                    id="email"
                    type="email"
                    htmtFor={"email"}
                    placeholder="Enter your email address"
                    labelText="Email Address"
                    className=""

                    error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                    {...formik.getFieldProps('email')}
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
                text={formik.isSubmitting ? "Logging in..." : "Login"}
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
                        onClick={handleGoogleAuth}
                    >
                        <GoogleIcon />
                    </button>
                </div>
            </div>

            <div className="text-center text-sm text-slate-400 mt-6 pt-4 border-t border-slate-800">
                Don't have an account?{" "}
                <button
                    type="button"
                    className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all cursor-pointer"
                    onClick={() => setRoute("singup")}
                >
                    Sign Up
                </button>
            </div>
        </form>

    );

}

export default Login