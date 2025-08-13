'use client';

export default function RoswellIncident1Document() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 p-8 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Document Container */}
        <div className="relative bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-lg shadow-2xl vintage-paper border-4 border-amber-800/20">
          {/* Document Wear and Stains */}
          <div className="absolute inset-0 opacity-20 pointer-events-none rounded-lg">
            <div className="absolute top-4 right-6 w-12 h-12 bg-amber-900/30 rounded-full blur-sm"></div>
            <div className="absolute bottom-12 left-8 w-8 h-8 bg-yellow-800/20 rounded-full blur-sm"></div>
            <div className="absolute top-20 left-4 w-6 h-16 bg-amber-800/10 rounded-sm blur-sm"></div>
          </div>

          {/* Unclassified Stamp */}
          <div className="absolute top-6 right-8 border-2 border-black px-4 py-1 bg-amber-100 transform rotate-2">
            <span className="text-black font-bold text-sm tracking-wider">UNCLASSIFIED</span>
          </div>

          {/* Title */}
          <div className="text-center mb-8 mt-4">
            <h1 className="text-4xl font-bold text-black tracking-wider mb-2">
              ROSWELL INCIDENT—
            </h1>
            <h2 className="text-4xl font-bold text-black tracking-wider">
              —JULY 1947
            </h2>
          </div>

          {/* Dotted Background Pattern */}
          <div className="relative mb-6">
            <div className="grid grid-cols-20 gap-1 opacity-40 mb-4">
              {Array.from({length: 200}).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
              ))}
            </div>
            {/* Arrow pointing to photo */}
            <div className="absolute top-12 left-20 transform -rotate-12">
              <svg width="80" height="20" className="text-black">
                <path d="M0 10 L70 10 L65 5 M70 10 L65 15" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>

          {/* Photo with Paperclip */}
          <div className="relative mb-6">
            <div className="relative inline-block bg-gray-200 p-1 shadow-lg transform rotate-1">
              <img
                src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=300&h=200&fit=crop&crop=center"
                alt="Crash debris"
                className="w-64 h-48 object-cover sepia grayscale contrast-125"
              />
              {/* Paperclip */}
              <div className="absolute -top-2 -right-2 transform rotate-12">
                <svg width="24" height="60" className="text-gray-600">
                  <path d="M12 5 Q6 5 6 12 L6 45 Q6 52 12 52 Q18 52 18 45 L18 15 Q18 12 15 12 Q12 12 12 15 L12 40"
                        stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Document Text */}
          <div className="space-y-4 text-black leading-relaxed">
            <div className="mb-6">
              <div className="grid grid-cols-30 gap-1 opacity-20 mb-2">
                {Array.from({length: 150}).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
                ))}
              </div>
              <p className="text-sm font-bold tracking-wide mb-2">WITNESSES REPORTED A CRASHED DISC WEST OF ROSWELL.</p>
              <div className="grid grid-cols-30 gap-1 opacity-20 mb-2">
                {Array.from({length: 150}).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
                ))}
              </div>
            </div>

            <p className="text-sm leading-6 mb-4">
              MILITARY PERSONNEL FROM NEARBY ROSWELL ARMY AIR FIELD WERE<br/>
              IMMEDIATELY DISPATCHED TO SECURE THE AREA AND RETRIEVE WHAT<br/>
              WAS DESCRIBED AS A CRASH LANDED VEHICLE. ESTIMATES OF THE<br/>
              OBJECT'S SIZE VAR<span className="inline-flex w-20"><span className="grid grid-cols-10 gap-1 opacity-20 mx-1">{Array.from({length: 10}).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
            ))}</span></span>
            </p>

            <p className="text-sm leading-6 mb-4">
              UPON MILITARY ARRIVAL, THE OBJECT AND RECOVERED DEBRIS WAS<br/>
              TRANSPORTED TO ROSWELL ARMY AIRFIELD UNDER ARMED GUARD. MI-<br/>
              LITARY ISOLATED NEARBY THE OBJECT WAS DENYING THE PRESS<br/>
              AND LOCAL INQUIRIES SMALL AMOUNT OF INFORMATION, THE PRESS E-<br/>
              ELEASE NEARBY OBJECT<span className="inline-flex w-20"><span className="grid grid-cols-10 gap-1 opacity-20 mx-1">{Array.from({length: 15}).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
            ))}</span></span>
            </p>

            <p className="text-sm leading-6 mb-4">
              TRANSFERRED AND TRANSPORTED UNDER TRANSPORTED TO A TOTAL<br/>
              DATA MADNESS. ILL WITNESS ACCOUNTS HAVE DEEP PRESERVED AND
            </p>

            <p className="text-sm leading-6 mb-4">
              HIGHLY CLASSIFIED IM<span className="inline-flex w-40"><span className="grid grid-cols-20 gap-1 opacity-20 mx-1">{Array.from({length: 30}).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
            ))}</span></span>
            </p>

            {/* More dotted lines at bottom */}
            <div className="grid grid-cols-30 gap-1 opacity-20 mt-8">
              {Array.from({length: 120}).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
