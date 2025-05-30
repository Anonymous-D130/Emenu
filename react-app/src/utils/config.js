/*************************************   Configuration & Setup  ************************************/

//Backend Configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const UPLOAD_URL = `${BACKEND_URL}/api/files/upload-image`;

//Payment Configuration
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
export const RAZORPAY_CURRENCY = "INR";
export const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME;

export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
export const HOME_URL = import.meta.env.VITE_HOME_URL;

/*************************************   Unsecured Routes  ************************************/

//Authentication Routes
export const LOGIN_URL = `${BACKEND_URL}/api/auth/login`;
export const FORGOT_PASSWORD_URL = `${BACKEND_URL}/api/user/forgot-password`;
export const VERIFY_TOKEN_URL = `${BACKEND_URL}/api/user/verify-token`;
export const RESET_PASSWORD_URL =`${BACKEND_URL}/api/user/reset-password`;
export const OAUTH_URL = `${BACKEND_URL}/oauth2/authorization/google`;
export const GET_OTP = `${BACKEND_URL}/api/auth/get-otp`;
export const REGISTER_URL = `${BACKEND_URL}/api/auth/register`;

//Fetching General Information (Can be hardcoded if always static)
export const FETCH_TAGS = `${BACKEND_URL}/api/public/tags`;
export const FETCH_MEAT_TYPES = `${BACKEND_URL}/api/public/meat-types`;
export const FETCH_SERVING_INFO = `${BACKEND_URL}/api/public/serving-info`;
export const FETCH_ORDER_STATUS = `${BACKEND_URL}/api/public/order-status`;

/*************************************   Secured Routes  ************************************/

//User
export const FETCH_USER_PROFILE = `${BACKEND_URL}/api/user/profile`;
export const FETCH_USER_SUBSCRIPTION = `${BACKEND_URL}/api/user/subscription`;
export const IS_SUBSCRIPTION_ACTIVE = `${BACKEND_URL}/api/restaurants/subscription-status`;

//Restaurant
export const FETCH_RESTAURANT = `${BACKEND_URL}/api/restaurants/get`;
export const TOGGLE_RESTAURANT = `${BACKEND_URL}/api/restaurants/toggle`;
export const CHECK_PAGE_NAME = `${BACKEND_URL}/api/restaurants/check-page-name`;
export const REGISTER_RESTAURANT = `${BACKEND_URL}/api/restaurants/register`;
export const FETCH_DASHBOARD = `${BACKEND_URL}/api/restaurants/dashboard`;
export const SEND_EVENT_DETAILS = (restaurantId) => `${BACKEND_URL}/api/user/event-details/${restaurantId}`;

//Categories
export const FETCH_CATEGORIES = `${BACKEND_URL}/api/restaurants/categories`;
export const ADD_CATEGORY = `${BACKEND_URL}/api/restaurants/category`;
export const UPDATE_CATEGORY = (categoryId) => `${BACKEND_URL}/api/restaurants/category/${categoryId}`;
export const DELETE_CATEGORY = (categoryId) => `${BACKEND_URL}/api/restaurants/category/${categoryId}`;

//SubCategories
export const FETCH_SUBCATEGORY = (categoryId)=> `${BACKEND_URL}/api/restaurants/sub-categories/${categoryId}`;
export const ADD_SUBCATEGORY = (categoryId)=>  `${BACKEND_URL}/api/restaurants/sub-category/${categoryId}`;
export const UPDATE_SUBCATEGORY = (subCategoryId) => `${BACKEND_URL}/api/restaurants/sub-category/${subCategoryId}`;
export const DELETE_SUBCATEGORY = (subCategoryId) => `${BACKEND_URL}/api/restaurants/sub-category/${subCategoryId}`;

