"use client"
import AdminSideBar from "./components/adminSidebar";
import Protected from "../../components/Protected";
import "../globals.css"
import AuthProvider from "../../context/AuthContext";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en">
            <body className="flex min-h-screen  h-screen bg-slate-900 w-screen">
                <AuthProvider>
                    <Protected>
                        <AdminSideBar />
                        {children}
                    </Protected>
                </AuthProvider>
            </body>
        </html>
    );
}
