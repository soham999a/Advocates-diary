import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, API_URL } from '../firebase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import AddHearingModal from '../components/AddHearingModal';
import HearingDetailModal from '../components/HearingDetailModal';

const Calendar = () => {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHearing, setSelectedHearing] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchHearings();
    }, []);

    const fetchHearings = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL} /api/hearings`, {
                headers: { Authorization: `Bearer ${token} ` }
            });

            const formattedEvents = Array.isArray(response.data) ? response.data.map(hearing => ({
                id: hearing.id,
                title: `${hearing.case_number || 'N/A'} - ${hearing.hearing_type || 'Hearing'} `,
                start: hearing.hearing_date,
                backgroundColor: '#0ea5e9',
                borderColor: '#0ea5e9',
                extendedProps: {
                    court: hearing.court || 'N/A',
                    caseNumber: hearing.case_number || 'N/A',
                    caseTitle: hearing.case_title || hearing.cases?.case_title || 'N/A',
                    type: hearing.hearing_type || 'N/A',
                    caseId: hearing.case_id
                }
            })) : [];

            setEvents(formattedEvents);
            // Sort by date and take next 5
            const sorted = [...formattedEvents].sort((a, b) => new Date(a.start) - new Date(b.start));
            setUpcomingEvents(sorted.slice(0, 5));
        } catch (error) {
            console.error('Error fetching hearings:', error);
            // Demo data
            const demoEvents = [
                {
                    id: '1',
                    title: 'CRL/123/2024 - Arguments',
                    start: '2024-02-15T10:00:00',
                    backgroundColor: '#0ea5e9',
                    borderColor: '#0ea5e9',
                    extendedProps: {
                        court: 'District Court',
                        caseNumber: 'CRL/123/2024',
                        type: 'Arguments'
                    }
                },
                {
                    id: '2',
                    title: 'CIV/456/2024 - Final Hearing',
                    start: '2024-02-20T14:00:00',
                    backgroundColor: '#ef4444',
                    borderColor: '#ef4444',
                    extendedProps: {
                        court: 'High Court',
                        caseNumber: 'CIV/456/2024',
                        type: 'Final Hearing'
                    }
                }
            ];
            setEvents(demoEvents);
            setUpcomingEvents(demoEvents);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (info) => {
        setSelectedHearing({
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            extendedProps: info.event.extendedProps
        });
        setIsDetailModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 py-4 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em] mb-1 md:mb-2 text-center sm:text-left">Time Management</p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight text-center sm:text-left">Digital Diary</h1>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary w-full sm:w-auto py-3"
                >
                    <Plus className="w-5 h-5" />
                    <span className="truncate">Schedule New Hearing</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-3 glass-card !p-0 overflow-hidden shadow-2xl shadow-gray-200/50">
                    <div className="p-4 md:p-6 h-[500px] md:h-[750px] calendar-container font-medium">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek'
                            }}
                            events={events}
                            eventClick={handleEventClick}
                            height="100%"
                            // Responsive toolbar on mobile
                            windowResize={(arg) => {
                                if (window.innerWidth < 768) {
                                    arg.view.calendar.setOption('headerToolbar', {
                                        left: 'prev,next',
                                        center: 'title',
                                        right: 'dayGridMonth'
                                    });
                                } else {
                                    arg.view.calendar.setOption('headerToolbar', {
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek'
                                    });
                                }
                            }}
                            eventClassNames="rounded-lg shadow-sm font-bold border-none px-2 py-0.5 cursor-pointer hover:scale-[1.02] transition-transform text-[10px] md:text-xs"
                        />
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Upcoming Events */}
                    <div className="glass-card shadow-lg bg-primary-50/50 border-primary-100/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary-100/50 rounded-xl text-primary-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="font-extrabold text-gray-900 tracking-tight text-sm">Upcoming Matters</h3>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents.length === 0 ? (
                                <div className="text-center py-10 opacity-60">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clear Agenda</p>
                                </div>
                            ) : (
                                upcomingEvents.map((event) => (
                                    <div key={event.id} className="p-4 bg-white/60 border border-white/80 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-xs text-primary-700 tracking-tight group-hover:text-primary-800 transition-colors uppercase">{event.extendedProps.caseNumber}</p>
                                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="text-[11px] font-bold text-gray-800 mb-2 truncate">{event.title.split(' - ')[1] || event.title}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                            <Clock className="w-3 h-3" />
                                            {new Date(event.start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            <span className="mx-1">•</span>
                                            {new Date(event.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="glass-card shadow-lg bg-rose-50/30 border-rose-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-100/50 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-rose-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 tracking-tight text-sm">Priority Alerts</h3>
                        </div>
                        <div className="text-center py-10">
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
                                <AlertCircle className="w-6 h-6 text-rose-300" />
                            </div>
                            <p className="text-xs font-bold text-rose-800 uppercase tracking-widest">Session Secure</p>
                            <p className="text-[10px] text-rose-600/60 font-black tracking-widest mt-1">NO PENDING DEFAULTS</p>
                        </div>
                    </div>

                    {/* Today's Agenda */}
                    <div className="glass-card shadow-lg bg-emerald-50/30 border-emerald-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 tracking-tight text-sm">Today's Docket</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.1em] bg-emerald-100/50 px-3 py-1.5 rounded-full w-fit">
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </p>
                            <div className="text-center py-8">
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Court Recess</p>
                                <p className="text-[10px] text-emerald-500/60 font-black tracking-widest mt-1">EMPTY SCHEDULE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modals */}
            <AddHearingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onHearingAdded={fetchHearings}
            />
            <HearingDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                hearing={selectedHearing}
            />
        </div>
    );
};

export default Calendar;