//Food Items
export const ADD_FOOD_ITEM = (subCategoryId) => `${BACKEND_URL}/api/restaurants/${subCategoryId}/food`;
export const UPDATE_FOOD_ITEM = (foodId) => `${BACKEND_URL}/api/restaurants/food/${foodId}`;
export const DELETE_FOOD_ITEM = (foodId) => `${BACKEND_URL}/api/restaurants/food/${foodId}`;
export const FETCH_SUBCATEGORY_FOOD = (subCategoryId) => `${BACKEND_URL}/api/restaurants/sub-category/${subCategoryId}/foods`
export const TOGGLE_FOOD_ITEM = (foodId) => `${BACKEND_URL}/api/restaurants/toggle/${foodId}`;

//QR Code
export const FETCH_QR = `${BACKEND_URL}/api/restaurants/fetch-qr`;
export const GENERATE_QR = (tables) => `${BACKEND_URL}/api/restaurants/generate-qr/${tables}`;

//Orders
export const FETCH_ORDERS = `${BACKEND_URL}/api/restaurants/orders`;
export const FETCH_TODAY_ORDERS = `${BACKEND_URL}/api/restaurants/today-orders`;
export const UPDATE_ORDER_STATUS = (orderId, orderStatus) => `${BACKEND_URL}/api/restaurants/order/${orderId}?orderStatus=${orderStatus}`;
export const CANCEL_ORDER = (orderId) => `${BACKEND_URL}/api/restaurants/order/${orderId}`;

//Payment Routes
export const FETCH_PLANS = `${BACKEND_URL}/api/restaurants/plans`;
export const ACTIVATE_TRIAL = (planId) => `${BACKEND_URL}/api/restaurants/trial/${planId}`;
export const INITIATE_MONTHLY_PAYMENT = (planId) => `${BACKEND_URL}/api/restaurants/subscribe/${planId}`;
export const INITIATE_ANNUAL_PAYMENT = (planId) => `${BACKEND_URL}/api/restaurants/subscribe/yearly/${planId}`;
export const UPGRADE_PLAN_PAYMENT = (planId) => `${BACKEND_URL}/api/restaurants/upgrade/plan/${planId}`;
export const VERIFY_PAYMENT = `${BACKEND_URL}/api/restaurants/verify-payment`;

//Services
export const FETCH_SERVICES = `${BACKEND_URL}/api/restaurants/services`;
export const ADD_SERVICE = `${BACKEND_URL}/api/restaurants/add/service`;
export const REMOVE_SERVICE = (id) => `${BACKEND_URL}/api/restaurants/remove/service/${id}`;

//Customer Routes
export const REGISTER_CUSTOMER = (pageName) => `${BACKEND_URL}/api/customers/register/${pageName}`;
export const FETCH_CUSTOMER = (customerId) => `${BACKEND_URL}/api/customers/${customerId}`;
export const FETCH_RESTAURANT_INFO = (pageName) => `${BACKEND_URL}/api/customers/restaurant/${pageName}`;
export const GET_RESTAURANT_TABLES = (pageName) => `${BACKEND_URL}/api/customers/restaurant/${pageName}/tables`;
export const GET_RESTAURANT_TAGS = (pageName) => `${BACKEND_URL}/api/customers/restaurant/${pageName}/tags`;
export const PLACE_ORDER = (customerId) => `${BACKEND_URL}/api/customers/${customerId}/place-order`;
export const FETCH_ORDERS_USER = (customerId, pageName) => `${BACKEND_URL}/api/customers/${customerId}/orders/${pageName}`;
export const INACTIVE_CUSTOMER = (customerId) => `${BACKEND_URL}/api/customers/${customerId}/left`;
export const RING_BELL = (customerId, pageName) => `${BACKEND_URL}/api/customers/ring/${customerId}/${pageName}`;
export const UPDATE_TABLE = (tableNumber, customerId) => `${BACKEND_URL}/api/customers/table/${tableNumber}/${customerId}`;
export const FETCH_SERVICES_OFFERED = (pageName) => `${BACKEND_URL}/api/customers/${pageName}/services`;
//websocket
export const WEBSOCKET_URL = `${BACKEND_URL}/ws`;