import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Calendar, Briefcase, FileText, Check, Clock, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth, API_URL } from '../firebase';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    onClose();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        if (!currentUser) return;
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        if (!currentUser) return;
        try {
            const token = await currentUser.getIdToken();
            await axios.patch(`${API_URL}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            const token = await currentUser.getIdToken();
            await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'hearing': return <Calendar className="w-4 h-4 text-emerald-600" />;
            case 'case': return <Briefcase className="w-4 h-4 text-primary-600" />;
            case 'document': return <FileText className="w-4 h-4 text-amber-600" />;
            default: return <Bell className="w-4 h-4 text-gray-500" />;
        }
    };

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 transform origin-top-right"
        >
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-gray-900 tracking-tight">Updates</h3>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:text-primary-700 hover:underline"
                        >
                            Read All
                        </button>
                    )}
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scanning Stream...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                            <Bell className="w-6 h-6 text-gray-200" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 tracking-tight">Agenda is Secure</p>
                        <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest tracking-tighter">NO PENDING NOTIFICATIONS</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {Array.isArray(notifications) && notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 hover:bg-gray-50/80 transition-all cursor-pointer group relative ${!notif.is_read ? 'bg-primary-50/20' : ''}`}
                                onClick={() => {
                                    if (!notif.is_read) markAsRead(notif.id);
                                    if (notif.link) {
                                        navigate(notif.link);
                                        onClose();
                                    }
                                }}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white shadow-sm ${!notif.is_read ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className={`text-xs md:text-sm font-bold tracking-tight uppercase leading-tight truncate ${!notif.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {notif.title}
                                            </p>
                                            <div className="flex items-center gap-1 shrink-0 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                <Clock className="w-3 h-3" />
                                                {new Date(notif.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <p className={`text-[11px] md:text-xs leading-relaxed line-clamp-2 ${!notif.is_read ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                                            {notif.message}
                                        </p>
                                    </div>
                                    {!notif.is_read && (
                                        <div className="w-2 h-2 bg-primary-500 rounded-full absolute top-1/2 -translate-y-1/2 right-4 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-50 bg-gray-50/50 text-center">
                <button className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors">
                    Archives Control Center
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
