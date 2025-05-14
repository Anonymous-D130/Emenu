import {useNavigate} from "react-router-dom";

const HomePage = ({ restaurant }) => {

    const navigate = useNavigate();
    return (
        <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-start relative">
            {/* Header Section */}
            <div className="w-full bg-white text-black pt-5 flex flex-col items-center rounded-b-3xl z-5">
                <h2 className="text-2xl font-semibold">Welcome to</h2>
                <div className="bg-yellow-400 px-4 w-full flex items-center justify-center rounded-b-3xl">
                    <img src={restaurant?.logo} alt="logo" className="h-35 max-w-screen" />
                </div>
            </div>

            {/* Main Image and Video Section */}
            <div className="flex-1 w-full flex flex-col items-center justify-end relative">
                <img
                    src={restaurant?.welcomeScreen}
                    alt="Delicious Food"
                    className="w-full h-[calc(100vh-150px)] object-cover absolute overflow-hidden -top-10 left-0 z-[1]"
                />

                <div className="z-10 flex flex-col items-center mb-30">
                    <button
                        className="bg-white rounded-full p-4 shadow-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-8 h-8 text-black"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-5.197-3.027A1 1 0 008 9.027v5.946a1 1 0 001.555.832l5.197-3.027a1 1 0 000-1.664z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate(`/${restaurant?.pageName}/tables`)}
                        className="mt-4 text-lg font-bold cursor-pointer text-white p-1 bg-gray-600 rounded-lg"
                    >Skip Intro</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;