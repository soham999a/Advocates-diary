import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    Users,
    FileText,
    Scale,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Cases', path: '/cases', icon: Briefcase },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
        { name: 'Clients', path: '/clients', icon: Users },
        { name: 'E-Filing', path: '/e-filing', icon: FileText },
    ];

    return (
        <div className={`
            fixed inset-y-0 left-0 w-64 bg-[#0a192f] text-white flex flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Logo & Close Button */}
            <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3 group px-2">
                    <div className="p-2 bg-primary-600/20 rounded-xl group-hover:bg-primary-600/30 transition-all">
                        <Scale className="w-8 h-8 text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Diary Pro</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary-400/80 font-bold">Advocate Suite</p>
                    </div>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-900/40'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-medium">
                        Secured by Enterprise Shield
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
