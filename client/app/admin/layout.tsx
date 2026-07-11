import AdminSideBar from "./components/adminSidebar";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className=" flex min-h-screen  h-screen bg-blue-300 w-screen">
            <AdminSideBar />
            {children}
        </div>
    );
}
