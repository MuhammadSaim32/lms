class OrderApi {

    async getOrdersAnalytics(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch orders analytics");
        }

        return res.json();
    }
}

const orderApi = new OrderApi();
export default orderApi;
