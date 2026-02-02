import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../firebase';
import { Search, X, Briefcase, Users, Calendar, FileText, Clock } from 'lucide-react';
import Fuse from 'fuse.js';
import axios from 'axios';

const GlobalSearch = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allData, setAllData] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchSearchData();
            inputRef.current?.focus();
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    const fetchSearchData = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all searchable data
            const [casesRes, clientsRes, hearingsRes] = await Promise.all([
                axios.get(`${API_URL}/api/cases`, { headers }),
                axios.get(`${API_URL}/api/clients`, { headers }),
                axios.get(`${API_URL}/api/hearings`, { headers })
            ]);

            const combinedData = [
                ...(Array.isArray(casesRes.data) ? casesRes.data.map(c => ({ ...c, type: 'case' })) : []),
                ...(Array.isArray(clientsRes.data) ? clientsRes.data.map(c => ({ ...c, type: 'client' })) : []),
                ...(Array.isArray(hearingsRes.data) ? hearingsRes.data.map(h => ({ ...h, type: 'hearing' })) : [])
            ];

            setAllData(combinedData);
        } catch (error) {
            console.error('Error fetching search data:', error);
            // Demo data
            setAllData([
                { id: '1', case_number: 'CRL/123/2024', case_title: 'State vs. Accused', type: 'case' },
                { id: '2', case_number: 'CIV/456/2024', case_title: 'Plaintiff vs. Defendant', type: 'case' },
                { id: '1', name: 'John Doe', email: 'john@example.com', type: 'client' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', type: 'client' },
                { id: '1', case_number: 'CRL/123/2024', hearing_type: 'Arguments', hearing_date: '2024-02-15', type: 'hearing' }
            ]);
        }
    };

    useEffect(() => {
        if (query.length > 0) {
            const fuse = new Fuse(allData, {
                keys: ['case_number', 'case_title', 'name', 'email', 'hearing_type', 'court'],
                threshold: 0.3
            });

            const searchResults = fuse.search(query).map(result => result.item);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    }, [query, allData]);

    const handleResultClick = (result) => {
        if (result.type === 'case') {
            navigate(`/ cases / ${result.id} `);
        } else if (result.type === 'client') {
            navigate(`/ clients / ${result.id} `);
        } else if (result.type === 'hearing') {
            navigate('/calendar');
        }
        onClose();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'case':
                return <Briefcase className="w-5 h-5 text-blue-600" />;
            case 'client':
                return <Users className="w-5 h-5 text-green-600" />;
            case 'hearing':
                return <Calendar className="w-5 h-5 text-purple-600" />;
            default:
                return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    const getLabel = (type) => {
        switch (type) {
            case 'case':
                return 'Case';
            case 'client':
                return 'Client';
            case 'hearing':
                return 'Hearing';
            default:
                return 'Item';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center pt-10 md:pt-20 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                {/* Search Input */}
                <div className="p-4 md:p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Identify matter, client, or record..."
                            className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-sm md:text-base"
                        />
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {query.length === 0 ? (
                        <div className="p-8 text-center">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Start typing to search...</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Search across cases, clients, hearings, and documents
                            </p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No results found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {/* Group by type */}
                            {['case', 'client', 'hearing'].map(type => {
                                const typeResults = results.filter(r => r.type === type);
                                if (typeResults.length === 0) return null;

                                return (
                                    <div key={type} className="mb-4">
                                        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                            {getLabel(type)}s
                                        </p>
                                        {typeResults.map((result) => (
                                            <button
                                                key={`${result.type} -${result.id} `}
                                                onClick={() => handleResultClick(result)}
                                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                            >
                                                {getIcon(result.type)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {result.case_number || result.name || result.hearing_type}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {result.case_title || result.email || result.court}
                                                    </p>
                                                </div>
                                                {result.type === 'hearing' && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(result.hearing_date).toLocaleDateString('en-IN')}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-50 bg-gray-50/50 hidden md:block">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm text-gray-500">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm text-gray-500">Enter</kbd>
                                Select
                            </span>
                        </div>
                        <span className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm text-gray-500">Esc</kbd>
                            Dismiss
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
