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
        <form onSubmit={formik.handleSubmit} className='flex flex-col items-center gap-6 w-full'>
            <div className="text-center mb-2">
                <h1 className='text-3xl font-extrabold text-white bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-2'>Verify Account</h1>
                <p className="text-sm text-slate-400">Enter the 4-digit code sent to your email</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <VerifiedUserIcon className="text-indigo-400" sx={{ fontSize: 32 }} />
            </div>
            <div className='flex gap-6'>
                {formik.values.code.map((value, idx) => (
                    

                    <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        id={`code.${idx}`}
                        name={`code.${idx}`}
                        type="number"
                        maxLength={1}
                        className='w-14 h-14 bg-slate-900/50 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-center text-2xl font-bold text-white outline-none transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
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
                className={`w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40 ${formik.isSubmitting ? "pointer-events-none opacity-70" : ""}`}>
                {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center text-sm text-slate-400 mt-2 pt-4 border-t border-slate-800 w-full">
                Go back to{" "}
                <button
                    type="button"
                    className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all cursor-pointer"
                    onClick={() => setRoute("login")}
                >
                    Sign in
                </button>
            </div>
        </form>
    );
}

export default Verification;