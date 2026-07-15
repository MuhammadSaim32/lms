class LayoutApi {
    async createLayout(url: string, data: any) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const resdata = await res.json()
        if (!res.ok) throw new Error(resdata.message || "Failed to create layout");
        return resdata
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
