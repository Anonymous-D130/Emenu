import React from "react";

const CategoryList = ({categories, setSelectedCategory, selectedCategory, openSubCategoryModal, selectedSubCategory, setSelectedSubCategory, openModal}) => {

    const handleSelectCategory = (category) => {
        if (selectedCategory !== category) {
            setSelectedCategory(category);
            setSelectedSubCategory(category.subCategories[0]);
        } else {
            setSelectedCategory("");
            setSelectedSubCategory("");
        }
    };

    return (
        <div className="w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
                <button
                    className="bg-purple-600 text-white rounded-lg py-2 px-3 md:px-4 text-sm"
                    onClick={openModal}
                >
                    + ADD
                </button>
            </div>

            <ul className="space-y-3">
                {categories.map((category, index) => (
                    <li key={index} className="cursor-pointer">
                        <div
                            className={`p-3 md:p-4 rounded-lg flex justify-between items-center transition-all duration-300 ${
                                selectedCategory === category
                                    ? "bg-purple-100 text-purple-700 border border-purple-500"
                                    : "hover:bg-gray-100 border border-gray-300"
                            }`}
                            onClick={() => handleSelectCategory(category)}
                        >
                            <span className="font-medium text-gray-800 flex items-center">
                                {category.name}
                                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 text-xs rounded">
                                    {category.items}
                                </span>
                            </span>
                            <button
                                className="ml-2 md:ml-3 bg-blue-600 text-white text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-md"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openSubCategoryModal(category);
                                }}
                            >
                                + SUB
                            </button>
                        </div>

                        {selectedCategory === category && category.subCategories.length > 0 && (
                            <div className="ml-4 md:ml-6 mt-2 space-y-1">
                                {category.subCategories.map((sub, i) => (
                                    <div
                                        key={i}
                                        className={`pl-3 md:pl-4 py-1 border-l-2 border-purple-400 cursor-pointer text-sm md:text-base hover:bg-purple-800 hover:text-white
                                        ${selectedSubCategory === sub ? "bg-purple-500 text-white" : "text-purple-700"}`}
                                        onClick={() => setSelectedSubCategory(sub)}
                                    >
                                        ↳ {sub.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;