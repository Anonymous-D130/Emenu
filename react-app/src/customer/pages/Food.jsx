import React, {useCallback, useEffect, useState} from "react";
import { SiGoogletranslate } from "react-icons/si";
import { IoMdSearch } from "react-icons/io";
import { IoMdOptions } from "react-icons/io";
import {IoChevronForward, IoEggOutline} from "react-icons/io5";
import {MdOutlineExpandMore, MdRoomService} from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";
import Veg from "../../assets/veg.png";
import nonVeg from "../../assets/Non-veg.png";
import FoodItemModal from "../components/FoodItemModal.jsx";
import PlacingOrderModal from "../components/PlacingOrderModal.jsx";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import {FETCH_ORDERS_USER, GET_RESTAURANT_TAGS, RING_BELL, UPDATE_TABLE} from "../../utils/config.js";
import {formatEnumString, initialToastState} from "../../utils/Utility.js";
import ErrorPage from "./ErrorPage.jsx";
import Toast from "../../utils/Toast.jsx";
import OrderPlacedModal from "../components/OrderPlacedModal.jsx";
import ContactModal from "../components/ContactModal.jsx";
import customerActivity from "../utils/CustomerActivity.js";

const filterOptions = [
    { label: "Veg", icon: <img src={`${Veg}`} alt="veg" className="w-4 h-4 bg-white" />, value: "VEG" },
    { label: "NonVeg", icon: <img src={`${nonVeg}`} alt="non-veg" className="w-4 h-4 bg-white" />, value: "NON_VEG" },
    { label: "Egg", icon: <IoEggOutline/>, value: "EGG" },
];

const offer = false;

