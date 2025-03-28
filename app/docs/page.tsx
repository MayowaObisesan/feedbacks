import { CheckIcon } from "lucide-react";

import { title } from "@/components/primitives";

export default function DocsPage() {
  return (
    <div>
      <h1 className={title()}>Docs</h1>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Documentation</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-content1 shadow-medium">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="text-3xl font-bold mb-6">Free</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> 1 Brand
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Up to 100 feedback
                responses/month
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Basic analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Email support
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-content1 shadow-medium">
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <p className="text-3xl font-bold mb-6">$29/month</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> 5 Brands
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Unlimited feedback
                responses
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> AI-powered analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Priority support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Custom forms
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-content1 shadow-medium">
            <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
            <p className="text-3xl font-bold mb-6">Custom</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Unlimited brands
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> API access
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Dedicated support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-success" /> Custom integrations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
