import { X, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HearingDetailModal = ({ isOpen, onClose, hearing }) => {
    const navigate = useNavigate();

    if (!isOpen || !hearing) return null;

    const formattedDate = new Date(hearing.start).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = new Date(hearing.start).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const handleViewCase = () => {
        // FullCalendar events store extendedProps as a separate object
        // but our API response mapping in Calendar.jsx puts ID at top level
        const caseId = hearing.extendedProps?.caseId || hearing.id;
        navigate(`/cases/${caseId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-primary-600 px-5 md:px-6 py-4 flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-lg font-black tracking-tight">Hearing Details</h2>
                        <p className="text-[10px] text-primary-100 font-bold uppercase tracking-widest">Docket Information</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 space-y-5">
                    {/* Case Info Section */}
                    <div>
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Entity / Matter</p>
                            <h3 className="font-black text-gray-900 text-lg tracking-tight leading-tight">{hearing.extendedProps?.caseNumber || 'N/A'}</h3>
                            <p className="text-primary-600 text-xs font-bold mt-1 uppercase tracking-wide">{hearing.title.split(' - ')[1] || hearing.extendedProps?.type || 'Regular Hearing'}</p>
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 bg-blue-50/30 rounded-xl border border-blue-50/50">
                            <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                            <div>
                                <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">Session Date</p>
                                <p className="text-xs font-bold text-gray-900 mt-0.5">{formattedDate}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50/30 rounded-xl border border-purple-50/50">
                            <Clock className="w-5 h-5 text-purple-600 shrink-0" />
                            <div>
                                <p className="text-[10px] text-purple-600 uppercase font-bold tracking-widest">Listing Time</p>
                                <p className="text-xs font-bold text-gray-900 mt-0.5">{formattedTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/30 rounded-xl border border-emerald-50/50">
                        <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                            <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-widest">Venue / Bench</p>
                            <p className="text-xs font-bold text-gray-900 mt-0.5">
                                {hearing.extendedProps?.court || 'Not Specified'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-50">
                        <button
                            onClick={onClose}
                            className="btn-secondary w-full sm:flex-1 py-3 text-xs font-bold uppercase order-2 sm:order-1"
                        >
                            Dismiss
                        </button>
                        <button
                            onClick={handleViewCase}
                            className="btn-primary w-full sm:flex-[2] py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 order-1 sm:order-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Navigate to Case
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HearingDetailModal;
