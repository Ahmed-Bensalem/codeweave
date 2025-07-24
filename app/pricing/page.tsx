"use client";

import { FaBuilding, FaRocket, FaStar, FaUsers } from "react-icons/fa";
import ClientWrapper from "../components/ClientWrapper";
import Header from "../components/Header";
import PricingCard from "../components/PriceCard";
import Footer from "../components/Footer";

export default function Pricing() {
  const plans = [
    {
      title: "Early Access",
      passedPlan: "free",
      icon: <FaRocket className="w-5 h-5 text-blue-500" />,
      price: "£0/month",
      description: (
        <>
          Limited free access during beta 🧪 <br /> <br />
          Access our DevOps & GenAI assistant for free. No setup, no credit card
          — just start building.
        </>
      ),
      buttonText: "Choose this plan",
      buttonLink: "/dashboard",
      features: [
        "Generate DevOps code (Terraform, CI/CD, YAML, etc.)",
        "Build GenAI apps (LangChain, Streamlit, Chatbots)",
        "3 free generations per day",
        "No credit card required",
        "Instant access via web",
      ],
      note: "After the limit is reached, upgrade to continue generating.",
    },
    {
      title: "Pro",
      passedPlan: "pro",
      icon: <FaStar className="w-5 h-5 text-blue-500" />,
      price: "£12/month",
      description: (
        <>
          For solo developers automating infrastructure or building GenAI apps.{" "}
          <br /> <br /> <br />
        </>
      ),
      buttonText: "Choose this plan",
      buttonLink: "https://devops-copilot.onrender.com/",
      features: [
        "Unlimited DevOps generations (Terraform, CI/CD, YAML, etc)",
        "Build and preview GenAI apps (LangChain, Streamlit, Chatbots)",
        "Export single file app templates",
        "Up to 100 GenAI app generations/month",
        "Email support",
      ],
    },
    {
      title: "Teams",
      passedPlan: "teams",
      icon: <FaUsers className="w-5 h-5 text-blue-500" />,
      price: "£49/month/team",
      description:
        "For small teams working on DevOps and GenAI projects collaboratively.",
      buttonText: "Choose this plan",
      buttonLink: "https://devops-copilot.onrender.com/",
      features: [
        "Everything in Pro",
        "3 team seats included",
        "Shared generation history and projects",
        "Up to 500 GenAI app generations/month",
        "Multi file GenAI app scaffolding (LangChain agents, FastAPI backend, etc.)",
      ],
    },
    {
      title: "Enterprise",
      icon: <FaBuilding className="w-5 h-5 text-blue-500" />,
      price: "Custom pricing",
      description:
        "For companies building production ready DevOps & GenAI solutions.",
      buttonText: "Contact sales",
      buttonLink: "https://devops-copilot.onrender.com/",
      features: [
        "Everything in Teams",
        "Unlimited generations (DevOps + GenAI)",
        "GenAI app hosting (optional add on)",
        "API access for automation workflows",
        "Custom integrations (GitHub, SSO, etc.)",
        "Onboarding sessions",
        "Priority support & SLA",
      ],
    },
  ];

  return (
    <ClientWrapper>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto p-6 sm:p-8 lg:p-12">
          <h1 className="text-4xl my-10 font-bold text-center pt-2 text-blue-500">
            Start Free - Scale Your DevOps & GenAI Stack Anytime
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <div key={idx} className="flex justify-center">
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </ClientWrapper>
  );
}
