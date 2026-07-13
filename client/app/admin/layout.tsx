import AdminSideBar from "./components/adminSidebar";
import "../globals.css"
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en">
            <body className="flex min-h-screen  h-screen bg-blue-300 w-screen">
                <AdminSideBar />
                {children}
            </body>
        </html>
    );
}
