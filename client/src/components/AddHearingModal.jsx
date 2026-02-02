import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { auth, API_URL } from '../firebase';

const AddHearingModal = ({ isOpen, onClose, onHearingAdded, initialCaseId }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [formData, setFormData] = useState({
        case_id: initialCaseId || '',
        hearing_date: '',
        hearing_type: 'Regular',
        court: '',
        notes: ''
    });

    useEffect(() => {
        if (initialCaseId) {
            setFormData(prev => ({ ...prev, case_id: initialCaseId }));
        }
    }, [initialCaseId]);

    useEffect(() => {
        if (isOpen) {
            fetchCases();
        }
    }, [isOpen]);

    const fetchCases = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL}/api/cases`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCases(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching cases:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            await axios.post(`${API_URL}/api/hearings`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onHearingAdded();
            onClose();
        } catch (error) {
            console.error('Error creating hearing:', error);
            alert('Failed to schedule hearing. Please try again.');
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
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Schedule Hearing</h2>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Calendar entry</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Select Matter *
                        </label>
                        <select
                            name="case_id"
                            value={formData.case_id}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            required
                        >
                            <option value="">Select an active case</option>
                            {Array.isArray(cases) && cases.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.case_number} - {c.case_title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Date & Time *
                            </label>
                            <input
                                name="hearing_date"
                                type="datetime-local"
                                value={formData.hearing_date}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Hearing Type
                            </label>
                            <select
                                name="hearing_type"
                                value={formData.hearing_type}
                                onChange={handleChange}
                                className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            >
                                <option value="Regular">Regular</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Final Argument">Final Argument</option>
                                <option value="Evidence">Evidence</option>
                                <option value="Admission">Admission</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Jurisdiction / Bench / Room
                        </label>
                        <input
                            name="court"
                            value={formData.court}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. Court Room 5"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Briefing Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 min-h-[80px] text-sm"
                            placeholder="Optional directive for this hearing..."
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
                            disabled={loading || cases.length === 0}
                            className="btn-primary w-full sm:w-auto order-1 sm:order-2"
                        >
                            {loading ? 'Processing...' : 'Register Hearing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHearingModal;
