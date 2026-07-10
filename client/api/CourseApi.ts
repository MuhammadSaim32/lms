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
}

const courseApi = new CourseApi();
export default courseApi;
