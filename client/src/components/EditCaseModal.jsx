import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../firebase';

const EditCaseModal = ({ isOpen, onClose, caseData, onCaseUpdated }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        case_number: '',
        case_title: '',
        court: '',
        judge: '',
        matter_type: '',
        status: ''
    });

    useEffect(() => {
        if (caseData) {
            setFormData({
                case_number: caseData.case_number || '',
                case_title: caseData.case_title || '',
                court: caseData.court || '',
                judge: caseData.judge || '',
                matter_type: caseData.matter_type || '',
                status: caseData.status || ''
            });
        }
    }, [caseData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            await axios.put(`${API_URL}/api/cases/${caseData.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onCaseUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating case:', error);
            alert('Failed to update case details.');
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
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Modify Case</h2>
                        <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-1">Record Edit</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Case Number *</label>
                            <input
                                name="case_number"
                                value={formData.case_number}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Disposed">Disposed</option>
                                <option value="Stayed">Stayed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Case Title *</label>
                        <input
                            name="case_title"
                            value={formData.case_title}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. State vs. John Doe"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Court</label>
                            <input
                                name="court"
                                value={formData.court}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Judge</label>
                            <input
                                name="judge"
                                value={formData.judge}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Matter Type</label>
                        <input
                            name="matter_type"
                            value={formData.matter_type}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. Criminal, Civil, Writ"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCaseModal;
