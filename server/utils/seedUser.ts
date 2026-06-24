import User from "../models/user.models.js";

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || "test@test.com";
const TEST_USER_NAME = process.env.TEST_USER_NAME || "test";
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || TEST_USER_EMAIL;

export default async function seedTestUser() {
    try {
        const exists = await User.findOne({ email: TEST_USER_EMAIL });
        if (exists) {
            console.log(`Test user ${TEST_USER_EMAIL} already exists.`);
            return;
        }

        await User.create({
            name: TEST_USER_NAME,
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
        });

        console.log(`Seeded test user: ${TEST_USER_EMAIL}`);
    } catch (error) {
        console.error("Error seeding test user:", error);
    }
}
