import { useState } from 'react';
import { Check, Upload, FileText, Building2, CheckCircle } from 'lucide-react';

const EFiling = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        court: '',
        caseType: '',
        plaintiff: '',
        defendant: '',
        files: []
    });
    const [submitted, setSubmitted] = useState(false);
    const [referenceId, setReferenceId] = useState('');

    const steps = [
        { number: 1, title: 'Select Court' },
        { number: 2, title: 'Case Details' },
        { number: 3, title: 'Upload Documents' },
        { number: 4, title: 'Review & Submit' }
    ];

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, files });
    };

    const handleSubmit = () => {
        // Generate fake reference ID
        const refId = `EFIL/${new Date().getFullYear()}/${Math.floor(Math.random() * 100000)}`;
        setReferenceId(refId);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="card text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Filing Submitted Successfully!</h1>
                    <p className="text-gray-600 mb-8">Your e-filing has been submitted to the court</p>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Filing Reference ID</p>
                        <p className="text-2xl font-bold text-primary-600">{referenceId}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Submitted on {new Date().toLocaleString('en-IN')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button className="btn-primary w-full">Download Receipt</button>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setCurrentStep(1);
                                setFormData({ court: '', caseType: '', plaintiff: '', defendant: '', files: [] });
                            }}
                            className="btn-secondary w-full"
                        >
                            Submit Another Filing
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">E-Filing Submission</h1>
                <p className="text-gray-500 mt-1 text-sm">Submit documents electronically to the court jurisdictions</p>
            </div>

            {/* Progress Steps */}
            <div className="glass-card !p-4 md:!p-6 overflow-x-auto custom-scrollbar">
                <div className="flex items-center justify-between min-w-[500px] md:min-w-0">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 ${currentStep >= step.number
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {currentStep > step.number ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step.number}
                                </div>
                                <p className={`text-[10px] md:text-xs mt-2 uppercase tracking-widest font-black ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'}`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-2 md:mx-4 rounded-full transition-all duration-500 ${currentStep > step.number ? 'bg-primary-600 shadow-sm' : 'bg-gray-100'}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="card">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Select Court</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Court Type
                            </label>
                            <select
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select a court</option>
                                <option value="district">District Court</option>
                                <option value="high">High Court</option>
                                <option value="supreme">Supreme Court</option>
                            </select>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Case Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Case Type
                            </label>
                            <select
                                value={formData.caseType}
                                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select case type</option>
                                <option value="civil">Civil</option>
                                <option value="criminal">Criminal</option>
                                <option value="family">Family</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plaintiff Name
                            </label>
                            <input
                                type="text"
                                value={formData.plaintiff}
                                onChange={(e) => setFormData({ ...formData, plaintiff: e.target.value })}
                                className="input-field"
                                placeholder="Enter plaintiff name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Defendant Name
                            </label>
                            <input
                                type="text"
                                value={formData.defendant}
                                onChange={(e) => setFormData({ ...formData, defendant: e.target.value })}
                                className="input-field"
                                placeholder="Enter defendant name"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                            <p className="text-sm text-gray-500 mb-4">PDF files only, max 10MB each</p>
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
                                Choose Files
                            </label>
                        </div>

                        {Array.isArray(formData?.files) && formData.files.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                                {formData.files.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-red-600" />
                                        <span className="text-sm text-gray-900">{file.name}</span>
                                        <span className="text-xs text-gray-500 ml-auto">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Document Checklist:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>✓ All documents must be in PDF format</li>
                                <li>✓ Documents should be A4 size</li>
                                <li>✓ No hidden text or annotations</li>
                                <li>✓ Pages should be properly bookmarked</li>
                            </ul>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Court</p>
                                <p className="font-medium text-gray-900 capitalize">{formData.court} Court</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Case Type</p>
                                <p className="font-medium text-gray-900 capitalize">{formData.caseType}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Plaintiff</p>
                                    <p className="font-medium text-gray-900">{formData.plaintiff}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Defendant</p>
                                    <p className="font-medium text-gray-900">{formData.defendant}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Documents ({Array.isArray(formData?.files) ? formData.files.length : 0})</p>
                                <div className="space-y-2">
                                    {Array.isArray(formData?.files) && formData.files.map((file, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-red-600" />
                                            <span className="text-gray-900">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> This is a mock e-filing system. No actual submission will be made to any court.
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between mt-8 pt-6 border-t border-gray-100 gap-3">
                    <button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed py-2.5 text-sm order-2 sm:order-1"
                    >
                        Previous Phase
                    </button>

                    {currentStep < 4 ? (
                        <button
                            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                            className="btn-primary py-2.5 text-sm order-1 sm:order-2"
                        >
                            Continue
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="btn-primary py-2.5 text-sm order-1 sm:order-2">
                            Finalize Submission
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EFiling;
