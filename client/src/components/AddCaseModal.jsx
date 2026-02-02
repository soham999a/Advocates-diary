import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../firebase';

const AddCaseModal = ({ isOpen, onClose, onCaseAdded }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        case_number: '',
        case_title: '',
        client_id: '',
        court: '',
        judge: '',
        matter_type: '',
        status: 'Pending',
        filing_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            fetchClients();
        }
    }, [isOpen]);

    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
        const token = await currentUser.getIdToken();
        await axios.post(`${API_URL}/api/cases`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        onCaseAdded();
        onClose();
    } catch (error) {
        console.error('Error creating case:', error);
        alert('Failed to create case. Please try again.');
    } finally {
        setLoading(false);
    }
};

if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Add New Case</h2>
                    <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-1">Initialize record</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Case Number *
                        </label>
                        <input
                            name="case_number"
                            value={formData.case_number}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. CRL/123/2024"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Case Title
                        </label>
                        <input
                            name="case_title"
                            value={formData.case_title}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. State vs. John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        Associate Client *
                    </label>
                    <select
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        className="input-field bg-gray-50/50 border-gray-100 text-sm"
                        required
                    >
                        <option value="">Select a client</option>
                        {Array.isArray(clients) && clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                    {clients.length === 0 && (
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter mt-1.5 flex items-center gap-1">
                            <Plus className="w-3 h-3" />
                            No clients found. Please add a client first.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Court Jurisdiction
                        </label>
                        <input
                            name="court"
                            value={formData.court}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. Supreme Court"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Filing Date *
                        </label>
                        <input
                            name="filing_date"
                            type="date"
                            value={formData.filing_date}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Matter Type
                        </label>
                        <input
                            name="matter_type"
                            value={formData.matter_type}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. Criminal, Civil"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Priority Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
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
                        disabled={loading || clients.length === 0}
                        className="btn-primary w-full sm:w-auto order-1 sm:order-2"
                    >
                        {loading ? 'Processing...' : 'Register Case'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default AddCaseModal;
