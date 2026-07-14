import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
export default function Protected({ children }) {
    const router = useRouter()
    const { data: userData } = useAuth()

    useEffect(() => {
        if (!userData?.isLoading && !userData?.isAuth) {
            router.replace('/');
        }
    }, [userData, router]);

    if (userData?.isLoading) return <Loading size="5rem" />
    if (!userData?.isAuth) return <Loading size="5rem" />

    return children
}