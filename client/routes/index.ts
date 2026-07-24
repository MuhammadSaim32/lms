const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000/api/v1";

export const routes = {
  // User routes
  register: `${BASE_URL}/register`,
  registerGithub: `${BASE_URL}/register/github`,
  activateUser: `${BASE_URL}/activate-user`,
  login: `${BASE_URL}/login`,
  logout: `${BASE_URL}/logout`,
  refreshToken: `${BASE_URL}/refresh-token`,
  me: `${BASE_URL}/me`,
  socialLogin: `${BASE_URL}/social-login`,
  updateProfile: `${BASE_URL}/update-profile`,
  updatePassword: `${BASE_URL}/update-password`,
  updateAvatar: `${BASE_URL}/update-avatar`,
  getAllUsers: `${BASE_URL}/get-all-users`,
  updateRole: `${BASE_URL}/update-role`,
  deleteUser: (id: string) => `${BASE_URL}/delete-user/${id}`,

  // Course routes
  uploadCourse: `${BASE_URL}/upload-course`,
  updateCourse: (id: string) => `${BASE_URL}/update-course/${id}`,
  getCourse: (id: string) => `${BASE_URL}/get-course/${id}`,
  getAllCourses: `${BASE_URL}/get-all-courses`,
  getCoursesByUser: (id: string) => `${BASE_URL}/get-courses-by-use/${id}`,
  addQuestion: `${BASE_URL}/add-question`,
  addAnswer: `${BASE_URL}/add-answer`,
  addReview: (id: string) => `${BASE_URL}/add-review/${id}`,
  addReplyToReview: `${BASE_URL}/add-reply-to-review`,
  getAllCoursesForAdmin: `${BASE_URL}/get-all-courses-for-admin`,
  deleteCourse: (id: string) => `${BASE_URL}/delete-course/${id}`,

  // Order routes
  createOrder: `${BASE_URL}/create-order`,
  createSession: (id: string) => `${BASE_URL}/createSession/${id}`,

  // Notification routes
  getAllNotification: `${BASE_URL}/get-all-notification`,
  updateNotificationStatus: (id: string) => `${BASE_URL}/update-notification-status/${id}`,

  // Layout routes
  createLayout: `${BASE_URL}/create-layout`,
  getLayout: (type: string) => `${BASE_URL}/get-layout?type=${type}`,
} as const;

export const route = routes;
export default routes;
