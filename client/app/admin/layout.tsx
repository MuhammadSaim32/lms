import AdminSideBar from "./components/adminSidebar";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <body className=" flex h-screen bg-blue-300">
            <AdminSideBar />
            {children}
        </body>
    );
}
