import { useFormik } from 'formik';
import * as Yup from 'yup';
import authApi from '../api/AuthApi';
import route from '../routes';
import { useRef } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Button from "../components/Button"
import toast from 'react-hot-toast';
interface Props {
    setRoute: (val: string) => void;
}

const Verification = ({ setRoute }: Props) => {

    const inputRefs = useRef([]);
    const formik = useFormik({
        initialValues: {
            code: ['', '', '', '']
        },
        validationSchema:Yup.object({
            code: Yup.array()
                .of(
                    Yup.string()
                        .required()
                 )
                .length(4)
        }),
        onSubmit: async values => {
            const activationCode = values.code.join("")
            const token = localStorage.getItem("activation_token") || "";

    
            try {
                const res = await authApi.activate(activationCode, token, route.activateUser);
                toast.success(res.message)
                localStorage.removeItem("activation_token");
                setRoute("login");
            } catch (error) {
                toast.error(error.message)
                console.log(error);
            }
        },
    });

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !formik.values.code[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleChangeWithFocus = (e, idx) => {
        const val = e.target.value;

        formik.handleChange(e);
        if (val && idx < 3) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className='flex flex-col items-center gap-6'>
            <h1 className='font-bold text-2xl'>Verify Your Account</h1>
            <VerifiedUserIcon fontSize="large" color="primary" />
            <div className='flex gap-6'>
                {formik.values.code.map((value, idx) => (
                    

                    <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        id={`code.${idx}`}
                        name={`code.${idx}`}
                        type="number"
                        maxLength={1}
                        className='w-10 border h-10  outline-0 text-center  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        onInput={(e) => {
                            const target = e.target
                            if (target.value.length != 1) {
                                target.value = target.value.slice(0, 1);
                            }
                        }}
                        onChange={(e) => handleChangeWithFocus(e, idx)} // Custom wrapper handler
                        onKeyDown={(e) => handleKeyDown(e, idx)}       // Backspace handler
                        onBlur={formik.handleBlur}
                        value={value}
                    />
                ))}
            </div>
              {formik.touched.code?.length==4  && formik.errors.code && (
                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium animate-fade-in mt-1">
                        <span> Please complete the valid 4-digit security code.</span>
                    </div>
                )}

            <button type="submit"
                disabled={formik.isSubmitting}
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 ${formik.isSubmitting ? "pointer-none bg-blue-600" : ""}`}>
                {formik.isSubmitting ? "verifying.." : " Verify OTP"}
            </button>

            <div>Go Back to Sign in?
                <Button
                    text="Sign in"
                    type="submit"
                    className={"bg-slate-900 text-blue-500 cursor-pointer"}
                    onClick={() => setRoute("login")}
                />
            </div>
        </form>
    );
}

export default Verification;