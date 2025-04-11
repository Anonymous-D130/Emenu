import React, { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';
import ComingSoon from "./ComingSoon.jsx";

const OfferPage = () => {
    const [offers, setOffers] = useState([]);
    const [form, setForm] = useState({ title: '', tag: '', expiry: '' });
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateOrUpdate = (e) => {
        e.preventDefault();
        if (!form.title || !form.expiry) return alert("Title and Expiry Date are required");

        if (editIndex !== null) {
            const updated = [...offers];
            updated[editIndex] = form;
            setOffers(updated);
            setEditIndex(null);
        } else {
            setOffers([...offers, form]);
        }

        setForm({ title: '', tag: '', expiry: '' });
    };

    const handleEdit = (index) => {
        setForm(offers[index]);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        setOffers(offers.filter((_, i) => i !== index));
    };

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            <ComingSoon/>
            {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
            {/*    /!* Create Offer Form *!/*/}
            {/*    <div className="bg-white p-6 rounded-xl shadow-md">*/}
            {/*        <h3 className="text-2xl font-semibold mb-4">Create Offer</h3>*/}
            {/*        <form onSubmit={handleCreateOrUpdate}>*/}
            {/*            <div>*/}
            {/*                <label htmlFor="title" className="font-semibold py-2">Offer Title</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    name="title"*/}
            {/*                    placeholder="50% OFF"*/}
            {/*                    value={form.title}*/}
            {/*                    onChange={handleChange}*/}
            {/*                    className="w-full p-2 border mb-4 rounded-md"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label htmlFor="tag" className="font-semibold py-2">Tag</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    name="tag"*/}
            {/*                    placeholder="NEW"*/}
            {/*                    value={form.tag}*/}
            {/*                    onChange={handleChange}*/}
            {/*                    className="w-full p-2 border mb-4 rounded-md"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label htmlFor="expiry" className="font-semibold py-2">Expiry Date</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    name="expiry"*/}
            {/*                    placeholder="20 / 12 /2025"*/}
            {/*                    value={form.expiry}*/}
            {/*                    onChange={handleChange}*/}
            {/*                    className="w-full p-2 border mb-4 rounded-md"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <button*/}
            {/*                type="submit"*/}
            {/*                className="w-full bg-purple-600 text-white py-2 rounded-md font-bold hover:bg-purple-700 transition"*/}
            {/*            >*/}
            {/*                {editIndex !== null ? 'UPDATE' : 'CREATE'}*/}
            {/*            </button>*/}
            {/*        </form>*/}
            {/*    </div>*/}

            {/*    /!* Offer List *!/*/}
            {/*    <div className="md:col-span-2 space-y-4">*/}
            {/*        {offers.map((offer, index) => (*/}
            {/*            <div*/}
            {/*                key={index}*/}
            {/*                className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-md"*/}
            {/*            >*/}
            {/*                <div className="flex items-center gap-6 md:gap-15">*/}
            {/*                    <div className="text-purple-700 font-bold text-2xl leading-tight text-center">*/}
            {/*                        <div>{offer.title.split(' ')[0]}</div>*/}
            {/*                        <div>{offer.title.split(' ')[1]}</div>*/}
            {/*                        <div>*/}
            {/*                            {offer.title*/}
            {/*                                .split(' ')*/}
            {/*                                .slice(2)*/}
            {/*                                .join(' ')}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <p className="text-sm text-gray-600 font-semibold">Expiry Date</p>*/}
            {/*                        <p className="font-bold text-black">{offer.expiry}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <p className="text-xl font-bold text-gray-400">{offer.tag}</p>*/}
            {/*                </div>*/}

            {/*                <div className="flex gap-2">*/}
            {/*                    <button*/}
            {/*                        onClick={() => handleEdit(index)}*/}
            {/*                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"*/}
            {/*                    >*/}
            {/*                        <Pencil size={18} />*/}
            {/*                    </button>*/}
            {/*                    <button*/}
            {/*                        onClick={() => handleDelete(index)}*/}
            {/*                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"*/}
            {/*                    >*/}
            {/*                        <Trash size={18} />*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </main>
    );
}

export default OfferPage;