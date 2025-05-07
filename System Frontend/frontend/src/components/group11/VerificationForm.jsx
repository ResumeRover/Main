import React, { useState, useRef } from 'react';
import { Move, Check, Clock, Plus, Edit, Search, X } from 'lucide-react';

function VerificationForm() {
  // Sample candidate data
  const initialCandidates = [
    {
      id: '00001D',
      name: 'Queen Piumi',
      email: 'piumi@queenpiumi.com',
      education: 'CSE Undergraduate',
      university: 'University of Moratuwa',
      status: 'Valid',
      submitted: '14/06/2025',
    },
    {
      id: '00002C',
      name: 'Themals',
      email: 'themals@outlook.com',
      education: 'IT Undergraduate',
      university: 'University of Moratuwa',
      status: 'Pending',
      submitted: '14/06/2025',
    },
    {
      id: '00003A',
      name: 'Since Johny',
      email: 'johny@sincee.com',
      education: 'CS Undergraduate',
      university: 'University of Colombo',
      status: 'Valid',
      submitted: '14/06/2025',
    },
    {
      id: '00004F',
      name: 'Buri Santos',
      email: 'santos@buri.com',
      education: 'SE Undergraduate',
      university: 'SLIIT',
      status: 'Valid',
      submitted: '14/06/2025',
    },
    {
      id: '00005H',
      name: 'Dan Piyasad',
      email: 'dan@piyasad.com',
      education: 'SE Undergraduate',
      university: 'IIT',
      status: 'Pending',
      submitted: '14/06/2025',
    },
    {
      id: '00007J',
      name: 'Mark Suckerberg',
      email: 'mark@intemple.com',
      education: 'SE Undergraduate',
      university: 'NSBM',
      status: 'Pending',
      submitted: '14/06/2025',
    }
  ];

  // States
  const [candidates, setCandidates] = useState(initialCandidates);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    documentType: 'cv',
    institution: '',
    degree: '',
    yearOfCompletion: '',
    additionalNotes: ''
  });
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const dropZoneRef = useRef(null);
  
  // Filter candidates based on search
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };
  
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form and show success message
    setShowVerificationForm(false);
    setStep(1);
    setFormData({
      candidateName: '',
      candidateEmail: '',
      documentType: 'cv',
      institution: '',
      degree: '',
      yearOfCompletion: '',
      additionalNotes: ''
    });
    // Show success notification
    alert('Verification request submitted successfully!');
  };

  // Drag and Drop handlers
  const handleDragStart = (candidate) => {
    setDraggedCandidate(candidate);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (draggedCandidate) {
      // Populate form with dragged candidate data
      setFormData({
        ...formData,
        candidateName: draggedCandidate.name,
        candidateEmail: draggedCandidate.email,
        institution: draggedCandidate.university,
        degree: draggedCandidate.education,
      });
      
      setShowVerificationForm(true);
      setDraggedCandidate(null);
    }
  };

  // Function to manually add candidate to form
  const addCandidateToForm = (candidate) => {
    setFormData({
      ...formData,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      institution: candidate.university,
      degree: candidate.education,
    });
    
    setShowVerificationForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Document Verification System
          </h1>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowVerificationForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Verification
            </button>
          </div>
        </div>
        
        {showVerificationForm ? (
          <div className="bg-gray-900 bg-opacity-70 rounded-xl backdrop-blur-sm shadow-xl p-6 border border-gray-800 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Document Verification Request</h2>
              <button 
                onClick={() => {
                  setShowVerificationForm(false);
                  setStep(1);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step >= item 
                          ? 'border-blue-500 bg-blue-500 bg-opacity-20' 
                          : 'border-gray-700 bg-gray-800'
                      }`}
                    >
                      <span className={`text-sm font-medium ${step >= item ? 'text-blue-400' : 'text-gray-500'}`}>
                        {item}
                      </span>
                    </div>
                    {item < 3 && (
                      <div className={`flex-1 h-0.5 ${step > item ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-blue-400">Candidate Info</span>
                <span className={`text-xs ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>Document Details</span>
                <span className={`text-xs ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>Confirmation</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="candidateName" className="block text-sm font-medium text-gray-300 mb-1">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      id="candidateName"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter candidate name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-300 mb-1">
                      Candidate Email
                    </label>
                    <input
                      type="email"
                      id="candidateEmail"
                      name="candidateEmail"
                      value={formData.candidateEmail}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter candidate email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-300 mb-1">
                      Document Type
                    </label>
                    <select
                      id="documentType"
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="cv">CV/Resume</option>
                      <option value="certificate">Certificate</option>
                      <option value="transcript">Academic Transcript</option>
                      <option value="letter">Recommendation Letter</option>
                    </select>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-1">
                      Institution/University
                    </label>
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter institution name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-1">
                      Degree/Qualification
                    </label>
                    <input
                      type="text"
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter degree or qualification"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="yearOfCompletion" className="block text-sm font-medium text-gray-300 mb-1">
                      Year of Completion
                    </label>
                    <input
                      type="text"
                      id="yearOfCompletion"
                      name="yearOfCompletion"
                      value={formData.yearOfCompletion}
                      onChange={handleChange}
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="YYYY"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-300 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3">Verification Request Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Candidate Name:</p>
                        <p className="text-white font-medium">{formData.candidateName}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Candidate Email:</p>
                        <p className="text-white font-medium">{formData.candidateEmail}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Document Type:</p>
                        <p className="text-white font-medium">
                          {formData.documentType === 'cv' && 'CV/Resume'}
                          {formData.documentType === 'certificate' && 'Certificate'}
                          {formData.documentType === 'transcript' && 'Academic Transcript'}
                          {formData.documentType === 'letter' && 'Recommendation Letter'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Institution:</p>
                        <p className="text-white font-medium">{formData.institution}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Degree/Qualification:</p>
                        <p className="text-white font-medium">{formData.degree}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Year of Completion:</p>
                        <p className="text-white font-medium">{formData.yearOfCompletion}</p>
                      </div>
                    </div>
                    
                    {formData.additionalNotes && (
                      <div className="mt-4">
                        <p className="text-gray-400">Additional Notes:</p>
                        <p className="text-white">{formData.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="confirmation"
                      className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                      required
                    />
                    <label htmlFor="confirmation" className="ml-2 text-sm text-gray-300">
                      I confirm that the information provided is accurate to the best of my knowledge.
                    </label>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
                  >
                    Submit Verification Request
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div 
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`transition-all duration-300 ease-in-out mb-8 p-6 rounded-xl border-2 border-dashed ${
              isDraggingOver 
                ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                : 'border-gray-700 bg-gray-900 bg-opacity-20'
            }`}
          >
            <div className="text-center py-8">
              <div className="flex justify-center mb-3">
                {isDraggingOver ? (
                  <div className="animate-pulse text-blue-400">
                    <Plus size={40} />
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Move size={40} />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {isDraggingOver ? 'Drop to Create Verification Request' : 'Drag a Candidate Here'}
              </h3>
              <p className="text-gray-400 text-sm">
                Drag any candidate from the list below to quickly create a verification request
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-gray-900 bg-opacity-70 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden border border-gray-800">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Candidate Documents</h2>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidates..."
                  className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-6 pb-3 text-gray-400 text-xs uppercase font-medium tracking-wider border-b border-gray-800">
              <div className="col-span-2">Person Name</div>
              <div>Educational Experience</div>
              <div>Status</div>
              <div>Submitted</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-gray-800">
              {filteredCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="grid grid-cols-6 py-4 items-center transition duration-150 hover:bg-gray-800 hover:bg-opacity-30 cursor-grab"
                  draggable
                  onDragStart={() => handleDragStart(candidate)}
                >
                  <div className="col-span-2 flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-gray-400 text-sm">{candidate.email}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">{candidate.education}</div>
                    <div className="text-gray-400 text-sm">{candidate.university}</div>
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      candidate.status === 'Valid'
                        ? 'bg-green-100 bg-opacity-20 text-green-400'
                        : 'bg-yellow-100 bg-opacity-20 text-yellow-400'
                    }`}>
                      {candidate.status === 'Valid' ? (
                        <Check size={12} className="mr-1" />
                      ) : (
                        <Clock size={12} className="mr-1" />
                      )}
                      {candidate.status}
                    </span>
                  </div>
                  
                  <div className="text-gray-300">{candidate.submitted}</div>
                  
                  <div className="flex items-center justify-end gap-3 text-gray-400 text-sm font-medium">
                    <button 
                      onClick={() => addCandidateToForm(candidate)}
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </button>
                    <button className="text-gray-400 hover:text-gray-300 flex items-center">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationForm;