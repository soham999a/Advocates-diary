import { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../firebase';

const AddDocumentModal = ({ isOpen, onClose, onDocumentAdded, initialCaseId }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [formData, setFormData] = useState({
        case_id: initialCaseId || '',
        filename: '',
        file_type: 'Order'
    });

    useEffect(() => {
        if (initialCaseId) {
            setFormData(prev => ({ ...prev, case_id: initialCaseId }));
        }
    }, [initialCaseId]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchCases();
        }
    }, [isOpen]);

    const fetchCases = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(`${API_URL}/api/cases`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCases(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching cases:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFormData({ ...formData, filename: file.name });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        if (!selectedFile && !formData.filename) return;

        setLoading(true);
        setUploadProgress(10);

        try {
            const token = await currentUser.getIdToken();

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // In a real app, this would be a multipart/form-data upload to storage
            // Here we just save the metadata to the database
            await axios.post(`${API_URL}/api/documents`, {
                ...formData,
                file_url: `https://example.com/${selectedFile?.name || 'mock-file.pdf'}` // Mock URL
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            clearInterval(interval);
            setUploadProgress(100);

            setTimeout(() => {
                onDocumentAdded();
                onClose();
            }, 500);
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Upload Document</h2>
                        <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-1">Archive record</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Select Matter *
                        </label>
                        <select
                            name="case_id"
                            value={formData.case_id}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            required
                        >
                            <option value="">Select an active case</option>
                            {Array.isArray(cases) && cases.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.case_number} - {c.case_title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Document Label *
                        </label>
                        <input
                            name="filename"
                            value={formData.filename}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                            placeholder="e.g. Interim Order - Feb 2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Document Classification
                        </label>
                        <select
                            name="file_type"
                            value={formData.file_type}
                            onChange={handleChange}
                            className="input-field bg-gray-50/50 border-gray-100 text-sm"
                        >
                            <option value="Order">Court Order</option>
                            <option value="Petition">Petition</option>
                            <option value="Evidence">Evidence Document</option>
                            <option value="Vakalatnama">Vakalatnama</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 md:p-8 text-center bg-gray-50/30 hover:bg-gray-50 transition-colors relative transition-all">
                        {loading ? (
                            <div className="space-y-4 py-4">
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-primary-600 h-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest animate-pulse">
                                    Uploading to Vault {uploadProgress}%
                                </p>
                            </div>
                        ) : selectedFile ? (
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto">
                                    <FileText className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{selectedFile.name}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Vault
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="text-[10px] font-bold text-rose-500 uppercase hover:underline"
                                >
                                    Remove File
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 md:w-10 md:h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-xs md:text-sm font-medium text-gray-600">
                                    Select vault file or drag & drop
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                                    PDF, DOCX, JPG (Max 10MB)
                                </p>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                                />
                                <label htmlFor="file-upload" className="mt-4 btn-secondary text-[10px] font-bold uppercase inline-block cursor-pointer">
                                    Browse Local
                                </label>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading || cases.length === 0}
                            className="btn-primary w-full sm:w-auto order-1 sm:order-2"
                        >
                            {loading ? 'Processing...' : 'Upload to Vault'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDocumentModal;
