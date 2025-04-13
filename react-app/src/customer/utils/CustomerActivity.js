import axios from "axios";
import {INACTIVE_CUSTOMER} from "../../utils/config.js";
import {useEffect} from "react";

const CustomerActivity = (customer) => {
    const markCustomerLeft = async (customerId) => {
        try {
            await axios.put(INACTIVE_CUSTOMER(customerId));
        } catch (error) {
            console.error("Failed to mark customer as left", error);
        }
    };

    useEffect(() => {
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (customer?.id) {
                    markCustomerLeft(customer.id).then(r => r);
                    localStorage.removeItem("customer");
                    window.location.href = "/";
                }
            }, 2 * 60 * 60 * 1000); // 2hours
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        resetTimer();

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
        };
    }, [customer]);
}

export default CustomerActivity;