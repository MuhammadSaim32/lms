import * as yup from "yup"
import { useFormik } from 'formik';
import { Input, Button } from '@mui/material';


const loginSchema = yup.object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("password is required").min(6)
})

const Login = ({ setRoute }: { setRoute: (val: string) => void }) => {

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: values => {

            console.log("value is entere")
        },
    });
    return (

        <form onSubmit={formik.handleSubmit} className="h-36 flex justify-center flex-col items-center">
            <div>
                <label htmlFor="email">Email</label>
                <Input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                ) : null}
            </div>

            <div>           <label htmlFor="password">password</label>
                <Input id="password" type="password" {...formik.getFieldProps('password')} />
                {formik.touched.password && formik.errors.password ? (
                    <div>{formik.errors.password}</div>
                ) : null}

            </div>
            <Button
                onClick={() => setRoute("singup")}
            >singup</Button>
            <Button type="submit">Submit</Button>
        </form>

    );

}

export default Login