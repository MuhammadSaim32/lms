
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

        const data = await res.json();
            console.log("Login response:", data.message); // Debugging line to check the response

        if (!res.ok) {
            throw new Error(data.message);
        }

        return data

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
        let data = await res.json();
        if (!res.ok) {
            throw new Error(data.message);
        }

        return data;
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

    async getUsers(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }

        return res.json();
    }

    async deleteUser(url: string) {
        const res = await fetch(url, {
            method: "DELETE",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to delete user");
        }

        return res.json();
    }
}

const authApi = new AuthApi();
export default authApi;