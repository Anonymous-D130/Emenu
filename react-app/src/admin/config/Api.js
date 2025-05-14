import {BACKEND_URL} from "../../utils/config.js";

export const FETCH_ADMIN_PLANS = `${BACKEND_URL}/api/admin/plans`;
export const ADD_PLAN = `${BACKEND_URL}/api/admin/plan`;
export const DELETE_PLAN = (planId) => `${BACKEND_URL}/api/admin/plan/${planId}`;
export const GET_PARTNERS = `${BACKEND_URL}/api/admin/partners`;
export const FETCH_ALL_PLANS = `${BACKEND_URL}/api/admin/plans`;
export const UPDATE_PLAN = (userId, planId) => `${BACKEND_URL}/api/admin/updatePlan/${userId}/${planId}`;
export const DASHBOARD_DATA = `${BACKEND_URL}/api/admin/dashboard`;