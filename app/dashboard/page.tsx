"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomOneDark,
  docco,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useAuth } from "@clerk/nextjs";
import {
  FaDocker,
  FaCode,
  FaSpinner,
  FaTerminal,
  FaPython,
  FaBug,
  FaAws,
  FaMicrosoft,
  FaGoogle,
} from "react-icons/fa";
import {
  SiTerraform,
  SiKubernetes,
  SiAnsible,
  SiHelm,
  SiPacker,
  SiHashicorp,
  SiFlux,
  SiJenkins,
  SiAwslambda,
  SiOpenai,
  SiHuggingface,
  SiGo,
  SiPython,
} from "react-icons/si";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useLimitCheck from "../components/LimitChecker";
import ClientWrapper from "../components/ClientWrapper";
import UpgradeModal from "../components/UpgradeModal";

type CodeOutput = string | Record<string, string>;

export default function Home() {
  const { limitReached, incrementUsage, triesLeft, limitError } =
    useLimitCheck();
  const { getToken } = useAuth();
  const [tool, setTool] = useState("Terraform");
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<CodeOutput>("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const tools = [
    {
      name: "Chatbot Builder",
      icon: <FaCode />,
      description:
        "Create intelligent, multi-turn conversational agents using AI.",
      suggestions: [
        "Build a chatbot",
        "Add conversational memory",
        "Customize chat flow",
        "Enable AI assistance",
      ],
    },
    {
      name: "PDF / Document QA Bot",
      icon: <FaCode />,
      description:
        "Extract insights and answer questions from documents and files.",
      suggestions: [
        "Answer questions from files",
        "Extract key details",
        "Enable document interaction",
        "Process uploaded PDFs",
      ],
    },
    {
      name: "RAG Pipeline",
      icon: <FaCode />,
      description:
        "Combine retrieval and generation to build context-aware applications.",
      suggestions: [
        "Retrieve relevant content",
        "Embed documents",
        "Connect with vector DB",
        "Use external knowledge",
      ],
    },
    {
      name: "Data Preprocessing Pipeline",
      icon: <FaCode />,
      description: "Prepare and transform datasets for training or analysis.",
      suggestions: [
        "Clean raw data",
        "Convert file formats",
        "Handle missing values",
        "Engineer features",
      ],
    },
    {
      name: "FastAPI Backend for GenAI",
      icon: <FaCode />,
      description:
        "Expose models and logic through scalable APIs with FastAPI.",
      suggestions: [
        "Create backend API",
        "Serve GenAI apps",
        "Secure endpoints",
        "Handle requests and auth",
      ],
    },
    {
      name: "Agent & Tool Builder",
      icon: <FaCode />,
      description: "Build AI agents that reason, act, and use external tools.",
      suggestions: [
        "Design tool-using agent",
        "Automate workflows",
        "Add tool chaining",
        "Enable autonomous execution",
      ],
    },
    {
      name: "Model Fine-Tuning Starter",
      icon: <FaCode />,
      description: "Customize language models using your own datasets.",
      suggestions: [
        "Prepare fine-tuning data",
        "Adjust model behavior",
        "Upload training set",
        "Start fine-tune workflow",
      ],
    },
    {
      name: "Model Training Pipeline",
      icon: <FaCode />,
      description: "Generate code to train, evaluate, and save custom models.",
      suggestions: [
        "Train ML models",
        "Evaluate results",
        "Save checkpoints",
        "Log experiment metrics",
      ],
    },
    {
      name: "Streamlit Dashboard",
      icon: <SiPython />,
      description:
        "Build visual interfaces to explore data or showcase applications.",
      suggestions: [
        "Create interactive UI",
        "Visualize outputs",
        "Build data apps",
        "Deploy tools with UI",
      ],
    },
    {
      name: "LLM Evaluation Toolkit",
      icon: <FaCode />,
      description:
        "Measure and compare model performance with automated tools.",
      suggestions: [
        "Grade LLM responses",
        "Run evaluation suite",
        "Log evaluation metrics",
        "Test AI outputs",
      ],
    },
    {
      name: "AWS",
      icon: <FaAws />,
      description: "Deploy and manage cloud infrastructure with AWS services.",
      suggestions: [
        "Launch cloud resources",
        "Use storage and compute",
        "Set up infrastructure",
        "Manage AWS services",
      ],
    },
    {
      name: "Azure",
      icon: <FaMicrosoft />,
      description: "Work with Microsoft Azure to build and scale applications.",
      suggestions: [
        "Deploy Azure services",
        "Use virtual machines",
        "Manage cloud resources",
        "Integrate with tools",
      ],
    },
    {
      name: "GCP",
      icon: <FaGoogle />,
      description:
        "Leverage Google Cloud services for compute, storage, and AI.",
      suggestions: [
        "Deploy on GCP",
        "Use serverless functions",
        "Create containers",
        "Manage workloads",
      ],
    },
    {
      name: "Terraform",
      icon: <SiTerraform />,
      description:
        "Provision infrastructure as code across multiple environments.",
      suggestions: [
        "Automate infrastructure",
        "Create Terraform plans",
        "Manage cloud deployments",
        "Use modular configs",
      ],
    },
    {
      name: "Kubernetes",
      icon: <SiKubernetes />,
      description: "Orchestrate, deploy, and scale containerized applications.",
      suggestions: [
        "Run container workloads",
        "Define deployment manifests",
        "Use Helm with K8s",
        "Manage services",
      ],
    },
    {
      name: "Docker",
      icon: <FaDocker />,
      description:
        "Containerize applications and environments for consistent deployment.",
      suggestions: [
        "Write Dockerfiles",
        "Build images",
        "Run containers",
        "Optimize app environments",
      ],
    },
    {
      name: "Ansible",
      icon: <SiAnsible />,
      description:
        "Automate configuration and system setup using simple playbooks.",
      suggestions: [
        "Configure environments",
        "Write playbooks",
        "Manage remote systems",
        "Deploy services",
      ],
    },
    {
      name: "Helm",
      icon: <SiHelm />,
      description:
        "Package, manage, and deploy Kubernetes applications with charts.",
      suggestions: [
        "Write Helm charts",
        "Templatize configurations",
        "Install apps to K8s",
        "Version your releases",
      ],
    },
    {
      name: "Packer",
      icon: <SiPacker />,
      description: "Build consistent machine images across cloud platforms.",
      suggestions: [
        "Define image templates",
        "Create AMIs",
        "Automate image builds",
        "Use provisioning scripts",
      ],
    },
    {
      name: "Vault",
      icon: <SiHashicorp />,
      description: "Securely store and manage secrets and access credentials.",
      suggestions: [
        "Create secrets engines",
        "Manage API tokens",
        "Integrate with apps",
        "Secure sensitive data",
      ],
    },
    {
      name: "Flux",
      icon: <SiFlux />,
      description: "Enable GitOps-based deployments and updates in Kubernetes.",
      suggestions: [
        "Set up GitOps pipelines",
        "Define sync rules",
        "Automate cluster state",
        "Deploy from Git",
      ],
    },
    {
      name: "Jenkins",
      icon: <SiJenkins />,
      description: "Automate CI/CD workflows with pipelines and integrations.",
      suggestions: [
        "Build delivery pipelines",
        "Trigger builds",
        "Automate testing",
        "Deploy code changes",
      ],
    },
    {
      name: "Bash Script",
      icon: <FaTerminal />,
      description: "Automate system operations or tasks using shell scripting.",
      suggestions: [
        "Write automation scripts",
        "Schedule cron jobs",
        "Perform system tasks",
        "Parse logs and files",
      ],
    },
    {
      name: "Python Script",
      icon: <FaPython />,
      description: "Build tools, utilities, or workflows using Python scripts.",
      suggestions: [
        "Write automation tools",
        "Process data files",
        "Interact with APIs",
        "Build local utilities",
      ],
    },
    {
      name: "Go Script",
      icon: <SiGo />,
      description: "Create high-performance CLI tools and services using Go.",
      suggestions: [
        "Write microservices",
        "Build CLI utilities",
        "Serve APIs",
        "Compile native binaries",
      ],
    },
    {
      name: "AWS Lambda",
      icon: <SiAwslambda />,
      description: "Run event-driven functions without managing servers.",
      suggestions: [
        "Write Lambda handlers",
        "Respond to triggers",
        "Connect to APIs",
        "Run on-demand code",
      ],
    },
    {
      name: "OpenAI API",
      icon: <SiOpenai />,
      description:
        "Access and interact with OpenAI's language and vision models.",
      suggestions: [
        "Generate text",
        "Summarize content",
        "Use GPT or DALL·E",
        "Build AI-powered features",
      ],
    },
    {
      name: "Hugging Face",
      icon: <SiHuggingface />,
      description:
        "Use pre-trained AI models or deploy your own on the HF Hub.",
      suggestions: [
        "Run transformers",
        "Use model hub",
        "Serve models via API",
        "Access datasets",
      ],
    },
    {
      name: "LangChain",
      icon: <FaCode />,
      description:
        "Build composable LLM applications using chains, memory, and tools.",
      suggestions: [
        "Use chains",
        "Integrate memory",
        "Add tools",
        "Customize workflows",
      ],
    },
    {
      name: "Vector DB",
      icon: <FaCode />,
      description: "Store and search embeddings using vector databases.",
      suggestions: [
        "Build semantic search",
        "Store document vectors",
        "Use FAISS or Qdrant",
        "Integrate with RAG",
      ],
    },
    {
      name: "Fine-tuning",
      icon: <SiOpenai />,
      description: "Improve models by training on custom labeled data.",
      suggestions: [
        "Refine model behavior",
        "Upload training examples",
        "Adjust outputs",
        "Improve task performance",
      ],
    },
    {
      name: "LLM Deployment",
      icon: <FaCode />,
      description:
        "Serve large language models for use in production environments.",
      suggestions: [
        "Expose model endpoints",
        "Run inference servers",
        "Handle scale",
        "Connect with apps",
      ],
    },
    {
      name: "Agent & Tools",
      icon: <FaCode />,
      description:
        "Combine agents with external tools to complete complex tasks.",
      suggestions: [
        "Create tool-aware agents",
        "Enable decision chains",
        "Build structured workflows",
        "Automate multi-step tasks",
      ],
    },
    {
      name: "Streamlit App",
      icon: <SiPython />,
      description: "Create fast data apps or prototypes with a web interface.",
      suggestions: [
        "Design interactive UIs",
        "Display insights",
        "Build MVP tools",
        "Enable user input",
      ],
    },
    {
      name: "FastAPI Backend",
      icon: <FaCode />,
      description: "Create API backends for serving logic, data, or models.",
      suggestions: [
        "Build web APIs",
        "Serve AI functions",
        "Expose endpoints",
        "Add user auth",
      ],
    },
    {
      name: "Other",
      icon: <FaCode />,
      description:
        "Perform general tasks, transformations, or creative utilities.",
      suggestions: [
        "Convert files",
        "Format data",
        "Generate diagrams",
        "Support misc workflows",
      ],
    },
    {
      name: "Troubleshooting",
      icon: <FaBug />,
      description:
        "Identify, debug, and fix issues across your stack or codebase.",
      suggestions: [
        "Fix build errors",
        "Resolve crashes",
        "Investigate logs",
        "Diagnose problems",
      ],
    },
  ];

  const selected = tools.find((t) => t.name === tool);
  const suggestions =
    selected?.suggestions?.filter((s) =>
      s.toLowerCase().includes(prompt.toLowerCase())
    ) || [];

  const handleGenerate = async () => {
    if (!prompt && !limitReached) return;

    if (limitReached) {
      console.log(
        "Limit reached, showing upgrade modal. Tries left:",
        triesLeft
      );
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setCode("");
    setError("");
    try {
      const token = await getToken();
      console.log("Sending generate request with token:", token);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ tool, prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Server error");
        return;
      }

      const { code: generated } = await res.json();
      setCode(generated || "No output returned.");
      console.log("Calling incrementUsage after successful generate");
      await incrementUsage();
      if (limitError) {
        setError(limitError); // Display metadata update error
      }
    } catch (err) {
      setError("Error connecting to backend.");
      console.error("Generate request failed:", err);
    }
    setLoading(false);
    setShowSuggestions(false);
  };

  const syntaxStyle =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? atomOneDark
      : docco;

  const getLanguage = (tool: string): string => {
    if (tool.includes("Terraform")) return "hcl";
    if (tool.includes("Python")) return "python";
    if (tool.includes("Bash")) return "bash";
    if (tool.includes("Docker")) return "dockerfile";
    if (tool.includes("Kubernetes") || tool.includes("Helm")) return "yaml";
    if (tool.includes("Go")) return "go";
    if (
      tool.includes("FastAPI") ||
      tool.includes("LLM") ||
      tool.includes("LangChain")
    )
      return "python";
    return "text";
  };

  return (
    <ClientWrapper>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-full mx-8 p-6 sm:p-6 lg:p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center pt-2 text-blue-500">
            Select Your DevOps & AI Focus Areas
          </h1>
          <p className="text-lg text-center pb-4 text-gray-700 dark:text-gray-300">
            Select your DevOps and AI focus areas to generate code, streamline
            workflows, and accelerate delivery with AI-powered automation
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tools.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTool(t.name);
                  setPrompt("");
                }}
                className={`flex items-start max-w-sm gap-2 p-4 rounded-lg shadow-md border text-sm  transition ${
                  t.name === tool
                    ? "bg-indigo-100 text-white"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white hover:border-indigo-300 hover:scale-105"
                } dark:bg-gray-800`}
              >
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mt-[6px]">
                  {t.icon}
                </div>
                <span className="">
                  <div className="ml-3">
                    <h3 className="text-base text-left font-semibold text-gray-900 dark:text-white">
                      {t.name}
                    </h3>
                    <p className="text-start text-gray-500 dark:text-gray-400 text-sm">
                      {t.description}
                    </p>
                  </div>
                </span>
              </button>
            ))}
          </div>

          <div className="w-[70%] flex flex-col mx-auto">
            <div className="flex flex-col items-center py-4">
              <h1 className="text-4xl font-bold text-center py-3 text-blue-500">
                Chat with Your DevOps & AI Copilot
              </h1>
              <p className="text-lg text-center pb-4 text-gray-700 dark:text-gray-300">
                Describe your challenge and get AI-powered help with DevOps,
                GenAI, or infrastructure troubleshooting
              </p>
              <div className="relative w-full mx-auto">
                <textarea
                  value={prompt}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 100)
                  }
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Describe your setup or issue to fix..."
                  className="w-full h-44 p-3 border rounded dark:bg-gray-700 dark:text-white"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-20 divide-y divide-gray-100 dark:divide-gray-700">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onMouseDown={() => {
                          setPrompt(s);
                          setShowSuggestions(false);
                        }}
                        className="px-5 py-3 text-sm text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer transition"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition
                ${limitReached ? "w-[190px]" : "w-[150px]"}
                ${loading || limitReached ? "opacity-50" : ""}`}
            >
              {limitReached ? (
                "🚫 Limit reached"
              ) : loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "🚀 Generate"
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 font-semibold">
              ❌ {error}
            </div>
          )}

          {code && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                {tool === "Troubleshooting"
                  ? "🛠 Troubleshooting Steps"
                  : "🧾 Generated Output"}
              </h2>

              {typeof code === "object" ? (
                Object.entries(code).map(([filename, content], i) => {
                  const safeContent =
                    typeof content === "string"
                      ? content
                      : JSON.stringify(content);
                  return (
                    <div
                      key={i}
                      className="rounded bg-gray-100 dark:bg-gray-800"
                    >
                      <div className="font-semibold px-4 pt-4">{filename}</div>
                      <div className="p-4 overflow-x-auto">
                        <SyntaxHighlighter
                          language={getLanguage(filename)}
                          style={syntaxStyle}
                        >
                          {safeContent}
                        </SyntaxHighlighter>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 px-4 pb-4">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(safeContent)
                          }
                          className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          📋 Copy {filename}
                        </button>
                        <button
                          onClick={() =>
                            saveAs(
                              new Blob([safeContent], { type: "text/plain" }),
                              `codeweave-${filename}`
                            )
                          }
                          className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          📥 Download {filename}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800">
                  <SyntaxHighlighter
                    language={getLanguage(tool)}
                    style={syntaxStyle}
                    className="p-4 text-sm sm:text-base"
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              )}

              <button
                onClick={() => {
                  setCode("");
                  setPrompt("");
                }}
                className="w-full sm:w-auto bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-medium py-2 px-4 rounded hover:bg-red-200 dark:hover:bg-red-700 transition"
              >
                🔁 Reset
              </button>
            </div>
          )}
        </main>
        <Footer />
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </ClientWrapper>
  );
}
