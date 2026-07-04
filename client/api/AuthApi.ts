
class AuthApi {

    async login(email: string, password: string, url: string) {
        const res = await fetch(url, {
            method: "POST",
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

}


const authApi = new AuthApi();
export default authApi;