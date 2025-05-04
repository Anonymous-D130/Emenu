import React, { useCallback, useEffect, useState } from "react";
import QR from "../assets/qr-code.png";
import axios from "axios";
import {FETCH_QR, GENERATE_QR} from "../utils/config.js";
import {FaDownload} from "react-icons/fa6";
import { toPng } from "html-to-image";
import { useRef } from "react";

const GenerateQR = ({ setToast, logo, name }) => {
    const token = localStorage.getItem("token");
    const [tables, setTables] = useState("");
    const [qrPaths, setQrPaths] = useState([]);
    const [loading, setLoading] = useState(false);
    const qrRefs = useRef({});

    const fetchQR = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_QR, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQrPaths(response.data);
        } catch (error) {
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
            console.error("Error fetching QR codes: ", error);
        } finally {
            setLoading(false);
        }
    }, [setToast, token]);

    useEffect(() => {
        fetchQR().then(q => q);
    }, [fetchQR]);

    const handleQRGeneration = async () => {
        if (!tables || tables < 1) {
            setToast({ message: "Please enter a valid number of tables.", type: "warning" });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(GENERATE_QR(tables), {}, { headers: { Authorization: `Bearer ${token}` } });
            setToast({ message: response.data.message, type: "success" });
            await fetchQR();
        } catch (error) {
            console.error("Error while generating QR: ", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (idx) => {
        const cardElement = qrRefs.current[idx];
        if (!cardElement) return;
        const downloadButton = cardElement.querySelector("button");
        if (downloadButton) downloadButton.style.display = "none";
        try {
            const dataUrl = await toPng(cardElement, { pixelRatio: 3 });
            const link = document.createElement("a");
            link.download = `Table-${idx + 1}-QR.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Download failed:", error);
            setToast({
                message: error.response ? error.response.data.message : error.message,
                type: "error",
            });
        } finally {
            if (downloadButton) downloadButton.style.display = "block";
        }
    };


    return (
        <div className="flex flex-col gap-6 w-full px-4 py-6">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row items-start w-full gap-6">
                {/* QR Generator Form */}
                <div
                    className="flex flex-col gap-4 bg-white rounded-2xl p-5 shadow-lg border w-full max-w-md"
                >
                    <h2 className="text-2xl font-bold text-center md:text-left">Generate QR</h2>
                    <label className="block text-gray-700">
                        Number of Tables *
                        <input
                            type="number"
                            value={tables}
                            onChange={(e) => setTables(e.target.value)}
                            className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            min="1"
                        />
                    </label>
                    <button
                        className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-60"
                        onClick={handleQRGeneration}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "GENERATE"}
                    </button>
                </div>

                {/* QR Code Display */}
                <div className="w-full">
                    <h3 className="text-lg font-semibold mb-2 text-center md:text-left">{qrPaths.length === 0 ? "Sample QR Code" : "Your QR Codes"}</h3>
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-48">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 justify-items-center gap-12">
                            {qrPaths.length === 0 ? (
                                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-xl border shadow-inner">
                                    <img
                                        src={`${QR}`}
                                        alt="Placeholder QR"
                                        className="w-20 h-20 object-contain opacity-60"
                                    />
                                </div>
                            ) : (
                                qrPaths.map((qr, idx) => (
                                    <div
                                        key={idx}
                                        ref={(el) => {if (el) qrRefs.current[idx] = el; else delete qrRefs.current[idx];}}
                                        className="relative bg-white rounded-2xl shadow-lg border overflow-hidden w-40 flex flex-col items-center"
                                    >
                                        {/* Top Label */}
                                        <div className="bg-purple-600 text-white font-semibold w-fit text-center py-1 px-2 rounded-b-2xl">
                                            Table : {idx + 1}
                                        </div>

                                        {/* QR Code */}
                                        <div className="p-4">
                                            <img src={qr} alt={`QR Table ${idx + 1}`} className="w-24 h-24 object-contain" />
                                        </div>

                                        {/* Branding Section */}
                                        <div className="bg-purple-600 w-full p-2 flex items-center justify-center rounded-b-2xl gap-2">
                                            <img src={`${logo}`} alt="Brand Logo" className="h-10 mb-1 rounded-xl" />
                                            <p className="text-xs font-bold text-center leading-tight text-white text-wrap">
                                                {name}
                                            </p>
                                        </div>

                                        <button
                                            className="absolute bottom-14 right-2 bg-green-600 hover:bg-red-800 text-white rounded-full p-2 shadow-md"
                                            onClick={() => handleDownload(idx)}
                                        >
                                            <FaDownload size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateQR;