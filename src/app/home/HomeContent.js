"use client";

// Accept the onNavigate prop here
export default function HomeContent({ onNavigate }) {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center">
      
      {/* Hero Section */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-[#004d40] mb-6 tracking-tight">
        Optimization & Root Finding
      </h1>
      <h2 className="text-2xl md:text-3xl font-medium text-green-700 mb-8">
        Bisection Method Application
      </h2>
      
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Make your life easier with our Bisection Method Calculator! Find roots of continuous functions quickly and accurately.
      </p>

      {/* Updated Button using onNavigate */}
      <button
        onClick={onNavigate} 
        className="bg-[#004d40] text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-[#00382e] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        Go to Calculator
      </button>

      {/* Info Cards */}
      <div className="mt-20 grid md:grid-cols-2 gap-8 text-left w-full max-w-5xl">
        <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
          <h3 className="text-2xl font-bold text-[#004d40] mb-3">Purpose</h3>
          <p className="text-gray-700">
            An interactive platform to learn and practice numerical methods for solving mathematical problems that cannot be solved analytically.
          </p>
        </div>

        <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
          <h3 className="text-2xl font-bold text-[#004d40] mb-3">Why Numerical Methods?</h3>
          <p className="text-gray-700">
            Crucial in engineering and physics for approximating solutions to equations and optimizing functions efficiently.
          </p>
        </div>
      </div>

    </div>
  );
}