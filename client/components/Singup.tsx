import * as yup from "yup"
import { useFormik } from 'formik';
import authApi from "../api/AuthApi"
import route from "../routes"
import Input from "./Input";
import Button from "./Button"
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import toast from "react-hot-toast";
const loginSchema = yup.object({
    name: yup.string().required("name is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("password is required").min(6)
})

const Singup = ({ setRoute }: { setRoute: (val: string) => void }) => {

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
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
                    placeholder="Jhon"
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
                    placeholder="Jhon@gmail.con"
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
                    placeholder="password!@3"
                    labelText="Enter the Password"
                    className="w-full mt-2"
                    error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                    {...formik.getFieldProps('password')}

                />


            </div>
            <Button
                text={formik.isSubmitting ? "Submitting..." : "Singup"}
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