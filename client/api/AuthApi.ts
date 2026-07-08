
class AuthApi {

    async login(email: string, password: string, url: string) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                email,
                password,
            }),
        })

        if (!res.ok) {
            throw new Error("Failed to login");
        }

        return res.json();

    }

    async register(name: string, email: string, password: string, url: string) {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })

        if (!res.ok) {
            throw new Error("Failed to register");
        }

        return res.json();
    }

    async activate(activationCode: string, token: string, url: string) {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                activationCode,
                token,
            }),
        })

        if (!res.ok) {
            throw new Error("Failed to activate");
        }

        return res.json();
    }



    async profile(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },

        })

        if (!res.ok) {
            throw new Error("Failed to activate");
        }

        return res.json();
    }


    async updateProfile(url: string, { email, name }: { email: string; name: string }) {
        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                email,
                name,
            }),

        })

        if (!res.ok) {
            throw new Error("Failed to activate");
        }

        return res.json();
    }

    async updatePassword(url: string, { oldPassword, newPassword }: { oldPassword: string; newPassword: string }) {
        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),

        })

        if (!res.ok) {
            throw new Error("Failed to update password");
        }

        return res.json();
    }
}


const authApi = new AuthApi();
export default authApi;