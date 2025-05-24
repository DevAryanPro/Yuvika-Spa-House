export default function Hero() {
  return (
    <section id="hero" className="pt-20 md:pt-28 pb-32 relative overflow-hidden min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 mb-6 text-sm font-medium">
          Intelligent Appointment Booking System
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
          Relax, Recharge, and Renew Your Soul at{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Yuvika Spa House
          </span>
        </h1>

        <p className="text-base md:text-lg text-gray-600 mt-6 max-w-xl mx-auto px-4">
          Experience the future of spa booking with our intelligent system.
          Choose your treatment, pick a time, and receive instant confirmation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="px-6 py-3 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            Book Now
          </button>
          <button className="px-6 py-3 rounded-md border border-gray-300 hover:border-purple-600 hover:text-purple-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}