"use client";
import AdminSideBar from "./components/adminSidebar";
import Protected from "../../components/Protected";
import "../globals.css";
import AuthProvider from "../../context/AuthContext";
import AdminHeader from "./components/AdminHeader";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen overflow-x-clip h-screen bg-slate-950 w-screen antialiased text-slate-100">
        <AuthProvider>
          <Protected role="admin">
            <AdminSideBar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>

            <Toaster
              toastOptions={{
                position: "top-right",
                style: {
                  border: "1px solid #334155",
                  padding: "16px",
                  color: "#f8fafc",
                  backgroundColor: "#0f172a",
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
