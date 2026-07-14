
import { useState, useEffect } from 'react';
import AuthApi from "../api/AuthApi"
import Routes from "../routes"
import { createContext, useContext } from 'react';

export const AuthContext = createContext({ isAuth: false, userData: null, isLoading: false, setData: () => { } });

function AuthProvider({ children }) {
    const [data, setData] = useState({ isAuth: false, userData: null, isLoading: true })

    const fetchUserData = async () => {
        setData((Prev) => ({ ...Prev, isLoading: true }))
        try {
            const res = await AuthApi.profile(Routes.me)
            console.log("User data fetched:", res.data); // Debugging line to check the response
            setData({ isAuth: true, userData: res.data.user, isLoading: false })
        } catch (err) {
            console.log(err)
            setData({ isAuth: false, userData: null, isLoading: false })
        }
    }


    useEffect(() => {

        fetchUserData()


    }, [data.isAuth])

    return (
        <AuthContext value={{ data, setData }} >
            {children}
        </AuthContext>
    )


}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthProvider