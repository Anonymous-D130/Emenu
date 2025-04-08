import {useState} from "react";
import SetUpMenu from "../components/SetUpMenu.jsx";
import {initialToastState} from "../utils/Utility.js";
import Toast from "../utils/Toast.jsx";

const Menu = () => {
    const [toast, setToast] = useState(initialToastState);

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <SetUpMenu setToast={setToast} />
        </main>
    );
};

export default Menu;
