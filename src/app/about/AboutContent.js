"use client";

import Image from "next/image";
import jephonePic from "../assets/jephone.png";
import cherilynPic from "../assets/cha.png";
import partnerPic from "../assets/lem.png"; // replace with actual file names

export default function AboutContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
      <p className="text-lg md:text-xl text-green-900 mb-10">
        This app was built using Next.js, React, and Tailwind CSS. It helps you compute numerical solutions for functions and export results with formulas.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Box 1 */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
            <Image
              src={jephonePic}
              alt="Jephone"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-medium">Jephone(Back-end/front-end)</span>
        </div>

        {/* Box 2 */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
            <Image
              src={cherilynPic}
              alt="Cherilyn"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-medium">Chariz(Front-end)</span>
        </div>

        {/* Box 3 */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
            <Image
              src={partnerPic}
              alt="Partner"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-medium">Dave(front-end)</span>
        </div>
      </div>
    </div>
  );
}
