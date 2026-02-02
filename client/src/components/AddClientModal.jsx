import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { auth, API_URL } from '../firebase';
import { useAuth } from '../context/AuthContext';

const AddClientModal = ({ isOpen, onClose, onClientAdded }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            await axios.post(`${API_URL}/api/clients`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onClientAdded();
            onClose();
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Failed to create client. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Add New Client</h2>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">Onboard prospect</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Full Legal Name *
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Phone Number
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Correspondence Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 min-h-[100px] text-sm"
                            placeholder="Enter client address details..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full sm:w-auto order-1 sm:order-2"
                        >
                            {loading ? 'Processing...' : 'Register Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;
