import { useState } from 'react';
import { uploadResume } from '../../services/api';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setUploadStatus('uploading');
      
      const formData = new FormData();
      formData.append('resume', file);
      
      await uploadResume(formData);
      
      setUploadStatus('success');
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white font-sans">
      <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
      
      <div className="space-y-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-300 ${
            dragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-blue-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {file ? (
            <div className="text-lg">
              Selected: <span className="font-medium text-blue-400">{file.name}</span>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop your resume file here</p>
              <p className="text-sm text-gray-400">Or click to browse</p>
            </div>
          )}
          
          <input 
            type="file" 
            id="resume" 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx" 
          />
          <label 
            htmlFor="resume"
            className="mt-4 inline-block cursor-pointer text-sm text-blue-400 hover:text-blue-300"
          >
            Browse files
          </label>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              !file || uploading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>
      </div>
      
      {uploadStatus === 'success' && (
        <div className="bg-green-900/30 border border-green-700 text-green-400 px-6 py-4 rounded mt-4 text-center">
          Resume uploaded successfully! Processing will begin shortly.
        </div>
      )}
      
      {uploadStatus === 'failed' && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-6 py-4 rounded mt-4 text-center">
          Failed to upload resume. Please try again.
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Filename</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Queen_Pluml_CV.pdf</td>
                <td className="px-6 py-4 whitespace-nowrap">14/06/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-400">
                    Valid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Thanudi_Resume.docx</td>
                <td className="px-6 py-4 whitespace-nowrap">14/06/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                    Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Since_Johny.pdf</td>
                <td className="px-6 py-4 whitespace-nowrap">14/06/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-400">
                    Valid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;