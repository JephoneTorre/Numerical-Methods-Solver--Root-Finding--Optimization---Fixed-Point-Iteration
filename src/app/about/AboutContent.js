"use client";

import Image from "next/image";
import jephonePic from "../assets/jephone.png";
import cherilynPic from "../assets/cha.png";
import partnerPic from "../assets/lem.png"; // replace with actual file names

export default function AboutContent() {
  const teamMembers = [
    {
      name: "Jephone",
      role: "Back-end & Front-end Lead",
      pic: jephonePic,
      alt: "Jephone's Picture",
    },
    {
      name: "Chariz",
      role: "Front-end Development",
      pic: cherilynPic,
      alt: "Chariz's Picture",
    },
    {
      name: "Dave",
      role: "Front-end Development",
      pic: partnerPic,
      alt: "Dave's Picture",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start text-center p-8 min-h-[80vh] bg-white text-gray-800">
      
      {/* --- Header Section --- */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#004d40] mb-4">
        Our Project & Team
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl">
        This application was built as a project to demonstrate the practical use of numerical methods.
      </p>

      {/* --- Technology Stack Section --- */}
      <div className="bg-green-50 p-8 rounded-xl border border-green-100 mb-16 max-w-4xl w-full shadow-inner">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Technology Stack</h2>
        <p className="text-lg text-gray-700 font-medium">
          Built with: 
          <span className="font-extrabold text-[#004d40] mx-2">Next.js</span> (React Framework), 
          <span className="font-extrabold text-[#004d40] mx-2">Tailwind CSS</span> (Styling), and 
          <span className="font-extrabold text-[#004d40] mx-2">Math.js</span> (Core Computations).
        </p>
        <p className="text-sm text-gray-500 mt-2">
           It provides solutions for functions, including exporting iteration results with formulas.
        </p>
      </div>

      {/* --- Team Section --- */}
      <h2 className="text-3xl font-bold text-gray-800 mb-10 border-b-2 border-green-200 pb-2">
        The Development Team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Circular Image Container */}
            <div className="w-40 h-40 bg-gray-100 rounded-full overflow-hidden mb-4 border-4 border-green-400">
              <Image
                src={member.pic}
                alt={member.alt}
                className="w-full h-full object-cover"
              />
            </div>
            
            <span className="text-xl font-extrabold text-[#004d40]">{member.name}</span>
            <span className="text-md text-gray-500 mt-1">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}