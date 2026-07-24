"use client"

import { useEffect, useState ,Suspense} from "react";
import authApi from "../../../../api/AuthApi";
import { route } from "../../../../routes";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from 'next/navigation';

 function GithubAuthContent() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code'); 


    useEffect(() => {
        const handleGithubAuth = async () => {
            if (!code) {
                router.replace("/");
                setLoading(false);
                return;
            }

            try {
                const data = await authApi.githubRegister(code, route.registerGithub);
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

        handleGithubAuth();
    }, [code]);

    return <div className="h-screen w-screen bg-slate-900 flex justify-center items-center">

        <div className="text-white text-2xl">
            {code && loading ? "Logging you in, please wait..." : ""}
        </div>
    </div>;
}


export default function GithubAuth() {
    return (
        <div className="h-screen w-screen bg-slate-900 flex justify-center items-center">
            <Suspense fallback={<div className="text-white text-2xl">Loading...</div>}>
                <GithubAuthContent />
            </Suspense>
        </div>
    );
}