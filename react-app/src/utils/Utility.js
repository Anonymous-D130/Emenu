export function validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character.");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

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

export const initialFoodItem = {
    name: "",
    imageUrl: "",
    menuPrice: "",
    offerPrice: "",
    available: false,
    description: "",
    foodType: "",
    meatType: null,
    servingInfo: "",
    tag: [],
    nutritionInfo: {
        calories: { value: "", unit: "grams" },
        protein: { value: "", unit: "grams" },
        carbohydrates: { value: "", unit: "grams" },
        fats: { value: "", unit: "grams" },
        fiber: { value: "", unit: "grams" },
        sugar: { value: "", unit: "grams" },
    },
    category: null,
    subCategory: null,
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
