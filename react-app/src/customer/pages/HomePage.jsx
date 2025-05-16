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
                {/* Background Image */}
                <img
                    src={restaurant?.welcomeScreen}
                    alt="Welcome to our Restaurant"
                    className="absolute inset-0 w-full h-[calc(100vh-10rem)] object-cover -top-10 z-0"
                />

                {/* Overlay Content */}
                <div className="z-10 flex flex-col items-center mb-20">
                    {/* Play Button */}
                    <button
                        className="bg-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform duration-200"
                        aria-label="Play Intro Video"
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

                    {/* Skip Intro Button */}
                    <button
                        onClick={() => navigate(`/${restaurant?.pageName}/tables`)}
                        className="mt-4 text-lg font-semibold text-white px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                        Skip Intro
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;