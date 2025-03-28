import { CheckIcon } from "@heroui/shared-icons";

import { title } from "@/components/primitives";

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "1 Brand",
        "Up to 100 feedback responses/month",
        "Basic analytics",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$29/month",
      features: [
        "5 Brands",
        "Unlimited feedback responses",
        "AI-powered analysis",
        "Priority support",
        "Custom forms",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited brands",
        "Advanced analytics",
        "API access",
        "Dedicated support",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div>
      <h1 className={title()}>Pricing</h1>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-12">
          Simple, Transparent Pricing
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="p-6 rounded-xl bg-content1 shadow-medium"
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="text-success" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
