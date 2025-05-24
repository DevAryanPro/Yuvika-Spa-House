export default function Testimonials() {
  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Regular Client",
      quote: "The booking system is so smooth. I love how easy it is to book appointments using voice commands."
    },
    {
      name: "Michael Lee",
      role: "First-time User",
      quote: "I was blown away by the intuitive interface and real-time availability updates."
    },
    {
      name: "Sophia Chen",
      role: "Wellness Enthusiast",
      quote: "The personalized notifications are life-changing. Never miss a session again!"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}