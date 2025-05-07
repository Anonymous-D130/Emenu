import {BACKEND_URL} from "../utils/config.js";

export const FETCH_PLANS = `${BACKEND_URL}/api/admin/plans`;
export const ADD_PLAN = `${BACKEND_URL}/api/admin/plan`;
export const DELETE_PLAN = (planId) => `${BACKEND_URL}/api/admin/plan/${planId}`;