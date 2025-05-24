import React from 'react';

function Pricing() {
  const pricingPlans = [
    {
      name: "Basic Package",
      price: "$75/month",
      features: ["1 session per month", "Email Notifications", "Standard Treatments"],
    },
    {
      name: "Premium Package",
      price: "$150/month",
      features: [
        "3 sessions per month",
        "Push Notifications",
        "VIP Treatments",
        "Priority Booking",
      ],
      popular: true,
    },
    {
      name: "Deluxe Package",
      price: "$250/month",
      features: [
        "Unlimited sessions",
        "Personalized Services",
        "Access to all amenities",
        "24/7 Support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${
                plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="text-center text-sm font-medium text-purple-600 mb-2">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold mb-4">{plan.price}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2 text-gray-600">
                    <span>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;