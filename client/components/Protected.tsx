import { useEffect, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

interface ProtectedProps {
  children: ReactNode;
  role?: string;
}

export default function Protected({ children, role }: ProtectedProps) {
  const router = useRouter();
  const { data: userData } = useAuth();

  useEffect(() => {
    if (!userData?.isLoading) {
      if (!userData?.isAuth) {
        router.replace("/");
        return;
      }

      if (role && userData?.userData?.role !== role) {
        router.replace("/");
      }
    }
  }, [userData, router, role]);

  if (userData?.isLoading) return <Loading size="5rem" />;
  if (!userData?.isAuth) return <Loading size="5rem" />;
  if (role && userData?.userData?.role !== role) return <Loading size="5rem" />;

  return <>{children}</>;
}
