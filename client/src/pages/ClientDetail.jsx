import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, API_URL } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, DollarSign, FileText } from 'lucide-react';
import axios from 'axios';

const ClientDetail = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientDetails();
    }, [id]);

    const fetchClientDetails = async () => {
        if (!currentUser) return;
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL}/api/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClient(response.data);
        } catch (error) {
            console.error('Error fetching client details:', error);
            // Demo data
            setClient({
                id: id,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 9876543210',
                address: '123 Main Street, Delhi, India',
                cases: [
                    { id: '1', case_number: 'CRL/123/2024', status: 'Pending' },
                    { id: '2', case_number: 'CIV/456/2024', status: 'Urgent' }
                ],
                invoices: [
                    { id: '1', amount: 50000, status: 'Pending', due_date: '2024-02-28' },
                    { id: '2', amount: 30000, status: 'Paid', paid_date: '2024-01-15' }
                ],
                outstanding_fees: 50000
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading client details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/clients')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                    <p className="text-gray-600 mt-1">Client Details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold text-primary-600">
                                {client.name.charAt(0)}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{client.name}</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{client.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{client.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="text-sm font-medium text-gray-900">{client.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Outstanding Fees */}
                    <div className="card bg-red-50 border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-gray-900">Outstanding Fees</h3>
                        </div>
                        <p className="text-3xl font-bold text-red-600">
                            ₹{client.outstanding_fees.toLocaleString('en-IN')}
                        </p>
                        <button className="btn-primary w-full mt-4">Record Payment</button>
                    </div>
                </div>

                {/* Cases & Invoices */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Associated Cases */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary-600" />
                                <h3 className="font-semibold text-gray-900">Associated Cases</h3>
                            </div>
                            <span className="text-sm text-gray-500">{Array.isArray(client?.cases) ? client.cases.length : 0} case(s)</span>
                        </div>

                        <div className="space-y-3">
                            {Array.isArray(client?.cases) && client.cases.map((caseItem) => (
                                <div
                                    key={caseItem.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/cases/${caseItem.id}`)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{caseItem.case_number}</p>
                                        <span className={`status-pill ${caseItem.status === 'Pending' ? 'status-pending' : 'status-urgent'} mt-2`}>
                                            {caseItem.status}
                                        </span>
                                    </div>
                                    <button className="btn-secondary text-sm">View Case</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoices */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">Fees & Invoices</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Array.isArray(client?.invoices) && client.invoices.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">INV-{invoice.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                ₹{invoice.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`status-pill ${invoice.status === 'Paid' ? 'status-closed' : 'status-pending'}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {invoice.status === 'Paid'
                                                    ? new Date(invoice.paid_date).toLocaleDateString('en-IN')
                                                    : `Due: ${new Date(invoice.due_date).toLocaleDateString('en-IN')}`
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
                        <textarea
                            className="input-field resize-none"
                            rows="4"
                            placeholder="Add notes about this client..."
                        ></textarea>
                        <button className="btn-primary mt-3">Save Notes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;
