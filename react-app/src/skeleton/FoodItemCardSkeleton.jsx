const FoodItemCardSkeleton = () => {
    return (
        <div className="flex items-center flex-wrap md:flex-nowrap p-3 my-4 md:mx-2 border-b-2 border-gray-200 animate-pulse">
            {/* Image Skeleton */}
            <div className="w-18 h-18 md:h-16 rounded-md bg-gray-300"></div>

            {/* Text Skeleton */}
            <div className="md:flex-1 ml-3 block text-left space-y-2 w-full">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    <div className="h-4 w-32 bg-gray-300 rounded" />
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>

            {/* Toggle Skeleton */}
            <div className="w-1/2 md:w-auto ml-3">
                <div className="w-11 h-6 bg-gray-300 rounded-full" />
            </div>

            {/* Action Skeleton */}
            <div className="flex justify-end space-x-3 ml-auto md:ml-3">
                <div className="p-2 w-8 h-8 bg-gray-300 rounded-md" />
                <div className="p-2 w-8 h-8 bg-gray-300 rounded-md" />
            </div>
        </div>
    );
};

export default FoodItemCardSkeleton;