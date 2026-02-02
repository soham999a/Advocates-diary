import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../firebase';
import {
    Briefcase,
    Users,
    Calendar,
    Clock,
    ChevronRight,
    ArrowUpRight,
    Plus,
    ExternalLink,
    Calendar as CalendarIcon,
    AlertCircle,
    Search,
    CloudOff,
    FileText,
    Upload,
    TrendingUp,
    UserPlus
} from 'lucide-react';
import axios from 'axios';
import AddCaseModal from '../components/AddCaseModal';
import AddClientModal from '../components/AddClientModal';
import AddHearingModal from '../components/AddHearingModal';
import AddDocumentModal from '../components/AddDocumentModal';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [todayHearings, setTodayHearings] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isHearingModalOpen, setIsHearingModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchDashboardData();
        }
    }, [currentUser]);

    const fetchDashboardData = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch stats
            const statsRes = await axios.get(`${API_URL}/api/dashboard/stats`, { headers });
            setStats(statsRes.data);

            // Fetch today's hearings
            const hearingsRes = await axios.get(`${API_URL}/api/hearings/today`, { headers });
            setTodayHearings(Array.isArray(hearingsRes.data) ? hearingsRes.data : []);

            // Fetch recent activity
            const activityRes = await axios.get(`${API_URL}/api/dashboard/activity`, { headers });
            setRecentActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
        } catch (error) {
            console.error('🔥 Dashboard Fetch Failure:', error);
            if (error.response) {
                console.error('📦 Backend Error Data:', error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!stats && !loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border-2 border-dashed border-gray-100 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
                <CloudOff className="w-8 h-8 text-rose-500" />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900">Database Connection Failed</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                    The backend is responding with a 500 error. This usually means your Supabase environment variables are not correctly set up on Vercel.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary px-8"
                >
                    Retry Connection
                </button>
                <a
                    href={`${API_URL}/api/test-db/check`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary px-8 bg-black hover:bg-gray-800"
                >
                    Run Technical Diagnostic
                </a>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
            {/* Header with Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[
                    { label: 'Total Cases', value: stats?.totalCases || 0, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Upcoming', value: stats?.upcomingHearings || 0, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Clients', value: stats?.activeClients || 0, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card !p-4 md:!p-6 flex items-center gap-3 md:gap-5 group hover:translate-y-[-2px] transition-all duration-300">
                        <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                            <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h4 className="text-lg md:text-2xl font-black text-gray-900 mt-0.5">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                <button onClick={() => setIsCaseModalOpen(true)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 md:py-3 bg-primary-600 text-white rounded-xl font-bold text-xs md:text-sm hover:bg-primary-700 active:scale-[0.98] transition-all">
                    <Plus className="w-4 h-4" /> New Case
                </button>
                <button onClick={() => setIsHearingModalOpen(true)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 md:py-3 bg-white text-gray-900 border border-gray-100 rounded-xl font-bold text-xs md:text-sm hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm">
                    <CalendarIcon className="w-4 h-4 text-emerald-500" /> Schedule
                </button>
                <button onClick={() => setIsDocumentModalOpen(true)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 md:py-3 bg-white text-gray-900 border border-gray-100 rounded-xl font-bold text-xs md:text-sm hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-primary-500" /> Upload
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Today's Schedule</h3>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Court Calendar</p>
                        </div>
                        <button className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                            Full Diary <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(Array.isArray(todayHearings) && todayHearings.length > 0) ? (
                            <div className="grid grid-cols-1 gap-4">
                                {todayHearings.map((hearing) => (
                                    <div
                                        key={hearing.id}
                                        className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center group-hover:bg-primary-50 transition-colors">
                                                <span className="text-[10px] font-black text-gray-400 group-hover:text-primary-400 uppercase">{new Date(hearing.hearing_date).toLocaleDateString('en-IN', { month: 'short' })}</span>
                                                <span className="text-lg font-black text-gray-900 group-hover:text-primary-600 leading-none">{new Date(hearing.hearing_date).getDate()}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-black text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                                                    {hearing.cases?.case_number || 'Internal Review'}
                                                </h5>
                                                <p className="text-xs text-gray-500 truncate">{hearing.cases?.case_title || 'General Legal Consultation'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-6 pl-16 sm:pl-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Court</p>
                                                <p className="text-xs font-black text-gray-900">{hearing.court || 'HC-05'}</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>
                                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(hearing.hearing_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 md:py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <CalendarIcon className="w-8 h-8 text-gray-200" />
                                </div>
                                <p className="text-gray-400 font-bold text-sm">No scheduled hearings for today</p>
                                <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-2">Clear Docket</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card !p-6 md:!p-8">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div>
                            <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Filing Stream</h3>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time Updates</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                    </div>
                    <div className="space-y-6 md:space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {Array.isArray(recentActivity) && recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 relative z-10 transition-transform hover:translate-x-1 cursor-default">
                                    <div className={`w-[22px] h-[22px] rounded-full shrink-0 border-4 border-white shadow-sm ${activity.iconColor || 'bg-gray-400'}`}></div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] md:text-xs text-gray-900 font-bold tracking-tight uppercase leading-tight line-clamp-1">
                                            {activity.title}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-medium mt-0.5 md:mt-1 truncate max-w-[200px] sm:max-w-none">{activity.description}</p>
                                        <p className="text-[9px] text-primary-500 mt-1 md:mt-2 font-black uppercase tracking-widest bg-primary-50 w-fit px-2 py-0.5 rounded-full shrink-0">
                                            {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-xs font-bold text-center py-4 italic">Synchronizing stream...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddCaseModal
                isOpen={isCaseModalOpen}
                onClose={() => setIsCaseModalOpen(false)}
                onCaseAdded={fetchDashboardData}
            />
            <AddClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onClientAdded={fetchDashboardData}
            />
            <AddHearingModal
                isOpen={isHearingModalOpen}
                onClose={() => setIsHearingModalOpen(false)}
                onHearingAdded={fetchDashboardData}
            />
            <AddDocumentModal
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                onDocumentAdded={fetchDashboardData}
            />
        </div>
    );
};

export default Dashboard;
