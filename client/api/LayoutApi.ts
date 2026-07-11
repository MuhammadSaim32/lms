class LayoutApi {
    async createLayout(url: string, data: any) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create layout");
        return res.json();
    }


    async getLayout(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch layout");
        return res.json();
    }
}

const layoutApi = new LayoutApi();
export default layoutApi;
