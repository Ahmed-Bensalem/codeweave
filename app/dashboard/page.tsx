"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomOneDark,
  docco,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  FaAws,
  FaMicrosoft,
  FaGoogle,
  FaDocker,
  FaTerminal,
  FaPython,
  FaBug,
  FaRobot,
  FaDatabase,
  FaTools,
  FaCogs,
  FaRocket,
  FaChartBar,
  FaSpinner,
  FaRegCopy,
  FaDownload,
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
  SiGo,
  SiAwslambda,
  SiOpenai,
  SiHuggingface,
  SiPython,
} from "react-icons/si";
import { MdDocumentScanner, MdDataObject } from "react-icons/md";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useLimitCheck from "../components/LimitChecker";
import ClientWrapper from "../components/ClientWrapper";
import UpgradeModal from "../components/UpgradeModal";
import PremiumModal from "../components/PremiumModal";

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [toolChanged, setToolChanged] = useState(false);

  const { user } = useUser();
  const plan = (user?.unsafeMetadata?.plan as string) || "free";
  const isPremiumToolLocked = (toolName: string) =>
    proTools.includes(toolName) && !["pro", "teams"].includes(plan);

  const proTools = [
    "Model Fine-Tuning Starter",
    "Model Training Pipeline",
    "LLM Evaluation Toolkit",
    "LLM Deployment",
    "Vector DB",
    "Vault",
    "Jenkins",
    "AWS Lambda",
    "Bash Script",
    "Packer",
    "Azure",
    "GCP",
  ];

  const tools = [
    // --- DevOps ---
    {
      name: "AWS",
      icon: <FaAws />,
      description:
        "Provision an S3 bucket, Lambda function, and DynamoDB table with Terraform.",
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
      description:
        "Deploy an Azure Kubernetes Service (AKS) cluster with autoscaling enabled.",
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
        "Set up a GKE cluster and deploy a Node.js API behind a Cloud Load Balancer.",
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
        "Generate Terraform code to provision an EC2 instance with security groups.",
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
      description:
        "Deploy a Flask app with autoscaling and ConfigMaps in Kubernetes.",
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
        "Create a Dockerfile for a FastAPI app with multi-stage builds and caching.",
      suggestions: [
        "Write Dockerfiles",
        "Build images",
        "Run containers",
        "Optimize app environments",
      ],
    },
    {
      name: "Helm",
      icon: <SiHelm />,
      description:
        "Create a Helm chart for deploying a multi-service app with ingress rules.",
      suggestions: [
        "Write Helm charts",
        "Templatize configurations",
        "Install apps to K8s",
        "Version your releases",
      ],
    },
    {
      name: "Flux",
      icon: <SiFlux />,
      description:
        "Set up a GitOps pipeline using Flux to sync Kubernetes manifests from GitHub.",
      suggestions: [
        "Set up GitOps pipelines",
        "Define sync rules",
        "Automate cluster state",
        "Deploy from Git",
      ],
    },
    {
      name: "Ansible",
      icon: <SiAnsible />,
      description:
        "Write an Ansible playbook to install Docker and configure a firewall on Ubuntu.",
      suggestions: [
        "Configure environments",
        "Write playbooks",
        "Manage remote systems",
        "Deploy services",
      ],
    },
    {
      name: "Vault",
      icon: <SiHashicorp />,
      description:
        "Use HashiCorp Vault to store and retrieve secrets for a production app.",
      suggestions: [
        "Create secrets engines",
        "Manage API tokens",
        "Integrate with apps",
        "Secure sensitive data",
      ],
    },
    {
      name: "Jenkins",
      icon: <SiJenkins />,
      description:
        "Build a Jenkins pipeline to test, build, and deploy a Java microservice.",
      suggestions: [
        "Build delivery pipelines",
        "Trigger builds",
        "Automate testing",
        "Deploy code changes",
      ],
    },
    {
      name: "Packer",
      icon: <SiPacker />,
      description:
        "Create a Packer template to build a custom AMI with NGINX and fail2ban.",
      suggestions: [
        "Define image templates",
        "Create AMIs",
        "Automate image builds",
        "Use provisioning scripts",
      ],
    },
    {
      name: "Bash Script",
      icon: <FaTerminal />,
      description:
        "Write a bash script to back up logs and clean up temp files daily.",
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
      description:
        "Build a Python script that renames files based on a CSV mapping.",
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
      description:
        "Create a Go CLI tool that monitors disk usage and sends alerts.",
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
      description:
        "Create a Lambda function to resize uploaded S3 images using Python.",
      suggestions: [
        "Write Lambda handlers",
        "Respond to triggers",
        "Connect to APIs",
        "Run on-demand code",
      ],
    },

    // --- GenAI ---
    {
      name: "Chatbot Builder",
      icon: <FaRobot />,
      description:
        "Create a chatbot that answers customer FAQs using a custom knowledge base.",
      suggestions: [
        "Build a chatbot",
        "Add conversational memory",
        "Customize chat flow",
        "Enable AI assistance",
      ],
    },
    {
      name: "PDF / Document QA Bot",
      icon: <MdDocumentScanner />,
      description:
        "Build a QA bot that extracts answers from uploaded PDF invoices.",
      suggestions: [
        "Answer questions from files",
        "Extract key details",
        "Enable document interaction",
        "Process uploaded PDFs",
      ],
    },
    {
      name: "RAG Pipeline",
      icon: <FaDatabase />,
      description:
        "Create a RAG pipeline that uses Pinecone for vector storage and OpenAI for generation.",
      suggestions: [
        "Retrieve relevant content",
        "Embed documents",
        "Connect with vector DB",
        "Use external knowledge",
      ],
    },
    {
      name: "Data Preprocessing Pipeline",
      icon: <MdDataObject />,
      description:
        "Clean, normalize, and split a dataset of product reviews for fine-tuning.",
      suggestions: [
        "Clean raw data",
        "Convert file formats",
        "Handle missing values",
        "Engineer features",
      ],
    },
    {
      name: "FastAPI Backend for GenAI",
      icon: <FaCogs />,
      description: "Expose a GPT-4 based sentiment analyzer using FastAPI.",
      suggestions: [
        "Create backend API",
        "Serve GenAI apps",
        "Secure endpoints",
        "Handle requests and auth",
      ],
    },
    {
      name: "Agent & Tool Builder",
      icon: <FaTools />,
      description:
        "Build an agent that scrapes job listings and updates a Notion table.",
      suggestions: [
        "Design tool-using agent",
        "Automate workflows",
        "Add tool chaining",
        "Enable autonomous execution",
      ],
    },
    {
      name: "Model Fine-Tuning Starter",
      icon: <SiOpenai />,
      description:
        "Fine-tune a LLaMA model on a custom dataset of financial documents.",
      suggestions: [
        "Prepare fine-tuning data",
        "Adjust model behavior",
        "Upload training set",
        "Start fine-tune workflow",
      ],
    },
    {
      name: "Model Training Pipeline",
      icon: <SiHuggingface />,
      description:
        "Build a training pipeline for a classification model using PyTorch and Hugging Face.",
      suggestions: [
        "Train ML models",
        "Evaluate results",
        "Save checkpoints",
        "Log experiment metrics",
      ],
    },
    {
      name: "LLM Evaluation Toolkit",
      icon: <FaChartBar />,
      description:
        "Evaluate three LLMs using accuracy and latency benchmarks on a summarization task.",
      suggestions: [
        "Grade LLM responses",
        "Run evaluation suite",
        "Log evaluation metrics",
        "Test AI outputs",
      ],
    },
    {
      name: "LLM Deployment",
      icon: <FaRocket />,
      description:
        "Deploy a Falcon-7B model using Hugging Face Transformers and a GPU Docker container.",
      suggestions: [
        "Expose model endpoints",
        "Run inference servers",
        "Handle scale",
        "Connect with apps",
      ],
    },
    {
      name: "Vector DB",
      icon: <FaDatabase />,
      description:
        "Set up a vector DB pipeline using FAISS to search support articles with embeddings.",
      suggestions: [
        "Build semantic search",
        "Store document vectors",
        "Use FAISS or Qdrant",
        "Integrate with RAG",
      ],
    },
    {
      name: "Streamlit Dashboard",
      icon: <SiPython />,
      description:
        "Build a Streamlit dashboard to visualize model performance metrics from a CSV.",
      suggestions: [
        "Create interactive UI",
        "Visualize outputs",
        "Build data apps",
        "Deploy tools with UI",
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
      name: "LangChain",
      icon: <FaRobot />,
      description:
        "Build a LangChain agent that queries a local PDF file and answers questions.",
      suggestions: [
        "Use chains",
        "Integrate memory",
        "Add tools",
        "Customize workflows",
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
      name: "OpenAI API",
      icon: <SiOpenai />,
      description:
        "Use OpenAI API to summarize meeting transcripts into action items.",
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
      name: "Agent & Tools",
      icon: <FaTools />,
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
      name: "FastAPI Backend",
      icon: <FaCogs />,
      description: "Create API backends for serving logic, data, or models.",
      suggestions: [
        "Build web APIs",
        "Serve AI functions",
        "Expose endpoints",
        "Add user auth",
      ],
    },

    // --- Troubleshooting ---
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

    // --- Other ---
    {
      name: "Other",
      icon: <FaCogs />,
      description:
        "Build a tool that converts Markdown notes into a searchable SQLite DB.",
      suggestions: [
        "Convert files",
        "Format data",
        "Generate diagrams",
        "Support misc workflows",
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
      const cleanedCode =
        typeof generated === "string"
          ? generated
              .match(/```(?:[\s\S]*?)```/)?.[0]
              ?.replace(/```[\w]*\n?/, "")
              .replace(/```$/, "")
              .trim() || generated.trim() // fallback to full response if no code block
          : generated;
      setCode(cleanedCode || "No output returned.");

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
  const getFileExtension = (tool: string): string => {
    if (tool.includes("Terraform")) return "tf";
    if (
      tool.includes("Python") ||
      tool.includes("FastAPI") ||
      tool.includes("LLM") ||
      tool.includes("LangChain")
    )
      return "py";
    if (tool.includes("Bash")) return "sh";
    if (tool.includes("Docker")) return "Dockerfile";
    if (tool.includes("Kubernetes") || tool.includes("Helm")) return "yaml";
    if (tool.includes("Go")) return "go";
    return "txt";
  };

  return (
    <ClientWrapper>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-full mx-8 p-0 sm:p-6 lg:p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center pt-2 text-blue-600">
            Select Your DevOps & AI Focus Areas
          </h1>
          <p className="text-lg text-center pb-4 text-gray-700 dark:text-gray-300">
            Select your DevOps and AI focus areas to generate code, streamline
            workflows, and accelerate delivery with AI-powered automation
          </p>
          <div className="flex justify-center mb-6">
            <button
              onClick={() =>
                document
                  .getElementById("copilot")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                fontSize: "12px",
                fontFamily: "sans-serif",
                backgroundColor: "#1D4ED8",
                borderRadius: "6px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 13px",
                cursor: "pointer",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              Launch Copilot
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tools.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  if (isPremiumToolLocked(t.name)) {
                    setShowPremiumModal(true);
                  } else {
                    setToolChanged(true);
                    setTool(t.name);
                    setPrompt("");
                  }
                }}
                className={`relative flex items-start max-w-sm gap-2 p-4 rounded-lg shadow-md border text-sm transition m-auto sm:m-0 ${
                  t.name === tool
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white hover:border-indigo-300 hover:scale-105"
                } dark:bg-gray-800`}
              >
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mt-[6px]">
                  {t.icon}
                </div>
                <div className="ml-3 text-left">
                  <h3
                    className={`flex justify-between items-start text-base font-semibold gap-2 ${
                      t.name === tool
                        ? "text-white"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {t.name}
                    {proTools.includes(t.name) &&
                      !["pro", "teams"].includes(plan) && (
                        <span
                          className="ml-1 translate-y-[-2px] text-yellow-500 cursor-help"
                          title="Pro Feature – Upgrade to unlock"
                        >
                          👑
                        </span>
                      )}
                  </h3>
                  <p
                    className={`text-sm ${
                      t.name === tool
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {" "}
                    {t.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="w-full sm:w-[70%] flex flex-col mx-auto" id="copilot">
            <div className="flex flex-col items-center py-4">
              <h1 className="text-4xl font-bold text-center py-3 text-blue-600">
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
                  placeholder={
                    toolChanged
                      ? tools.find((t) => t.name === tool)?.description ?? ""
                      : "Describe your setup or issue to fix..."
                  }
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
              className={`flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded transition
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
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  {tool === "Troubleshooting"
                    ? "🛠 Troubleshooting Steps"
                    : "🧾 Generated Output"}
                </h2>

                {typeof code === "string" && (
                  <div className="flex items-center gap-3 text-xl">
                    <FaRegCopy
                      className="cursor-pointer hover:text-blue-600 transition"
                      title="Copy code"
                      onClick={() => navigator.clipboard.writeText(code)}
                    />
                    <FaDownload
                      className="cursor-pointer hover:text-blue-600 transition"
                      title="Download code"
                      onClick={() =>
                        saveAs(
                          new Blob([code], { type: "text/plain" }),
                          `codeweave-${tool}.${getFileExtension(tool)}`
                        )
                      }
                    />
                  </div>
                )}
              </div>

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
          <div className="!mb-5 sm:mb-0 text-xs text-gray-500 mt-5 text-center">
            Powered by <span className="font-semibold">CodeWeave</span> – Your
            AI-powered DevOps Partner
          </div>
        </main>
        <Footer />
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
      </div>
    </ClientWrapper>
  );
}
