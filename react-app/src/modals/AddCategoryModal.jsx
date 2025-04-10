import React from "react";
import {Modal} from "@mui/material";
import {IoCloseCircle} from "react-icons/io5";
import {FaSpinner} from "react-icons/fa";

const AddCategoryModal = ({ showModal, closeModal, categoryName, setCategoryName, handleAddCategory, buttonLoading }) => {
    return (
        <Modal open={showModal} onClose={closeModal}>
            <form onSubmit={handleAddCategory}>
                <div className="absolute w-9/10 md:w-1/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Name</h2>
                        <IoCloseCircle className="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer" onClick={closeModal} />
                    </div>
                    <input
                        type="text"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full p-2 border border-gray-700 rounded-md"
                        placeholder="Category Name"
                    />
                    <button
                        className={`px-8 py-2 rounded-lg mt-4 w-full text-white transition-all flex justify-center items-center gap-2
                            ${!categoryName.trim() || buttonLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                        `}
                        type="submit"
                        disabled={!categoryName.trim() || buttonLoading}
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

export default AddCategoryModal;
