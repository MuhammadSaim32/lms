"use client"
import AdminSideBar from "./components/adminSidebar";
import Protected from "../../components/Protected";
import "../globals.css"
import AuthProvider from "../../context/AuthContext";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en">
            <body className="flex min-h-screen overflow-x-clip  h-screen bg-slate-900  w-screen">
                <AuthProvider>
                    <Protected>
                        <AdminSideBar />
                        {children}
                        <Toaster
                            toastOptions={{
                                position: 'top-right',
                                style: {
                                    border: '1px solid #713200',
                                    padding: '16px',
                                    color: '#713200',
                                    minWidth: "350px",
                                    marginRight: "15px",
                                },
                            }}
                        />
                    </Protected>
                </AuthProvider>
            </body>
        </html>
    );
}
