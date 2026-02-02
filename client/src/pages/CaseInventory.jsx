import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Plus, Eye, Briefcase } from 'lucide-react';
import axios from 'axios';
import AddCaseModal from '../components/AddCaseModal';

const CaseInventory = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cases`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
            // Use demo data if backend not ready
            setCases([
                {
                    id: '1',
                    case_number: 'CRL/123/2024',
                    case_title: 'State vs. Accused',
                    client_name: 'John Doe',
                    court: 'District Court',
                    next_hearing: '2024-02-15',
                    status: 'Pending'
                },
                {
                    id: '2',
                    case_number: 'CIV/456/2024',
                    case_title: 'Plaintiff vs. Defendant',
                    client_name: 'Jane Smith',
                    court: 'High Court',
                    next_hearing: '2024-02-20',
                    status: 'Urgent'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCases = Array.isArray(cases) ? cases.filter(c => {
        const matchesSearch =
            c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.court?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) : [];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'status-pill status-pending';
            case 'Closed':
                return 'status-pill status-closed';
            case 'Urgent':
                return 'status-pill status-urgent';
            default:
                return 'status-pill status-pending';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading cases...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1 md:mb-2 text-center sm:text-left">Portfolio Management</p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight text-center sm:text-left">Case Inventory</h1>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary w-full sm:w-auto py-3"
                >
                    <Plus className="w-5 h-5" />
                    <span className="truncate">Open New Case File</span>
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card !p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Identify by number, client..."
                            className="input-field pl-12 bg-white/50 text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field bg-white/50 !py-2 text-sm font-semibold text-gray-600 flex-1 lg:w-48"
                        >
                            <option value="All">All Jurisdictions</option>
                            <option value="Pending">Active / Pending</option>
                            <option value="Urgent">Critical Priority</option>
                            <option value="Closed">Archived / Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Cases Table */}
            <div className="glass-card !p-0 overflow-hidden border-none shadow-2xl shadow-gray-200/50">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[800px] lg:min-w-0">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Entity / Matter Title
                                </th>
                                <th className="px-4 md:px-6 py-4 md:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Client / Plaintiff
                                </th>
                                <th className="px-4 md:px-6 py-4 md:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Jurisdiction
                                </th>
                                <th className="px-4 md:px-6 py-4 md:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Filing Date
                                </th>
                                <th className="px-4 md:px-6 py-4 md:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-4 md:px-8 py-4 md:py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCases.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 md:px-8 py-12 md:py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">No active cases found</p>
                                                <p className="text-sm text-gray-500 mt-1">Initialize your first case file to begin</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCases.map((caseItem) => (
                                    <tr key={caseItem.id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-4 md:px-8 py-4 md:py-5">
                                            <div className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors text-sm md:text-base truncate max-w-[150px] md:max-w-none">{caseItem.case_number}</div>
                                            <div className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 truncate max-w-[150px] md:max-w-none">{caseItem.case_title}</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-5 text-sm font-semibold text-gray-700">
                                            <span className="truncate block max-w-[120px] md:max-w-none">{caseItem.client_name}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-5">
                                            <div className="text-sm font-medium text-gray-600 truncate max-w-[120px] md:max-w-none">{caseItem.court}</div>
                                            <div className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-tighter mt-0.5">District Court</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-medium text-gray-500">
                                            {caseItem.filing_date ? new Date(caseItem.filing_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(caseItem.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-5">
                                            <span className={`${getStatusClass(caseItem.status)} !font-black !py-1 !text-[10px] md:!text-xs transition-all group-hover:px-4`}>
                                                {caseItem.status}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                                            <button
                                                onClick={() => navigate(`/cases/${caseItem.id}`)}
                                                className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300 font-bold text-xs"
                                            >
                                                <Eye className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                                <span className="hidden sm:inline">Review Case</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {filteredCases.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {filteredCases.length} of {Array.isArray(cases) ? cases.length : 0} cases
                    </p>
                    <div className="flex gap-2">
                        <button className="btn-secondary text-sm">Previous</button>
                        <button className="btn-secondary text-sm">Next</button>
                    </div>
                </div>
            )}
            {/* Modal */}
            <AddCaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCaseAdded={fetchCases}
            />
        </div>
    );
};

export default CaseInventory;