const Food = () => {
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const tableNumber = searchParams.get('tableNumber');
    const logo = searchParams.get('logo');
    const [expanded, setExpanded] = useState({});
    const [taggedFoods, setTaggedFoods] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(initialToastState);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem("customer")));
    const [orders, setOrders] = useState([]);
    const [bellLoading, setBellLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [cart, setCart] = useState({
        id: null,
        items: [],
        totalAmount: 0,
    });

    customerActivity(customer);
    
    const updateTable = useCallback(async () => {
        try {
            const response = await axios.put(UPDATE_TABLE(tableNumber, customer?.id));
            setCustomer(response.data);
            localStorage.setItem("customer", JSON.stringify(response.data));
            setHasError(false);
        } catch (error) {
            console.error("Error fetching customer details : ", error);
            setToast({message: error.response.data ? error.response?.data?.message : error.message, type: "error"});
            setHasError(true);
        }
    }, [customer?.id, tableNumber]);
    
    useEffect(() => {
        if(customer?.tableNumber !== tableNumber){
            updateTable().then(r => r);
        }
    }, [customer?.tableNumber, tableNumber, updateTable]);

    const fetchTags = async (restaurantId) => {
        setLoading(true);
        try {
            const response = await axios.get(GET_RESTAURANT_TAGS(restaurantId));
            setTaggedFoods(response.data);
            setHasError(false);
        } catch (error) {
            setHasError(true);
            console.error("Error fetching tags: ", error);
            setHasError(true);
            setToast({ message: error.response ? error.response?.data?.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(restaurantId) fetchTags(restaurantId).then(t => t);
    }, [restaurantId]);

    const fetchOrders = async (restaurantId, customerId) => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_ORDERS_USER(customerId, restaurantId));
            setOrders(response.data);
            if(response.data.length > 0) setShowModal(true);
            setHasError(false);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            setToast({ message: error.response ? error.response?.data?.message : error.message, type: "error" });
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }

    const refreshOrders = () => {
        fetchOrders(restaurantId, customer.id).then(t => t);
    }

    const ringBell = async () => {
        if(customer.id){
            setBellLoading(true);
            try {
                const response = await axios.post(RING_BELL(customer.id, restaurantId));
                setToast({message: response?.data?.message, type: "success" });
            } catch (error) {
                setToast({ message: error.response ? error.response?.data?.message : error?.message, type: "error" });
                console.error("Error ringing bell: ", error);
                setBellLoading(false);
            } finally {
                setTimeout(() => setBellLoading(false), 15000)
            }
        }
    }

    useEffect(() => {
        if (restaurantId && customer) fetchOrders(restaurantId, customer.id).then(t => t);
    }, [restaurantId, customer]);

    const showErrorPage = !restaurantId || !tableNumber || hasError || !logo;

    if (showErrorPage) {
        return (
            <ErrorPage
                loading={loading}
                toast={toast}
                setToast={setToast}
            />
        );
    }

    const toggleSection = (key) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleApplyFilter = (value) => {
        if(selectedFilter === value) {
            setSelectedFilter(null);
        } else {
            setSelectedFilter(value);
        }
    }

    return (
        <div className="font-sans bg-[#F6F6F6] min-h-screen text-black max-w-screen">
            {/* Header */}
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast(initialToastState)} />}
            <div className="bg-yellow-400 px-4 py-3 flex items-center justify-between rounded-b-3xl">
                <img src={logo} alt="logo" className="h-35 max-w-2/3" />
                <button className="border px-3 py-1 rounded-xl text-lg font-bold flex items-center gap-2">
                    <SiGoogletranslate/> English
                </button>
            </div>

            <div className="relative p-4">
                <IoMdSearch className="absolute top-1/2 left-8 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search for dishes"
                    className="w-full pl-12 pr-4 py-2 border bg-white border-gray-500 rounded-lg focus:outline-none"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 px-2 py-2 overflow-x-auto w-full scrollbar-hide">
                <button
                    key="Filter"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white whitespace-nowrap transition border border-gray-300 hover:bg-gray-100 flex-shrink-0"
                >
                    <IoMdOptions />
                    Filter
                </button>
                {filterOptions.map((filter) => (
                    <button
                        key={filter.label}
                        onClick={() => handleApplyFilter(filter.value)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition border border-gray-300 flex-shrink-0
                        ${selectedFilter === filter.value ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-100"}`}
                    >
                        {filter.icon}
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Recommended Section */}
            {Object.entries(taggedFoods).map(([tag, items], sectionIndex) => {
                const sectionKey = formatEnumString(tag);
                const filteredItems = items.filter(
                    item =>
                        (selectedFilter === null || item.foodType === selectedFilter) &&
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <Section
                        key={sectionKey}
                        title={`${sectionKey} (${filteredItems.length})`}
                        expanded={expanded[sectionKey] ?? sectionIndex === 0}
                        onToggle={() => toggleSection(sectionKey)}
                    >
                        {filteredItems.map((foodItem, idx) => (
                            <FoodCard
                                key={idx}
                                foodItem={foodItem}
                                cart={cart}
                                tableNumber={tableNumber}
                                setCart={setCart}
                                setToast={setToast}
                                setShowModal={setShowModal}
                                refreshOrders={refreshOrders}
                                customerId={customer.id}
                                ringBell={ringBell}
                                bellLoading={bellLoading}
                            />
                        ))}
                    </Section>
                );
            })}


            {/* Offer Zone */}
            {offer && <div className="relative bg-yellow-400 overflow-hidden">
                {/* Top Scallop */}
                <div className="w-full">
                    <svg viewBox="0 10 100 10" preserveAspectRatio="none" className="w-full h-6">
                        <path
                            d="M0 18 Q2.5 0 5 10 T10 10 T15 10 T20 10 T25 10 T30 10 T35 10 T40 10 T45 10 T50 10 T55 10 T60 10 T65 10 T70 10 T75 10 T80 10 T85 10 T90 10 T95 10 T100 10 V10 H0 Z"
                            fill="white"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4 pb-8 pt-6">
                    <h2 className="font-semibold text-lg mb-2">Offer Zone</h2>
                    <div className="bg-white rounded-2xl p-3 relative">
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            50% OFF
                        </div>
                    </div>
                </div>

                {/* Bottom Scallop */}
                <div className="w-full rotate-180">
                    <svg viewBox="0 10 100 10" preserveAspectRatio="none" className="w-full h-6">
                        <path
                            d="M0 18 Q2.5 0 5 10 T10 10 T15 10 T20 10 T25 10 T30 10 T35 10 T40 10 T45 10 T50 10 T55 10 T60 10 T65 10 T70 10 T75 10 T80 10 T85 10 T90 10 T95 10 T100 10 V10 H0 Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </div>}

            {/* Our Services Section */}
            <div className="bg-yellow-400 rounded-t-3xl px-4 py-6 pb-20 mt-4">
                <h2 className="text-xl font-semibold mb-3">Our Services</h2>
                <img
                    src="https://th.bing.com/th/id/OIP.QPyjSw0DNXek-raegYayhwHaE6?rs=1&pid=ImgDetMain"
                    alt="Catering"
                    className="w-full h-40 object-cover rounded-xl rounded-b-none"
                />
                <div className="bg-white p-4 rounded-xl rounded-t-none text-sm space-y-2">
                    <h3 className="font-bold text-xl">We Do Catering Services</h3>
                    <p>Prepare a Tempting Table with Delicious Dishes from Our Catering Service!</p>
                    <ul className="list-disc ml-5 space-y-1 font-semibold">
                        <li>Weddings & Engagements Celebrations</li>
                        <li>Birthday Parties & Social Gatherings</li>
                        <li>Buffet & Plated Service Options</li>
                        <li>Corporate Events & Conferences</li>
                        <li>Private Dinners & Special Occasions</li>
                        <li>Custom Menus for All Dietary Needs</li>
                    </ul>
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="w-full bg-black text-white text-base py-3 rounded-lg mt-3"
                    >
                        Book Our Catering Services
                    </button>
                </div>
            </div>

            {/*Place Order*/}
            <footer className="flex items-center justify-between relative">
                {cart?.items?.length > 0 ? <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-between w-[90%] max-w-md bg-black p-4 md:p-5 lg:p-6 rounded-xl z-10"
                >
                    <span className="text-md text-white">{cart.items.reduce((sum, item) => sum + item.quantity, 0)} Items Added</span>
                    <div
                        className="flex items-center justify-end gap-2 text-white cursor-pointer rounded-xl text-sm font-medium transition-all">
                        <span>Place Order</span>
                        <IoChevronForward className="text-xl"/>
                    </div>
                </button> : orders?.length > 0 && <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-between w-[90%] max-w-md bg-black p-4 md:p-5 lg:p-6 rounded-xl z-10"
                >
                    <span className="text-md text-white">{orders.length} Orders placed</span>
                    <div
                        className="flex items-center justify-end gap-2 text-white cursor-pointer rounded-xl text-sm font-medium transition-all">
                        <span>View Orders</span>
                        <IoChevronForward className="text-xl"/>
                    </div>
                </button>}

                <div className="relative">
                    <button
                        onClick={ringBell}
                        disabled={bellLoading}
                        className="fixed bottom-30 right-6 w-18 h-18 rounded-full bg-black border-[6px]
                        border-gray-300 flex flex-col items-center justify-center text-yellow-400 z-10"
                    >
                        {bellLoading ? (
                            <div className="flex space-x-1 mt-1">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></span>
                            </div>
                        ) : (
                            <MdRoomService className="text-2xl mb-0.5" />
                        )}
                        <span className="text-xs font-medium">{bellLoading ? "Ringing" : "Ring"}</span>
                    </button>
                </div>


            </footer>

            <ContactModal
                open={showContactModal}
                onClose={() => setShowContactModal(false)}
                restaurantId={restaurantId}
                setToast={setToast}
            />

            <PlacingOrderModal
                cart={cart}
                setCart={setCart}
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                tableNumber={tableNumber}
                setShowModal={setShowModal}
                refreshOrders={refreshOrders}
                setToast={setToast}
                customerId={customer?.id}
                ringBell={ringBell}
                bellLoading={bellLoading}
            />
            <OrderPlacedModal
                open={showModal}
                ringBell={ringBell}
                loading={loading}
                bellLoading={bellLoading}
                handleClose={() => setShowModal(false)}
                orders={orders}
            />
        </div>
    );
};

const Section = ({ title, expanded, onToggle, children }) => (
    <div className="px-4 py-2">
        <div
            onClick={onToggle}
            className="flex justify-between items-center cursor-pointer"
        >
            <h3 className="font-semibold text-base">{title}</h3>
            <span className="text-xl">{expanded ? <MdOutlineExpandLess/> : <MdOutlineExpandMore/>}</span>
        </div>
        {expanded && <div className="space-y-3 mt-2">{children}</div>}
    </div>
);

const FoodCard = ({ foodItem, cart, setCart, tableNumber, refreshOrders, setShowModal, setToast, customerId, ringBell, bellLoading }) => {
    const [open, setOpen] = useState(false);
    const content = (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1">
                <div className="text-base font-semibold text-wrap w-2/3">
                    <img className="w-5 h-5" src={`${foodItem.veg === true ? Veg : nonVeg}`} alt={foodItem.veg === true ? "Veg" : "nonVeg"}/>
                    {foodItem.name}
                </div>
                <p className="text-xs text-gray-600">{foodItem.description}</p>
                <div className="mt-1 text-sm">
                    <span className="line-through text-gray-400 mr-2">₹{foodItem.menuPrice}</span>
                    <span className="text-green-600 font-bold">₹{foodItem.offerPrice}</span>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <img
                    src={foodItem.imageUrl}
                    alt={foodItem.name}
                    className="w-30 h-30 object-cover rounded-xl"
                />
                <div className="relative flex items-center justify-center w-full">
                    <button
                        onClick={() => setOpen(true)}
                        className="text-green-600 font-sans border-3 bottom-0 bg-white border-green-600 text-sm px-4 py-1 rounded-xl font-extrabold absolute z-5"
                    >
                        + ADD
                    </button>
                </div>
            </div>
            <FoodItemModal
                food={foodItem}
                open={open}
                cart={cart}
                setCart={setCart}
                tableNumber={tableNumber}
                handleClose={() => setOpen(false)}
                refreshOrders={refreshOrders}
                setShowModal={setShowModal}
                setToast={setToast}
                customerId={customerId}
                ringBell={ringBell}
                bellLoading={bellLoading}
            />
        </div>
    );

    return (
        <div className="border-b border-gray-400 p-3 last:border-b-0">{content}</div>
    );

};

export default Food;
