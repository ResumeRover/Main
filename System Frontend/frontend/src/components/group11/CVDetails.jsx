import React from 'react';

function CVDetails() {
  const candidates = [
    {
      id: '00001D',
      name: 'Queen Piumi',
      email: 'piumi@queenpiumi.com',
      education: 'CSE Undergraduate',
      university: 'University of Moratuwa',
      status: 'Valid',
      submitted: '14/06/2025',
      image: '/avatar1.jpg'
    },
    {
      id: '00002C',
      name: 'Themals',
      email: 'themals@outlook.com',
      education: 'IT Undergraduate',
      university: 'University of Moratuwa',
      status: 'Pending',
      submitted: '14/06/2025',
      image: '/avatar2.jpg'
    },
    {
      id: '00003A',
      name: 'Since Johny',
      email: 'johny@sincee.com',
      education: 'CS Undergraduate',
      university: 'University of Colombo',
      status: 'Valid',
      submitted: '14/06/2025',
      image: '/avatar3.jpg'
    },
    {
      id: '00004F',
      name: 'Buri Santos',
      email: 'santos@buri.com',
      education: 'SE Undergraduate',
      university: 'SLIIT',
      status: 'Valid',
      submitted: '14/06/2025',
      image: '/avatar4.jpg'
    },
    {
      id: '00005H',
      name: 'Dan Piyasad',
      email: 'dan@piyasad.com',
      education: 'SE Undergraduate',
      university: 'IIT',
      status: 'Pending',
      submitted: '14/06/2025',
      image: '/avatar5.jpg'
    },
    {
      id: '00007J',
      name: 'Mark Suckerberg',
      email: 'mark@intemple.com',
      education: 'SE Undergraduate',
      university: 'NSBM',
      status: 'Pending',
      submitted: '14/06/2025',
      image: '/avatar6.jpg'
    }
  ];

  return (
    <div className="rounded-xl backdrop-blur-sm shadow-xl overflow-hidden bg-gray-900/50 border border-gray-700">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-6 pb-3 text-gray-400 text-xs uppercase font-medium tracking-wider border-b border-gray-800">
          <div className="col-span-2">Person Name</div>
          <div>Educational Experience</div>
          <div>Status</div>
          <div>Submitted</div>
          <div className="text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-800">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="grid grid-cols-6 py-4 items-center">
              <div className="col-span-2 flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full overflow-hidden">
                  {/* Placeholder avatar */}
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
                  {candidate.status}
                </span>
              </div>
              
              <div className="text-gray-300">{candidate.submitted}</div>
              
              <div className="flex items-center justify-end text-gray-400 text-sm font-medium">
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CVDetails;

