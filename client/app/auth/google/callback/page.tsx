"use client"

import { useEffect, useState ,Suspense} from "react";
import authApi from "../../../../api/AuthApi";
import { route } from "../../../../routes";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from 'next/navigation';

 function GoogleAuthContent() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code'); 


    useEffect(() => {
        const handleGoogleAuth = async () => {
            if (!code) {
                router.replace("/");
                setLoading(false);
                return;
            }

            try {
                const data = await authApi.googleRegister(code, route.registerGoogle);
                toast.success(data.message)
                await new Promise((res) => {
                    setTimeout(() => {
                        res("reslove")
                    }, 700)
                })
                setLoading(false);
                router.replace("/");
            } catch (error) {
                toast.error(error.message);
                await new Promise((res) => {
                    setTimeout(() => {
                        res("reslove")
                    }, 700)
                })
                setLoading(false);
                router.replace("/");
            }
        };

        handleGoogleAuth();
    }, [code]);

    return <div className="h-screen w-screen bg-slate-900 flex justify-center items-center">
        <div className="text-white text-2xl">
            {code && loading ? "Logging you in, please wait..." : ""}
        </div>
    </div>;
}

export default function GoogleAuth() {
    return (
        <div className="h-screen w-screen bg-slate-900 flex justify-center items-center">
            <Suspense fallback={<div className="text-white text-2xl">Loading...</div>}>
                <GoogleAuthContent />
            </Suspense>
        </div>
    );
}