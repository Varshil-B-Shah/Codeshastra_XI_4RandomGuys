"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle, XCircle, ChevronLeft } from "lucide-react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function PricingPage() {
  const tiers = [
    {
      name: "Basic",
      price: "₹0",
      period: "Forever Free",
      description: "For individual travelers on short trips",
      color: "bg-gray-100 hover:bg-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        { name: "Plan up to 3 trips", included: true },
        { name: "Basic itinerary planner", included: true },
        { name: "Standard maps", included: true },
        { name: "Group chat with 5 members", included: true },
        { name: "Basic expense tracking", included: true },
        { name: "Community access", included: true },
        { name: "Virtual tours of 5 landmarks", included: true },
        { name: "Limited leaderboard access", included: true },
        { name: "Standard support", included: true },
        { name: "Real-time language translation", included: false },
        { name: "Offline maps & guides", included: false },
        { name: "AI Trip recommendations", included: false },
        { name: "Advanced expense analytics", included: false },
        { name: "Priority support", included: false },
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "₹699",
      period: "per month",
      description: "For frequent travelers and groups",
      color: "bg-[#1A2B6D] text-white hover:bg-[#2A3B7D]",
      buttonColor: "bg-[#FF5722] hover:bg-[#F04B17]",
      features: [
        { name: "Unlimited trips", included: true },
        { name: "Advanced itinerary planner", included: true },
        { name: "Interactive maps with landmarks", included: true },
        { name: "Group chat with 20 members", included: true },
        { name: "Advanced expense tracking", included: true },
        { name: "Community access & posting", included: true },
        { name: "Virtual tours of 20 landmarks", included: true },
        { name: "Full leaderboard access", included: true },
        { name: "Priority support", included: true },
        { name: "Real-time language translation", included: true },
        { name: "Offline maps & guides", included: true },
        { name: "AI Trip recommendations", included: true },
        { name: "Advanced expense analytics", included: true },
        { name: "Emergency travel assistance", included: false },
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "₹1,299",
      period: "per month",
      description: "For travel enthusiasts & professionals",
      color: "bg-gradient-to-br from-[#FF5722] to-[#F9A31A] text-white hover:from-[#F04B17] hover:to-[#E89309]",
      buttonColor: "bg-white text-[#FF5722] hover:bg-gray-100",
      features: [
        { name: "Unlimited trips", included: true },
        { name: "Premium itinerary planner with AI", included: true },
        { name: "Custom interactive maps", included: true },
        { name: "Unlimited group chats", included: true },
        { name: "Complete expense management", included: true },
        { name: "Priority community features", included: true },
        { name: "Unlimited virtual tours", included: true },
        { name: "Exclusive leaderboard features", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Advanced language translation", included: true },
        { name: "Offline maps & interactive guides", included: true },
        { name: "Personalized AI recommendations", included: true },
        { name: "Comprehensive expense analytics", included: true },
        { name: "Emergency travel assistance", included: true },
      ],
    },
  ];

  return (
    <DashboardLayout title="Pricing Plans">
      <Link
        href="/dashboard"
        className="flex items-center text-[#1A2B6D] hover:text-[#009688] font-medium mb-8 transition-all"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1A202C] mb-4">
          Choose Your Travel Companion Plan
        </h1>
        <p className="text-lg text-[#4A5568]">
          Select the plan that best suits your travel needs and unlock premium
          features to enhance your journeys across India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 ${
              tier.popular
                ? "ring-4 ring-[#FF5722]/30 relative scale-105 z-10"
                : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute top-0 right-0 bg-[#FF5722] text-white py-1 px-4 rounded-bl-lg font-medium text-sm">
                Most Popular
              </div>
            )}

            <div className={`p-8 ${tier.color}`}>
              <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                <span className="text-lg ml-2 mb-1 opacity-80">
                  {tier.period}
                </span>
              </div>
              <p className="opacity-90 mb-6">{tier.description}</p>
              <button
                className={`w-full py-3 rounded-lg font-medium transition-all ${tier.buttonColor}`}
              >
                {tier.current ? "Current Plan" : `Choose ${tier.name}`}
              </button>
            </div>

            <div className="bg-white p-8">
              <h4 className="font-semibold mb-4 text-[#2D3748]">
                What's included:
              </h4>
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li
                    key={feature.name}
                    className="flex items-start"
                  >
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included ? "text-[#2D3748]" : "text-gray-400"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-xl p-8 mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">
              Can I switch plans anytime?
            </h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will be effective immediately, with pro-rated charges or credits
              applied to your account.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept all major credit cards, debit cards, UPI, and select
              mobile wallets for your convenience.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">
              Can I get a refund if I'm not satisfied?
            </h3>
            <p className="text-gray-600">
              We offer a 14-day money-back guarantee for Pro and Premium plans if
              you're not completely satisfied with our service.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1A2B6D] to-[#4C63B6] text-white p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-3">Need help choosing?</h2>
        <p className="mb-6 text-blue-100">
          Our team can help you find the right plan for your travel needs.
        </p>
        <button className="bg-white text-[#1A2B6D] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Contact Support
        </button>
      </div>
    </DashboardLayout>
  );
}
