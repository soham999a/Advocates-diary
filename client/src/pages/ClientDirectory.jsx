import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../firebase';
import { Search, Plus, Eye, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import AddClientModal from '../components/AddClientModal';

const ClientDirectory = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL} /api/clients`, {
                headers: { Authorization: `Bearer ${token} ` }
            });
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            // Demo data
            setClients([
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+91 9876543210',
                    cases_count: 3,
                    outstanding_fees: 50000,
                    last_contact: '2024-02-01'
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '+91 9876543211',
                    cases_count: 1,
                    outstanding_fees: 0,
                    last_contact: '2024-01-28'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = Array.isArray(clients) ? clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)
    ) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading clients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">Client Directory</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage your client relationships and contact data</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary w-full sm:w-auto py-3"
                >
                    <Plus className="w-5 h-5" />
                    <span className="truncate">Add New Client</span>
                </button>
            </div>

            {/* Search */}
            <div className="glass-card !p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email..."
                        className="input-field pl-10 bg-white/50 text-sm"
                    />
                </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredClients.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No clients found. Click "Add New Client" to get started.</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <div key={client.id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary-600">
                                            {client.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                                        <p className="text-sm text-gray-500">{client.cases_count} case(s)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{client.phone}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600">Outstanding Fees</span>
                                    <span className={`font - semibold ${client.outstanding_fees > 0 ? 'text-red-600' : 'text-green-600'} `}>
                                        ₹{client.outstanding_fees.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/ clients / ${client.id} `)}
                                    className="w-full btn-secondary flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Modal */}
            <AddClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClientAdded={fetchClients}
            />
        </div>
    );
};

export default ClientDirectory;
