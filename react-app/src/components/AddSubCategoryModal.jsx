import React from "react";
import {Modal} from "@mui/material";
import {IoCloseCircle} from "react-icons/io5";
import {FaSpinner} from "react-icons/fa";

const AddSubCategoryModal = ({ showSubCategoryModal, closeSubCategoryModal, subCategory, setSubCategory, handleAddSubCategory, subCategoryParent, buttonLoading }) => {
    return (
        <Modal open={showSubCategoryModal} onClose={closeSubCategoryModal}>
            <form onSubmit={handleAddSubCategory}>
                <div className="absolute top-1/2 w-9/10 md:w-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Subcategory for {subCategoryParent.name}
                        </h2>
                        <IoCloseCircle className="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer" onClick={closeSubCategoryModal} />
                    </div>
                    <input
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full p-2 border border-gray-700 rounded-md"
                        placeholder="Subcategory Name"
                    />
                    <button
                        type="submit"
                        className={`px-8 py-2 rounded-lg mt-4 w-full flex items-center justify-center gap-2 text-white transition-all
                        ${!subCategory.trim() || buttonLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                    `}
                        disabled={!subCategory.trim() || buttonLoading}
                    >
                        {buttonLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "+ ADD"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddSubCategoryModal;
