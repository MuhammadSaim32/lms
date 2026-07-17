class NotificationApi {
    async getNotifications(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to fetch notifications");
        }

        return res.json();
    }

    async updateNotificationStatus(url: string) {
        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to update notification status");
        }

        return res.json();
    }
}

const notificationApi = new NotificationApi();
export default notificationApi;
