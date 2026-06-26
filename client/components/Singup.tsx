import * as yup from "yup"
import { useFormik } from 'formik';
import { Input, Button } from '@mui/material';


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
        onSubmit: values => {

            setRoute("verification")
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

            <div>
                <label htmlFor="name">name</label>
                <Input id="name" type="text" {...formik.getFieldProps('name')} />
                {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                ) : null}

            </div>
            <div>           <label htmlFor="password">password</label>
                <Input id="password" type="password" {...formik.getFieldProps('password')} />
                {formik.touched.password && formik.errors.password ? (
                    <div>{formik.errors.password}</div>
                ) : null}

            </div>
            <Button type="submit">Submit</Button>
        </form>

    );

}

export default Singup