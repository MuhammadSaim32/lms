# LMS Backend API Documentation

## Base URL

- `http://localhost:<PORT>/api/v1`
- Example health check: `GET http://localhost:<PORT>/test`

> Replace `<PORT>` with the port your server is running on.

---

## Authentication

- This API uses cookie-based authentication.
- After successful login, the server sets `accessToken` and `refreshToken` cookies.
- All authenticated endpoints require `accessToken` cookie to be sent.
- In Postman, enable `Send cookies automatically` or use the `Cookies` tab.

---

## General Notes

- `AuthMiddleware` protects routes that require login.
- `RoleMiddleware("admin")` protects admin-only routes.
- `POST /webhook` expects raw Stripe webhook JSON and Stripe signature header.

---

## User Endpoints

### Register Local User

- `POST /api/v1/register`
- Body (JSON):
  - `name`: string
  - `email`: string
  - `password`: string
  - `avatar`: object (optional)
    - `public_id`: string
    - `url`: string
- Response: activation token is returned, email activation is sent.

### Activate User

- `POST /api/v1/activate-user`
- Body (JSON):
  - `activationCode`: string
  - `token`: string
- Response: account activation success.

### Login

- `POST /api/v1/login`
- Body (JSON):
  - `email`: string
  - `password`: string
- Response: sets authentication cookies.

### Logout

- `GET /api/v1/logout`
- Requires auth cookie.
- Response: clears auth cookies.

### Get Logged-in User Profile

- `GET /api/v1/me`
- Requires auth cookie.
- Response: user data.

### Update Profile

- `PUT /api/v1/update-profile`
- Requires auth cookie.
- Body (JSON): at least one field required
  - `name`: string (optional)
  - `email`: string (optional)

### Update Password

- `PUT /api/v1/update-password`
- Requires auth cookie.
- Body (JSON):
  - `oldPassword`: string
  - `newPassword`: string

### Admin: Get All Users

- `GET /api/v1/get-all-users`
- Requires admin auth.

### Admin: Delete User

- `DELETE /api/v1/delete-user/:id`
- Requires admin auth.
- Replace `:id` with user ID.

### Admin: Users Analytics

- `GET /api/v1/users-analytics`
- Requires admin auth.

### OAuth / Provider Registration

- `POST /api/v1/register/google`
- `POST /api/v1/register/github`

> Request body for OAuth endpoints is application-specific and depends on your front-end/provider flow. Use these only if the tester knows the provider token structure.

---

## Course Endpoints

### Upload Course (Admin)

- `POST /api/v1/upload-course`
- Requires admin auth.
- Body (JSON): full course object, typically includes:
  - `name`: string
  - `description`: string
  - `price`: number
  - `estimatedPrice`: number
  - `level`: string
  - `demoUrl`: string
  - `tags`: string[]
  - `categories`: string[]
  - `benefits`: [{ title: string }] (optional)
  - `prerequisites`: [{ title: string }] (optional)
  - `courseData`: [
    {
    `videoSection`: string,
    `videoSectionData`: [
    {
    `title`: string,
    `description`: string,
    `videoUrl`: string,
    `videoLength`: string or object,
    `questions`: []
    }
    ]
    }
    ]
  - `pic`: string (optional base64 or image URL for upload)

### Update Course (Admin)

- `PUT /api/v1/update-course/:id`
- Requires admin auth.
- Body (JSON): any course fields to update.
- If updating thumbnail:
  - `pic`: base64/image URL
  - `public_id`: existing Cloudinary public_id to replace

### Get Single Course

- `GET /api/v1/get-course/:id`
- Public endpoint.
- Response differs for non-admin users: only public course fields are returned.

### Get All Courses

- `GET /api/v1/get-all-courses`
- Public endpoint.
- Returns minimal course list.

### Add Question to Course Content

- `PUT /api/v1/add-question`
- Requires auth cookie.
- Body (JSON):
  - `question`: string
  - `courseId`: string
  - `contentId`: string

### Add Answer to Question

- `PUT /api/v1/add-answer`
- Requires auth cookie.
- Body (JSON):
  - `answer`: string
  - `questionId`: string
  - `courseId`: string
  - `contentId`: string

### Add Review

- `PUT /api/v1/add-review/:id`
- Requires auth cookie.
- Body (JSON):
  - `review`: string
  - `rating`: number

### Add Reply to Review (Admin)

- `PUT /api/v1/add-reply-to-review`
- Requires admin auth.
- Body (JSON):
  - `review`: string
  - `courseId`: string
  - `reviewId`: string

### Admin: Get All Courses

- `GET /api/v1/get-all-courses-for-admin`
- Requires admin auth.

### Admin: Delete Course

- `DELETE /api/v1/delete-course/:id`
- Requires admin auth.

---

## Order Endpoints

### Create Order

- `POST /api/v1/create-order`
- Requires auth cookie.
- Body (JSON):
  - `courseId`: string
  - `payment_info`: object (optional)

### Create Stripe Checkout Session

- `GET /api/v1/createSession/:id`
- Requires auth cookie.
- `:id` is the course ID.
- Response: `{ url: string }` for Stripe checkout.

### Stripe Webhook

- `POST /api/v1/webhook`
- Public webhook endpoint.
- Must send raw JSON body and Stripe signature header `stripe-signature`.
- Used by Stripe to confirm `checkout.session.completed`.

### Admin: Orders Analytics

- `GET /api/v1/orders-analytics`
- Requires admin auth.
- Returns orders grouped by month.

---

## Notification Endpoints

### Admin: Get All Notifications

- `GET /api/v1/get-all-notification`
- Requires admin auth.

### Admin: Update Notification Status

- `PUT /api/v1/update-notification-status/:id`
- Requires admin auth.
- `:id` is notification ID.

---

## Layout Endpoints

### Create / Update Layout (Admin)

- `POST /api/v1/create-layout`
- Requires admin auth.
- Body (JSON) depends on `type`:
  - `type`: `Banner` | `FAQ` | `Category`

#### Banner

- Required for creation:
  - `type`: `Banner`
  - `title`: string
  - `subTitle`: string
  - `image`: string (base64 or image URL)

- Update payload may include:
  - `title`: string
  - `subTitle`: string
  - `image`: string
  - `public_id`: string (existing Cloudinary ID, optional)

#### FAQ

- Body:
  - `type`: `FAQ`
  - `faq`: [{ question: string, answer: string }]

#### Category

- Body:
  - `type`: `Category`
  - `categories`: [{ title: string }]

### Get Layout

- `GET /api/v1/get-layout?type=<TYPE>`
- Query:
  - `type`: `Banner` | `FAQ` | `Category`

---

## Test Checklist for the Tester

1. Confirm server health: `GET /test`.
2. Register a local user: `POST /register`.
3. Activate account: `POST /activate-user`.
4. Login: `POST /login` and verify cookies.
5. Access protected profile: `GET /me`.
6. Create and update courses with admin user.
7. Create an order and verify checkout session.
8. Validate admin-only analytics and list endpoints.

---

## Important

- If cookies are not preserved, authenticated requests will fail.
- For webhook testing, Stripe must sign the request correctly.
- If the tester only needs API endpoints, use Postman or similar REST clients and set `Cookie` values from login response.
