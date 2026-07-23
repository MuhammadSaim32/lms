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

        <form onSubmit={formik.handleSubmit} className="gap-3 flex justify-evenly flex-col items-center ">

            <h1 className="text-2xl font-bold mb-5">Login With Elearning</h1>

            <div className="flex justify-between flex-col">
                <Input
                    id="email"
                    type="email"
                    htmtFor={"email"}
                    placeholder="Enter your email address"
                    labelText="Enter Your Email"
                    className={"w-full mt-2"}

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
                    labelText="Enter Your Password"
                    className="w-full mt-2"
                    error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                    {...formik.getFieldProps('password')}

                />


            </div>
            <Button
                text={formik.isSubmitting ? "Submitting..." : "Login"}
                type="submit"
                className={`w-full mr-2a active:bg-blue-900  cursor-pointer hover:bg-blue-700 ${formik.isSubmitting ? "pointer-events-none" : ""}`}
                disabled={formik.isSubmitting}

            />

            <div className=" flex flex-col mt-2">
                <div className="font-bold">Or Join with</div>
                <div className="flex justify-center gap-1 mt-3">
                    <GitHubIcon />
                    <GoogleIcon />
                </div>
            </div>

            <div>Not Have Any Account?
                <Button
                    text="Sign Up"
                    type="submit"
                    className={"bg-slate-900 text-blue-500 cursor-pointer"}
                    onClick={() => setRoute("singup")}
                />
            </div>
        </form>

    );

}

export default Login