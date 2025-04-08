//Backend Configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
export const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

//Payment Configuration
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
export const RAZORPAY_CURRENCY = "INR";
export const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME;

//Unsecured Routes
export const LOGIN_URL = `${BACKEND_URL}/api/auth/login`;
export const FORGOT_PASSWORD_URL = `${BACKEND_URL}/api/user/forgot-password`;
export const VERIFY_TOKEN_URL = `${BACKEND_URL}/api/user/verify-token`;
export const RESET_PASSWORD_URL =`${BACKEND_URL}/api/user/reset-password`;
export const OAUTH_URL = `${BACKEND_URL}/oauth2/authorization/google`;
export const GET_OTP = `${BACKEND_URL}/api/auth/get-otp`;
export const REGISTER_URL = `${BACKEND_URL}/api/auth/register`;
export const FETCH_TAGS = `${BACKEND_URL}/api/public/tags`;
export const FETCH_MEAT_TYPES = `${BACKEND_URL}/api/public/meat-types`;
export const FETCH_SERVING_INFO = `${BACKEND_URL}/api/public/serving-info`;

//Secured Routes
export const FETCH_USER_PROFILE = `${BACKEND_URL}/api/user/profile`;
export const FETCH_USER_SUBSCRIPTION = `${BACKEND_URL}/api/user/subscription`;
export const FETCH_RESTAURANT = `${BACKEND_URL}/api/restaurants/get`;
export const TOGGLE_RESTAURANT = `${BACKEND_URL}/api/restaurants/toggle`;
export const REGISTER_RESTAURANT = `${BACKEND_URL}/api/restaurants/register`;
export const FETCH_CATEGORIES = `${BACKEND_URL}/api/restaurants/categories`;
export const ADD_CATEGORY = `${BACKEND_URL}/api/restaurants/category`;
export const FETCH_SUBCATEGORY = (categoryId)=> `${BACKEND_URL}/api/restaurants/sub-categories/${categoryId}`;
export const ADD_SUBCATEGORY = (categoryId)=>  `${BACKEND_URL}/api/restaurants/sub-category/${categoryId}`;
export const ADD_FOOD_ITEM = (subCategoryId) => `${BACKEND_URL}/api/restaurants/${subCategoryId}/food`;
export const UPDATE_FOOD_ITEM = (foodId) => `${BACKEND_URL}/api/restaurants/food/${foodId}`;
export const DELETE_FOOD_ITEM = (foodId) => `${BACKEND_URL}/api/restaurants/food/${foodId}`;
export const FETCH_SUBCATEGORY_FOOD = (subCategoryId) => `${BACKEND_URL}/api/restaurants/sub-category/${subCategoryId}/foods`
export const TOGGLE_FOOD_ITEM = (foodId) => `${BACKEND_URL}/api/restaurants/toggle/${foodId}`;
export const FETCH_QR = `${BACKEND_URL}/api/restaurants/fetch-qr`;
export const GENERATE_QR = (tables) => `${BACKEND_URL}/api/restaurants/generate-qr/${tables}`;
export const FETCH_ORDERS = `${BACKEND_URL}/api/restaurants/orders`;
export const UPDATE_ORDER_STATUS = (orderId, orderStatus) => `${BACKEND_URL}/api/restaurants/order/${orderId}?orderStatus=${orderStatus}`;
export const CANCEL_ORDER = (orderId) => `${BACKEND_URL}/api/restaurants/order/${orderId}`;
export const IS_SUBSCRIPTION_ACTIVE = `${BACKEND_URL}/api/restaurants/active-subscription`;

//Payment Routes
export const FETCH_PLANS = `${BACKEND_URL}/api/restaurants/plans`;
export const INITIATE_PAYMENT = (planId) => `${BACKEND_URL}/api/restaurants/subscribe/${planId}`;
export const VERIFY_PAYMENT = `${BACKEND_URL}/api/restaurants/verify-payment`;

//Extras
export const FRONTEND_URL = `getMenu.com`;

//Customer Routes
export const REGISTER_CUSTOMER = (restaurantId) => `${BACKEND_URL}/api/customers/register/${restaurantId}`;
export const FETCH_CUSTOMER = (customerId) => `${BACKEND_URL}/api/customers/${customerId}`;
export const FETCH_RESTAURANT_INFO = (restaurantId) => `${BACKEND_URL}/api/customers/restaurant/${restaurantId}`;
export const GET_RESTAURANT_TABLES = (restaurantId) => `${BACKEND_URL}/api/customers/restaurant/${restaurantId}/tables`;
export const GET_RESTAURANT_TAGS = (restaurantId) => `${BACKEND_URL}/api/customers/restaurant/${restaurantId}/tags`;
export const PLACE_ORDER = (customerId) => `${BACKEND_URL}/api/customers/${customerId}/place-order`;
export const FETCH_ORDERS_USER = (customerId, restaurantId) => `${BACKEND_URL}/api/customers/${customerId}/orders/${restaurantId}`;
export const INACTIVE_CUSTOMER = (customerId) => `${BACKEND_URL}/api/customers/${customerId}/left`;
export const RING_BELL = (customerId, restaurantId) => `${BACKEND_URL}/api/customers/ring/${customerId}/${restaurantId}`;
export const UPDATE_TABLE = (tableNumber, customerId) => `${BACKEND_URL}/api/customers/table/${tableNumber}/${customerId}`;

export const WEBSOCKET_URL = `${BACKEND_URL}/ws`;