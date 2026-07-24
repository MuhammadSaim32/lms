import "../globals.css";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {


    return (
        <html>

            <body>
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
            </body>
        </html>

    )
}