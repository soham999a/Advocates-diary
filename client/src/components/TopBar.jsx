import { Search, Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, API_URL } from '../firebase';
import axios from 'axios';
import NotificationDropdown from './NotificationDropdown';

const TopBar = ({ onSearchClick, onMenuClick }) => {
    const { currentUser, userProfile, signOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            fetchUnreadCount();
            // Refresh count every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const fetchUnreadCount = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL}/api/notifications/unread`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const unread = Array.isArray(response.data) ? response.data.filter(n => !n.is_read).length : 0;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleKeyPress = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            onSearchClick();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Mobile Menu & Search */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <button
                        onClick={onSearchClick}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-200 transition-all text-gray-400 group max-w-[40px] md:max-w-none overflow-hidden"
                    >
                        <Search className="w-4 h-4 group-hover:text-primary-600 transition-colors shrink-0" />
                        <span className="text-sm font-medium hidden md:block whitespace-nowrap">Search Command Center</span>
                        <kbd className="ml-4 md:ml-8 px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 shadow-sm hidden md:block">
                            Ctrl + K
                        </kbd>
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                            <Bell className={`w-5 h-5 transition-colors ${notifOpen ? 'text-primary-600' : 'text-gray-600'}`} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>
                        <NotificationDropdown
                            isOpen={notifOpen}
                            onClose={() => setNotifOpen(false)}
                        />
                    </div>

                    {/* User Menu */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 md:gap-3 pl-1 pr-1 md:pr-3 py-1 bg-gray-50 rounded-full border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300"
                        >
                            {currentUser?.photoURL || userProfile?.photo_url ? (
                                <img
                                    src={currentUser?.photoURL || userProfile?.photo_url}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className="text-left py-1 hidden sm:block">
                                <p className="text-[10px] md:text-[11px] font-bold text-gray-900 uppercase tracking-wider truncate max-w-[80px] md:max-w-none">
                                    {currentUser?.displayName || 'User'}
                                </p>
                                <p className="text-[8px] md:text-[10px] text-gray-400 font-medium truncate">
                                    {userProfile?.bar_council_number || 'Senior Advocate'}
                                </p>
                            </div>
                        </button>

                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 transform origin-top-right">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
