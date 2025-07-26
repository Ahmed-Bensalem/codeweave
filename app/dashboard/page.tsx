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
import JSZip from "jszip";
import toast from "react-hot-toast";

type CodeOutput = string | Record<string, string>;

export default function Home() {
  const { limitReached, incrementUsage, triesLeft, limitError } =
    useLimitCheck();
  const { getToken } = useAuth();
  const [tool, setTool] = useState("Terraform");
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<CodeOutput>("");
  const [cleanedCode, setCleanedCode] = useState<CodeOutput>("");
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
    description: "Provision an S3 bucket, Lambda function, and DynamoDB table with Terraform.",
    suggestions: ["Provision an S3 bucket, Lambda function, and DynamoDB table with Terraform."],
  },
  {
    name: "Azure",
    icon: <FaMicrosoft />,
    description: "Deploy an Azure Kubernetes Service (AKS) cluster with autoscaling enabled.",
    suggestions: ["Deploy an Azure Kubernetes Service (AKS) cluster with autoscaling enabled."],
  },
  {
    name: "GCP",
    icon: <FaGoogle />,
    description: "Set up a GKE cluster and deploy a Node.js API behind a Cloud Load Balancer.",
    suggestions: ["Set up a GKE cluster and deploy a Node.js API behind a Cloud Load Balancer."],
  },
  {
    name: "Terraform",
    icon: <SiTerraform />,
    description: "Generate Terraform code to provision an EC2 instance with security groups.",
    suggestions: ["Generate Terraform code to provision an EC2 instance with security groups."],
  },
  {
    name: "Kubernetes",
    icon: <SiKubernetes />,
    description: "Deploy a Flask app with autoscaling and ConfigMaps in Kubernetes.",
    suggestions: ["Deploy a Flask app with autoscaling and ConfigMaps in Kubernetes."],
  },
  {
    name: "Docker",
    icon: <FaDocker />,
    description: "Create a Dockerfile for a FastAPI app with multi-stage builds and caching.",
    suggestions: ["Create a Dockerfile for a FastAPI app with multi-stage builds and caching."],
  },
  {
    name: "Helm",
    icon: <SiHelm />,
    description: "Create a Helm chart for deploying a multi-service app with ingress rules.",
    suggestions: ["Create a Helm chart for deploying a multi-service app with ingress rules."],
  },
  {
    name: "Flux",
    icon: <SiFlux />,
    description: "Set up a GitOps pipeline using Flux to sync Kubernetes manifests from GitHub.",
    suggestions: ["Set up a GitOps pipeline using Flux to sync Kubernetes manifests from GitHub."],
  },
  {
    name: "Ansible",
    icon: <SiAnsible />,
    description: "Write an Ansible playbook to install Docker and configure a firewall on Ubuntu.",
    suggestions: ["Write an Ansible playbook to install Docker and configure a firewall on Ubuntu."],
  },
  {
    name: "Vault",
    icon: <SiHashicorp />,
    description: "Use HashiCorp Vault to store and retrieve secrets for a production app.",
    suggestions: ["Use HashiCorp Vault to store and retrieve secrets for a production app."],
  },
  {
    name: "Jenkins",
    icon: <SiJenkins />,
    description: "Build a Jenkins pipeline to test, build, and deploy a Java microservice.",
    suggestions: ["Build a Jenkins pipeline to test, build, and deploy a Java microservice."],
  },
  {
    name: "Packer",
    icon: <SiPacker />,
    description: "Create a Packer template to build a custom AMI with NGINX and fail2ban.",
    suggestions: ["Create a Packer template to build a custom AMI with NGINX and fail2ban."],
  },
  {
    name: "Bash Script",
    icon: <FaTerminal />,
    description: "Write a bash script to back up logs and clean up temp files daily.",
    suggestions: ["Write a bash script to back up logs and clean up temp files daily."],
  },
  {
    name: "Python Script",
    icon: <FaPython />,
    description: "Build a Python script that renames files based on a CSV mapping.",
    suggestions: ["Build a Python script that renames files based on a CSV mapping."],
  },
  {
    name: "Go Script",
    icon: <SiGo />,
    description: "Create a Go CLI tool that monitors disk usage and sends alerts.",
    suggestions: ["Create a Go CLI tool that monitors disk usage and sends alerts."],
  },
  {
    name: "AWS Lambda",
    icon: <SiAwslambda />,
    description: "Create a Lambda function to resize uploaded S3 images using Python.",
    suggestions: ["Create a Lambda function to resize uploaded S3 images using Python."],
  },

  // --- GenAI ---
  {
    name: "Chatbot Builder",
    icon: <FaRobot />,
    description: "Create a chatbot that answers customer FAQs using a custom knowledge base.",
    suggestions: ["Create a chatbot that answers customer FAQs using a custom knowledge base."],
  },
  {
    name: "PDF / Document QA Bot",
    icon: <MdDocumentScanner />,
    description: "Build a QA bot that extracts answers from uploaded PDF invoices.",
    suggestions: ["Build a QA bot that extracts answers from uploaded PDF invoices."],
  },
  {
    name: "RAG Pipeline",
    icon: <FaDatabase />,
    description: "Create a RAG pipeline that uses Pinecone for vector storage and OpenAI for generation.",
    suggestions: ["Create a RAG pipeline that uses Pinecone for vector storage and OpenAI for generation."],
  },
  {
    name: "Data Preprocessing Pipeline",
    icon: <MdDataObject />,
    description: "Clean, normalize, and split a dataset of product reviews for fine-tuning.",
    suggestions: ["Clean, normalize, and split a dataset of product reviews for fine-tuning."],
  },
  {
    name: "FastAPI Backend for GenAI",
    icon: <FaCogs />,
    description: "Expose a GPT-4 based sentiment analyzer using FastAPI.",
    suggestions: ["Expose a GPT-4 based sentiment analyzer using FastAPI."],
  },
  {
    name: "Agent & Tool Builder",
    icon: <FaTools />,
    description: "Build an agent that scrapes job listings and updates a Notion table.",
    suggestions: ["Build an agent that scrapes job listings and updates a Notion table."],
  },
  {
    name: "Model Fine-Tuning Starter",
    icon: <SiOpenai />,
    description: "Fine-tune a LLaMA model on a custom dataset of financial documents.",
    suggestions: ["Fine-tune a LLaMA model on a custom dataset of financial documents."],
  },
  {
    name: "Model Training Pipeline",
    icon: <SiHuggingface />,
    description: "Build a training pipeline for a classification model using PyTorch and Hugging Face.",
    suggestions: ["Build a training pipeline for a classification model using PyTorch and Hugging Face."],
  },
  {
    name: "LLM Evaluation Toolkit",
    icon: <FaChartBar />,
    description: "Evaluate three LLMs using accuracy and latency benchmarks on a summarization task.",
    suggestions: ["Evaluate three LLMs using accuracy and latency benchmarks on a summarization task."],
  },
  {
    name: "LLM Deployment",
    icon: <FaRocket />,
    description: "Deploy a Falcon-7B model using Hugging Face Transformers and a GPU Docker container.",
    suggestions: ["Deploy a Falcon-7B model using Hugging Face Transformers and a GPU Docker container."],
  },
  {
    name: "Vector DB",
    icon: <FaDatabase />,
    description: "Set up a vector DB pipeline using FAISS to search support articles with embeddings.",
    suggestions: ["Set up a vector DB pipeline using FAISS to search support articles with embeddings."],
  },
  {
    name: "Streamlit Dashboard",
    icon: <SiPython />,
    description: "Build a Streamlit dashboard to visualize model performance metrics from a CSV.",
    suggestions: ["Build a Streamlit dashboard to visualize model performance metrics from a CSV."],
  },
  {
    name: "Streamlit App",
    icon: <SiPython />,
    description: "Create fast data apps or prototypes with a web interface.",
    suggestions: ["Create fast data apps or prototypes with a web interface."],
  },
  {
    name: "LangChain",
    icon: <FaRobot />,
    description: "Build a LangChain agent that queries a local PDF file and answers questions.",
    suggestions: ["Build a LangChain agent that queries a local PDF file and answers questions."],
  },
  {
    name: "Fine-tuning",
    icon: <SiOpenai />,
    description: "Improve models by training on custom labeled data.",
    suggestions: ["Improve models by training on custom labeled data."],
  },
  {
    name: "OpenAI API",
    icon: <SiOpenai />,
    description: "Use OpenAI API to summarize meeting transcripts into action items.",
    suggestions: ["Use OpenAI API to summarize meeting transcripts into action items."],
  },
  {
    name: "Hugging Face",
    icon: <SiHuggingface />,
    description: "Use pre-trained AI models or deploy your own on the HF Hub.",
    suggestions: ["Use pre-trained AI models or deploy your own on the HF Hub."],
  },
  {
    name: "Agent & Tools",
    icon: <FaTools />,
    description: "Combine agents with external tools to complete complex tasks.",
    suggestions: ["Combine agents with external tools to complete complex tasks."],
  },
  {
    name: "FastAPI Backend",
    icon: <FaCogs />,
    description: "Create API backends for serving logic, data, or models.",
    suggestions: ["Create API backends for serving logic, data, or models."],
  },

  // --- Troubleshooting ---
  {
    name: "Troubleshooting",
    icon: <FaBug />,
    description: "Identify, debug, and fix issues across your stack or codebase.",
    suggestions: ["Identify, debug, and fix issues across your stack or codebase."],
  },

  // --- Other ---
  {
    name: "Other",
    icon: <FaCogs />,
    description: "Build a tool that converts Markdown notes into a searchable SQLite DB.",
    suggestions: ["Build a tool that converts Markdown notes into a searchable SQLite DB."],
  },
];


  const selected = tools.find((t) => t.name === tool);
  const suggestions =
    selected?.suggestions?.filter((s) =>
      s.toLowerCase().includes(prompt.toLowerCase())
    ) || [];

  type CodeBlock = {
    language: string;
    code: string;
  };
  const extractCodeBlocks = (text: string): CodeBlock[] => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: CodeBlock[] = [];
    let match;
    while ((match = regex.exec(text))) {
      blocks.push({
        language: (match[1] || "").toLowerCase(),
        code: match[2].trim(),
      });
    }
    return blocks;
  };

  const handleGenerate = async () => {
    if (!prompt && !limitReached) return;

    if (limitReached) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setCode("");
    setError("");
    try {
      const token = await getToken();
      //console.log("Sending generate request with token:", token);
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
      // const cleanedCode =
      //   typeof generated === "string"
      //     ? generated
      //         .match(/```(?:[\s\S]*?)```/)?.[0]
      //         ?.replace(/```[\w]*\n?/, "")
      //         .replace(/```$/, "")
      //         .trim() || generated.trim()
      //     : generated;
      setCleanedCode(cleanDisplayOutput(generated));
      const cleanedCode =
        typeof generated === "string" ? generated.trim() : generated;
      setCode(cleanedCode || "No output returned.");

      if (plan === "free") {
        await incrementUsage();
        if (limitError) {
          setError(limitError);
        }
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
    if (tool.includes("Jenkins")) return "groovy";
    if (tool.includes("Packer")) return "hcl";
    if (tool.includes("Vault")) return "hcl";
    if (tool.includes("Fine-tuning") || tool.includes("LLM Evaluation"))
      return "json";
    if (
      tool.includes("FastAPI") ||
      tool.includes("LLM") ||
      tool.includes("LangChain")
    )
      return "python";
    return "text";
  };
  const getFileExtension = (input: string): string => {
    const val = (input || "").toLowerCase();

    if (["python", "py", "python script"].includes(val)) return "py";
    if (["bash", "shell", "sh", "bash script"].includes(val)) return "sh";
    if (["yaml", "yml", "helm", "flux"].includes(val)) return "yaml";
    if (["json"].includes(val)) return "json";
    if (["go", "golang", "go script"].includes(val)) return "go";
    if (["dockerfile", "docker"].includes(val)) return "Dockerfile";
    if (["hcl", "terraform"].includes(val)) return "tf";
    if (["jenkins", "jenkinsfile"].includes(val)) return "jenkinsfile";
    if (["packer", "pkr.hcl"].includes(val)) return "pkr.hcl";
    if (["text", "txt"].includes(val)) return "txt";
    if (
      [
        "fastapi",
        "openai api",
        "hugging face",
        "streamlit",
        "streamlit app",
        "langchain",
        "rag pipeline",
        "llm evaluation toolkit",
        "llm deployment",
        "agent & tool builder",
        "agent & tools",
        "fastapi backend",
        "fastapi backend for genai",
        "model fine-tuning starter",
        "model training pipeline",
        "fine-tuning",
      ].includes(val)
    )
      return "py";
    if (["ansible"].includes(val)) return "yml";
    if (["aws lambda"].includes(val)) return "py";
    if (
      [
        "pdf / document qa bot",
        "chatbot builder",
        "vector db",
        "data preprocessing pipeline",
      ].includes(val)
    )
      return "py";
    if (["markdown", "md"].includes(val)) return "md";
    if (["html", "web", "react"].includes(val)) return "html";

    if (val.includes("terraform")) return "tf";
    if (val.includes("docker")) return "Dockerfile";
    if (val.includes("vault")) return "hcl";
    if (val.includes("jenkins")) return "jenkinsfile";
    if (val.includes("packer")) return "pkr.hcl";
    if (val.includes("helm")) return "yaml";
    if (val.includes("flux")) return "yaml";
    if (val.includes("ansible")) return "yml";
    if (val.includes("bash")) return "sh";
    if (val.includes("python")) return "py";
    if (val.includes("go")) return "go";
    if (val.includes("yaml") || val.includes("yml")) return "yaml";
    if (val.includes("json")) return "json";

    return "txt";
  };
  function parseNamedCodeBlocks(text: string): Record<string, string> {
    const fileRegex =
      /(?:\*\*)?([a-zA-Z0-9_.\-]+\.\w+)(?:\*\*)?\s*:?\s*[\r\n]*```[\w+-]*[\r\n]+([\s\S]*?)```/g;

    const files: Record<string, string> = {};
    let match;

    while ((match = fileRegex.exec(text)) !== null) {
      const filename = match[1].trim();
      const content = match[2].trim();
      files[filename] = content;
    }

    return files;
  }
  function cleanDisplayOutput(text: string): string {
    return text
      .replace(/```[\w+-]*\s*\n?/g, "")
      .replace(/```/g, "")
      .replace(/\n*\.\.\.\s*$/g, "")
      .trim();
  }

  const handleDownload = async (tool: string, fullResponse: string) => {
    const namedFiles = parseNamedCodeBlocks(fullResponse);
    if (Object.keys(namedFiles).length > 0) {
      const zip = new JSZip();
      for (const [filename, content] of Object.entries(namedFiles)) {
        zip.file(filename, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `codeweave-${tool}.zip`);
      return;
    }

    const codeBlocks = extractCodeBlocks(fullResponse);
    if (codeBlocks.length === 0) {
      toast.error("No code blocks found to download.");
      return;
    }

    if (codeBlocks.length === 1) {
      const content = codeBlocks[0].code;
      const matchesMultiFile = content.match(/(^|\n)#\s+[\w.\-]+\.\w+/);
      if (matchesMultiFile) {
        const zip = new JSZip();
        const sections = content.split(/^---\s*$/gm);
        sections.forEach((section, i) => {
          const nameMatch = section.match(/^#\s+(.+?\.\w+)/);
          const filename =
            nameMatch?.[1]?.trim() || `file${i + 1}.${getFileExtension(tool)}`;
          const body = section.replace(/^#\s+.+?\.\w+/, "").trim();
          zip.file(filename, body);
        });
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, `codeweave-${tool}.zip`);
        return;
      }

      const ext = getFileExtension(codeBlocks[0].language || tool);
      const filename = ext === "Dockerfile" ? "Dockerfile" : `code.${ext}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      saveAs(blob, filename);
      return;
    }

    const zip = new JSZip();
    codeBlocks.forEach((block, i) => {
      const ext = getFileExtension(block.language || tool);
      const filename =
        ext === "Dockerfile" ? "Dockerfile" : `code${i + 1}.${ext}`;
      zip.file(filename, block.code);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `codeweave-${tool}.zip`);
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
                className={`relative flex items-center justify-between max-w-sm gap-2 p-4 rounded-lg shadow-md border text-sm transition m-auto sm:m-0 w-full ms:w-auto ${
                  t.name === tool
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white hover:border-indigo-300 hover:scale-105"
                } dark:bg-gray-800`}
              >
                <div className="flex items-center justify-center">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
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
                    </h3>
                    <p
                      className={`text-sm ${
                        t.name === tool
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {" "}
                      {/* {t.description} */}
                    </p>
                  </div>
                </div>
                {proTools.includes(t.name) &&
                  !["pro", "teams"].includes(plan) && (
                    <span
                      className="ml-1 translate-y-[-2px] text-yellow-500 cursor-help"
                      title="Pro Feature – Upgrade to unlock"
                    >
                      👑
                    </span>
                  )}
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
                  maxLength={8000}
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
                  className="w-full max-h-[400px] min-h-[180px] p-3 border rounded dark:bg-gray-700 dark:text-white overflow-auto resize-y"
                />

                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {prompt.length.toLocaleString()} / 8,000
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute translate-y-[-20px] left-0 right-0 max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-20 divide-y divide-gray-100 dark:divide-gray-700">
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
                    <li className="px-5 py-3 text-sm text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer transition">
                      Got your own idea? Type it here!
                    </li>
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
                      onClick={() => {
                        if (typeof code === "string") {
                          handleDownload(tool, code);
                        } else {
                          const zip = new JSZip();
                          Object.entries(code).forEach(
                            ([filename, content]) => {
                              const safeContent =
                                typeof content === "string"
                                  ? content
                                  : JSON.stringify(content, null, 2);
                              zip.file(filename, safeContent);
                            }
                          );

                          zip
                            .generateAsync({ type: "blob" })
                            .then((content) => {
                              saveAs(content, `codeweave-${tool}.zip`);
                            });
                        }
                      }}
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
                    {cleanedCode || code}
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
