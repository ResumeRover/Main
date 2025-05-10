import React from 'react';

function DocumentStatus() {
  const documents = [
    {
      id: 1,
      name: 'Queen_Piumi_CV.pdf',
      status: 'Verified',
      type: 'CV Document',
      timestamp: '14/06/2025 09:32 AM',
      blockchainId: '0x8a23f...12ec',
      size: '1.2 MB'
    },
    {
      id: 2,
      name: 'Themals_Resume.docx',
      status: 'Pending',
      type: 'CV Document',
      timestamp: '14/06/2025 11:15 AM',
      blockchainId: '0x4f12c...98ad',
      size: '890 KB'
    },
    {
      id: 3,
      name: 'Since_Johny_CV.pdf',
      status: 'Verified',
      type: 'CV Document',
      timestamp: '14/06/2025 10:05 AM',
      blockchainId: '0x2b56a...45fc',
      size: '1.5 MB'
    },
    {
      id: 4,
      name: 'Buri_Santos_Resume.pdf',
      status: 'Verified',
      type: 'CV Document',
      timestamp: '14/06/2025 08:45 AM',
      blockchainId: '0x7d34e...65ba',
      size: '2.1 MB'
    },
    {
      id: 5,
      name: 'Dan_Piyasad_CV.docx',
      status: 'Pending',
      type: 'CV Document',
      timestamp: '14/06/2025 01:22 PM',
      blockchainId: '0x3c87d...91ef',
      size: '1.8 MB'
    }
  ];

  return (
    <div className="space-y-6 ">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-semibold text-white">Document Verification Status</h2>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Upload New Document
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors">
            Filter
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800 bg-opacity-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Document Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Blockchain ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-800 hover:bg-opacity-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-700 rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{doc.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'Verified'
                      ? 'bg-green-100 bg-opacity-20 text-green-400'
                      : 'bg-yellow-100 bg-opacity-20 text-yellow-400'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {doc.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {doc.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-blue-900 bg-opacity-30 text-blue-400 px-2 py-1 rounded text-xs font-mono">
                    {doc.blockchainId}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="text-blue-400 hover:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentStatus;