import { FiCheckSquare, FiCalendar, FiCheck } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Choose Your Service",
      description: "Select from a variety of treatments tailored to your wellness needs.",
      icon: <FiCheckSquare className="w-6 h-6" />
    },
    {
      step: "2",
      title: "Pick a Time Slot",
      description: "View real-time availability and select the most convenient time for your session.",
      icon: <FiCalendar className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Get Confirmation",
      description: "Receive instant confirmation via email or push notification.",
      icon: <FiCheck className="w-6 h-6" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="mt-1 w-10 h-10 flex items-center justify-center rounded-md bg-purple-100 text-purple-600">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}