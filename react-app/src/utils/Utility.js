export const formatEnumString = (enumString) => {
    if (!enumString) return "";
    return enumString
        .toLowerCase() // Convert to lowercase
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

export const initialToastState = {
    message: "",
    type: "",
};

export const isToday = (dateString) => {
    const orderDate = new Date(dateString);
    const today = new Date();
    return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
    );
};

export const getDate = (dateString) => {
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(dateString));
};

export const getTime = (dateString) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(dateString));
}

export const validateFoodForm = (foodItem, setToast) => {
    if (!foodItem.name?.trim()) {
        setToast({ message: "Food name is required", type: "error" });
        return false;
    }
    if (!foodItem.subCategory) {
        setToast({ message: "Subcategory is required", type: "error" });
        return false;
    }
    if (!foodItem.menuPrice || isNaN(foodItem.menuPrice) || foodItem.menuPrice <= 0) {
        setToast({ message: "Invalid price. Enter a positive number", type: "error" });
        return false;
    }
    if (!foodItem.offerPrice || isNaN(foodItem.offerPrice) || foodItem.offerPrice <= 0) {
        setToast({ message: "Invalid price. Enter a positive number", type: "error" });
        return false;
    }
    if (!foodItem.imageUrl?.trim()) {
        setToast({ message: "Image is required", type: "error" });
        return false;
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(foodItem.imageUrl)) {
        setToast({ message: "Invalid image URL. Must be a valid image link", type: "error" });
        return false;
    }
    if (!foodItem.foodType) {
        setToast({ message: "Food type is required (VEG/NON-VEG)", type: "error" });
        return false;
    }
    if (!foodItem.servingInfo) {
        setToast({ message: "Serving info is required", type: "error" });
        return false;
    }
    if (!foodItem.tag || foodItem.tag.length === 0) {
        setToast({ message: "At least one tag is required", type: "error" });
        return false;
    }
    return true;
}
