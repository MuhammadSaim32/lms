"use client"
import { Toaster } from 'react-hot-toast';
import Header from "../../components/Header";
import AuthProvider from "../../context/AuthContext"
import "../globals.css"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen h-screen overflow-x-clip">
                <AuthProvider>
                    <Header />
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
                </AuthProvider>
            </body>
        </html>
    );
}
