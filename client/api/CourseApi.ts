class CourseApi {
    async createCourse(url: string, data: any) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error("Failed to create course");
        }

        return res.json();
    }

    async getCourses(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }

        return res.json();
    }

    async deleteCourse(url: string) {
        const res = await fetch(url, {
            method: "DELETE",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to delete course");
        }

        return res.json();
    }

    async updateCourse(url: string, data: any) {
        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error("Failed to update course");
        }

        return res.json();
    }

    async createSession(url: string) {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Failed to create checkout session");
        }

        return res.json();
    }
}

const courseApi = new CourseApi();
export default courseApi;
