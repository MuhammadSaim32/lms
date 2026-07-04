import { useFormik } from 'formik';
import * as Yup from 'yup';
import authApi from '../api/AuthApi';
import route from '../routes';

interface Props {
    setRoute: (val: string) => void;
}

const Verification = ({ setRoute }: Props) => {
    const formik = useFormik({
        initialValues: {
            code1: '',
            code2: '',
            code3: '',
            code4: '',
        },
        validationSchema: Yup.object({
            code1: Yup.string().length(1, 'Must be 1 character').required('Required'),
            code2: Yup.string().length(1, 'Must be 1 character').required('Required'),
            code3: Yup.string().length(1, 'Must be 1 character').required('Required'),
            code4: Yup.string().length(1, 'Must be 1 character').required('Required'),
        }),
        onSubmit: async values => {
            const activationCode = values.code1 + values.code2 + values.code3 + values.code4;
            const token = localStorage.getItem("activation_token") || "";

            try {
                const res = await authApi.activate(activationCode, token, route.activateUser);
                localStorage.removeItem("activation_token");
                setRoute("login");
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <input
                id="code1"
                name="code1"
                type="text"
                maxLength={1}
                className='w-10 border border-amber-300 outline-0'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.code1}
            />
            <input
                id="code2"
                name="code2"
                type="text"
                maxLength={1}
                className='w-10 border border-amber-300 outline-0'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.code2}
            />
            <input
                id="code3"
                name="code3"
                type="text"
                maxLength={1}
                className='w-10 border border-amber-300 outline-0'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.code3}
            />
            <input
                id="code4"
                name="code4"
                type="text"
                maxLength={1}
                className='w-10 border border-amber-300 outline-0'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.code4}
            />

            <button hidden={true} type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Enter
            </button>
        </form>
    );
}

export default Verification;