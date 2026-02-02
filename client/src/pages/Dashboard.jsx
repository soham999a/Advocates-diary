import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, API_URL } from '../firebase';
import {
    Briefcase,
    Calendar as CalendarIcon,
    AlertCircle,
    Users,
    Plus,
    FileText,
    Upload,
    TrendingUp,
    UserPlus,
    Clock
} from 'lucide-react';
import axios from 'axios';
import AddCaseModal from '../components/AddCaseModal';
import AddClientModal from '../components/AddClientModal';
import AddHearingModal from '../components/AddHearingModal';
import AddDocumentModal from '../components/AddDocumentModal';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalCases: 0,
        upcomingHearings: 0,
        overdueTasks: 0,
        activeClients: 0
    });
    const [todayHearings, setTodayHearings] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isHearingModalOpen, setIsHearingModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        if (!currentUser) return;
        try {
            const token = await currentUser.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch stats
            const statsRes = await axios.get(`${API_URL}/api/dashboard/stats`, { headers });
            setStats(statsRes.data);

            // Fetch today's hearings
            const hearingsRes = await axios.get(`${API_URL}/api/hearings/today`, { headers });
            setTodayHearings(hearingsRes.data);

            // Fetch recent activity
            const activityRes = await axios.get(`${API_URL}/api/dashboard/activity`, { headers });
            setRecentActivity(activityRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // On error, we still want to stop loading to show any available UI
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, trend }) => (
        <div className="glass-card p-6 rounded-2xl hover:translate-y-[-4px] transition-all duration-500 group relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute - right - 4 - bottom - 4 w - 24 h - 24 rounded - full blur - [40px] opacity - 20 ${color} `}></div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1.5 mt-3">
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-[10px] font-bold">{trend}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`p - 4 rounded - 2xl shadow - lg border - 2 border - white / 50 ${color} `}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 py-4">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em] mb-1 md:mb-2">Workspace Overview</p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        Greetings, {currentUser?.displayName?.split(' ')[0] || 'Counsel'}
                    </h1>
                </div>
                <div className="flex sm:block">
                    <button className="btn-secondary flex-1 sm:flex-none py-2 px-3 text-sm">
                        <CalendarIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">Today: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                <StatCard
                    icon={Briefcase}
                    title="Active Portfolio"
                    value={stats?.totalCases || 0}
                    color="bg-primary-600"
                    trend="+3 new"
                />
                <StatCard
                    icon={CalendarIcon}
                    title="Scheduled Hearings"
                    value={stats?.upcomingHearings || 0}
                    color="bg-emerald-600"
                />
                <StatCard
                    icon={AlertCircle}
                    title="Critical Tasks"
                    value={stats?.overdueTasks || 0}
                    color="bg-rose-600"
                />
                <StatCard
                    icon={Users}
                    title="Client Base"
                    value={stats?.activeClients || 0}
                    color="bg-amber-600"
                />
            </div>

            {/* Quick Actions */}
            <div className="card border-none bg-accent-900 !p-8 relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] -mr-32 -mt-32"></div>

                <h2 className="text-lg font-bold text-gray-900 mb-6 relative z-10">Command Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    <button
                        onClick={() => setIsCaseModalOpen(true)}
                        className="flex flex-col gap-4 p-6 bg-white border border-gray-100 rounded-2xl hover:border-primary-500 hover:shadow-2xl transition-all group/btn text-left"
                    >
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover/btn:bg-primary-600 transition-colors">
                            <Plus className="w-6 h-6 text-primary-600 group-hover/btn:text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">New Case</p>
                            <p className="text-xs text-gray-400 mt-1">Register legal record</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsClientModalOpen(true)}
                        className="flex flex-col gap-4 p-6 bg-white border border-gray-100 rounded-2xl hover:border-amber-500 hover:shadow-2xl transition-all group/btn text-left"
                    >
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover/btn:bg-amber-600 transition-colors">
                            <UserPlus className="w-6 h-6 text-amber-600 group-hover/btn:text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Add Client</p>
                            <p className="text-xs text-gray-400 mt-1">Client onboarding</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsHearingModalOpen(true)}
                        className="flex flex-col gap-4 p-6 bg-white border border-gray-100 rounded-2xl hover:border-emerald-500 hover:shadow-2xl transition-all group/btn text-left"
                    >
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover/btn:bg-emerald-600 transition-colors">
                            <CalendarIcon className="w-6 h-6 text-emerald-600 group-hover/btn:text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Schedule</p>
                            <p className="text-xs text-gray-400 mt-1">Add legal hearing</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsDocumentModalOpen(true)}
                        className="flex flex-col gap-4 p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-500 hover:shadow-2xl transition-all group/btn text-left"
                    >
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover/btn:bg-indigo-600 transition-colors">
                            <Upload className="w-6 h-6 text-indigo-600 group-hover/btn:text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Upload</p>
                            <p className="text-xs text-gray-400 mt-1">Central case files</p>
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 glass-card !p-4 md:!p-8">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div>
                            <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Today's Schedule</h3>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Court Room Assignments</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {(!Array.isArray(todayHearings) || todayHearings.length === 0) ? (
                            <div className="text-center py-12 md:py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-gray-200" />
                                </div>
                                <p className="text-gray-400 font-bold text-sm">No scheduled hearings for today</p>
                                <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-2">Clear Docket</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {todayHearings.map((hearing) => (
                                    <div
                                        key={hearing.id}
                                        className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex flex-col items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                                <span className="text-[10px] font-black uppercase tracking-tighter">AM</span>
                                                <span className="text-lg font-black leading-none">{hearing.hearing_date ? new Date(hearing.hearing_date).getHours() : '--'}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-0.5 truncate">{hearing.case_number || 'N/A'}</p>
                                                <h4 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight truncate">
                                                    {hearing.cases?.case_title || hearing.case_title || 'Untitled Case'}
                                                </h4>
                                                <p className="text-[10px] text-gray-400 font-medium mt-1 truncate">{hearing.court || 'Court Room TBA'} • Bench 4</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                                            <span className="status-pill status-pending text-[10px] px-2 py-0.5">{hearing.hearing_type || 'Regular'}</span>
                                            <button className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <Briefcase className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
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
                        {(!Array.isArray(recentActivity) || recentActivity.length === 0) ? (
                            <p className="text-gray-400 text-xs font-bold text-center py-4 italic">Synchronizing stream...</p>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 relative z-10 transition-transform hover:translate-x-1 cursor-default">
                                    <div className={`w - [22px] h - [22px] rounded - full shrink - 0 border - 4 border - white shadow - sm ${activity?.iconColor?.replace('bg-', 'bg-') || 'bg-gray-400'} `}></div>
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
