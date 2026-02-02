import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, API_URL } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Edit, FileText, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditCaseModal from '../components/EditCaseModal';
import AddHearingModal from '../components/AddHearingModal';
import AddDocumentModal from '../components/AddDocumentModal';

const CaseDetail = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isHearingModalOpen, setIsHearingModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    useEffect(() => {
        fetchCaseDetails();
    }, [id]);

    const fetchCaseDetails = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL} /api/cases / ${id} `, {
                headers: { Authorization: `Bearer ${token} ` }
            });
            setCaseData(response.data);
        } catch (error) {
            console.error('Error fetching case details:', error);
            // Demo data
            setCaseData({
                id: id,
                case_number: 'CRL/123/2024',
                case_title: 'State vs. Accused',
                client_name: 'John Doe',
                court: 'District Court, Delhi',
                judge: 'Hon. Justice Sharma',
                matter_type: 'Criminal',
                status: 'Pending',
                created_at: '2024-01-15',
                timeline: [
                    { date: '2024-01-15', type: 'Filing', description: 'Case filed', user: 'Adv. Kumar' },
                    { date: '2024-01-20', type: 'Hearing', description: 'First hearing', user: 'System' },
                    { date: '2024-02-01', type: 'Order', description: 'Court order received', user: 'Adv. Kumar' }
                ],
                hearings: [
                    { id: 1, date: '2024-02-15', time: '10:00 AM', type: 'Arguments', court: 'District Court' }
                ],
                documents: [
                    { id: 1, name: 'Petition.pdf', type: 'Petition', uploaded_at: '2024-01-15' }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'details', label: 'Details', icon: FileText },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'hearings', label: 'Hearings', icon: CalendarIcon },
        { id: 'documents', label: 'Documents', icon: FileText }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading case details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/cases')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{caseData.case_number}</h1>
                        <p className="text-gray-600 mt-1">{caseData.case_title}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Edit className="w-5 h-5" />
                    Edit Case
                </button>
            </div>

            {/* Case Summary Card */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Client</p>
                        <p className="font-medium text-gray-900">{caseData.client_name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Court</p>
                        <p className="font-medium text-gray-900">{caseData.court}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Judge</p>
                        <p className="font-medium text-gray-900">{caseData.judge}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Matter Type</p>
                        <p className="font-medium text-gray-900">{caseData.matter_type}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items - center gap - 2 pb - 4 border - b - 2 transition - colors ${activeTab === tab.id
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                } `}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="card">
                {activeTab === 'details' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Case Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Case Number</p>
                                <p className="font-medium text-gray-900">{caseData.case_number}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <span className="status-pill status-pending">{caseData.status}</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Filed On</p>
                                <p className="font-medium text-gray-900">
                                    {caseData.filing_date
                                        ? new Date(caseData.filing_date).toLocaleDateString('en-IN')
                                        : new Date(caseData.created_at).toLocaleDateString('en-IN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Matter Type</p>
                                <p className="font-medium text-gray-900">{caseData.matter_type}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Case Timeline</h3>
                        <div className="relative">
                            {Array.isArray(caseData?.timeline) && caseData.timeline.map((event, index) => (
                                <div key={index} className="flex gap-4 pb-8 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                                        {index < caseData.timeline.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-gray-900">{event.type}</span>
                                            <span className="text-sm text-gray-500">{event.date ? new Date(event.date).toLocaleDateString('en-IN') : 'N/A'}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">By {event.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'hearings' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Hearings</h3>
                            <button
                                onClick={() => setIsHearingModalOpen(true)}
                                className="btn-primary text-sm"
                            >
                                Add Hearing
                            </button>
                        </div>
                        <div className="space-y-3">
                            {Array.isArray(caseData?.hearings) && caseData.hearings.map((hearing) => (
                                <div key={hearing.id} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{hearing.type}</p>
                                            <p className="text-sm text-gray-600">{hearing.court}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-primary-600">{hearing.date ? new Date(hearing.date).toLocaleDateString('en-IN') : 'N/A'}</p>
                                            <p className="text-sm text-gray-600">{hearing.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                            <button
                                onClick={() => setIsDocumentModalOpen(true)}
                                className="btn-primary text-sm"
                            >
                                Upload Document
                            </button>
                        </div>
                        <div className="space-y-3">
                            {Array.isArray(caseData?.documents) && caseData.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-red-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.filename || doc.name || 'Untitled Document'}</p>
                                            <p className="text-sm text-gray-600">{doc.file_type || doc.type}</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary text-sm">Download</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <EditCaseModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                caseData={caseData}
                onCaseUpdated={fetchCaseDetails}
            />

            <AddHearingModal
                isOpen={isHearingModalOpen}
                onClose={() => setIsHearingModalOpen(false)}
                onHearingAdded={fetchCaseDetails}
                initialCaseId={id}
            />

            <AddDocumentModal
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                onDocumentAdded={fetchCaseDetails}
                initialCaseId={id}
            />
        </div>
    );
};

export default CaseDetail;
