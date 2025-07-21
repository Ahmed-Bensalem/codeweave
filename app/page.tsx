'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useAuth } from '@clerk/nextjs';

import {
  FaDocker, FaCode, FaSpinner, FaTerminal, FaPython, FaBug,
  FaAws, FaMicrosoft, FaGoogle,
} from 'react-icons/fa';
import {
  SiTerraform, SiKubernetes, SiAnsible, SiHelm, SiPacker, SiHashicorp,
  SiFlux, SiJenkins, SiAwslambda, SiOpenai, SiHuggingface, SiGo, SiPython,
} from 'react-icons/si';

import Header from './components/Header';
import Footer from './components/Footer';
import useLimitCheck from './components/LimitChecker';
import ClientWrapper from './components/ClientWrapper';

type CodeOutput = string | Record<string, string>;

export default function Home() {
  const { limitReached, incrementUsage } = useLimitCheck();
  const { getToken } = useAuth();
  const [tool, setTool] = useState('Terraform');
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState<CodeOutput>(''); 
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  const tools = [
    { name: 'AWS', icon: <FaAws />, suggestions: ['Launch EC2 instance', 'Create S3 bucket'] },
    { name: 'Azure', icon: <FaMicrosoft />, suggestions: ['Deploy VM', 'Configure Blob Storage'] },
    { name: 'GCP', icon: <FaGoogle />, suggestions: ['Create GKE cluster', 'Cloud Function setup'] },
    { name: 'Terraform', icon: <SiTerraform />, suggestions: ['VPC with subnets', 'S3 backend config'] },
    { name: 'Kubernetes', icon: <SiKubernetes />, suggestions: ['Deployments & Services'] },
    { name: 'Docker', icon: <FaDocker />, suggestions: ['Multi-stage Dockerfile', 'Node.js Dockerfile'] },
    { name: 'Ansible', icon: <SiAnsible />, suggestions: ['Nginx playbook'] },
    { name: 'Helm', icon: <SiHelm />, suggestions: ['Helm chart for Redis'] },
    { name: 'Packer', icon: <SiPacker />, suggestions: ['Build AMI from Ubuntu'] },
    { name: 'Vault', icon: <SiHashicorp />, suggestions: ['Secrets engine'] },
    { name: 'Flux', icon: <SiFlux />, suggestions: ['HelmRelease example'] },
    { name: 'Jenkins', icon: <SiJenkins />, suggestions: ['Maven pipeline'] },
    { name: 'Bash Script', icon: <FaTerminal />, suggestions: ['Startup script'] },
    { name: 'Python Script', icon: <FaPython />, suggestions: ['boto3 automation'] },
    { name: 'Go Script', icon: <SiGo />, suggestions: ['Simple web server'] },
    { name: 'AWS Lambda', icon: <SiAwslambda />, suggestions: ['SAM template'] },
    { name: 'OpenAI API', icon: <SiOpenai />, suggestions: ['Chat completion'] },
    { name: 'Hugging Face', icon: <SiHuggingface />, suggestions: ['Text classification'] },
    { name: 'LangChain', icon: <FaCode />, suggestions: ['LangChain agent'] },
    { name: 'RAG', icon: <FaCode />, suggestions: ['Retrieval pipeline'] },
    { name: 'Vector DB', icon: <FaCode />, suggestions: ['Qdrant or FAISS index'] },
    { name: 'RAG Pipeline', icon: <FaCode />, suggestions: ['RAG with Pinecone'] },
    { name: 'Fine-tuning', icon: <SiOpenai />, suggestions: ['OpenAI fine-tune'] },
    { name: 'LLM Deployment', icon: <FaCode />, suggestions: ['FastAPI + LLM'] },
    { name: 'Agent & Tools', icon: <FaCode />, suggestions: ['Tool use example'] },
    { name: 'Streamlit App', icon: <SiPython />, suggestions: ['PDF Q&A chatbot'] },
    { name: 'FastAPI Backend', icon: <FaCode />, suggestions: ['REST API server'] },
    { name: 'Other', icon: <FaCode />, suggestions: ['Convert YAML to JSON', 'System design diagram'] },
    { name: 'Troubleshooting', icon: <FaBug />, suggestions: ['CrashLoopBackOff', 'Docker build fails'] },
  ];

  const selected = tools.find((t) => t.name === tool);
  const suggestions = selected?.suggestions?.filter((s) =>
    s.toLowerCase().includes(prompt.toLowerCase())
  ) || [];

  const handleGenerate = async () => {
    if (!prompt || limitReached) return;
    setLoading(true);
    setCode('');
    setError('');
    try {
      const token = await getToken();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ tool, prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || 'Server error');
        return;
      }

      const { code: generated } = await res.json();
      setCode(generated || 'No output returned.');
      incrementUsage();
    } catch (err) {
      setError('Error connecting to backend.');
    }
    setLoading(false);
    setShowSuggestions(false);
  };

  const syntaxStyle =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? atomOneDark
      : docco;

  const getLanguage = (tool: string): string => {
    if (tool.includes('Terraform')) return 'hcl';
    if (tool.includes('Python')) return 'python';
    if (tool.includes('Bash')) return 'bash';
    if (tool.includes('Docker')) return 'dockerfile';
    if (tool.includes('Kubernetes') || tool.includes('Helm')) return 'yaml';
    if (tool.includes('Go')) return 'go';
    if (tool.includes('FastAPI') || tool.includes('LLM') || tool.includes('LangChain')) return 'python';
    return 'text';
  };

  return (
    <ClientWrapper>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tools.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTool(t.name);
                  setPrompt('');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition ${
                  t.name === tool
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white hover:border-indigo-400'
                }`}
              >
                {t.icon} <span className="truncate">{t.name}</span>
              </button>
            ))}
          </div>

          <textarea
            value={prompt}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setPrompt(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Describe your setup or issue to fix..."
            className="w-full h-32 p-3 border rounded dark:bg-gray-700 dark:text-white"
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onMouseDown={() => {
                    setPrompt(s);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || limitReached}
            className={`w-full sm:w-auto flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition ${
              loading || limitReached ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {limitReached ? '🚫 Limit reached' : loading ? <FaSpinner className="animate-spin" /> : '⚙️ Generate'}
          </button>

          {error && (
            <div className="text-red-600 dark:text-red-400 font-semibold">
              ❌ {error}
            </div>
          )}

          {code && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                {tool === 'Troubleshooting' ? '🛠 Troubleshooting Steps' : '🧾 Generated Output'}
              </h2>

              {typeof code === 'object' ? (
                Object.entries(code).map(([filename, content], i) => {
                  const safeContent = typeof content === 'string' ? content : JSON.stringify(content);
                  return (
                    <div key={i} className="rounded bg-gray-100 dark:bg-gray-800">
                      <div className="font-semibold px-4 pt-4">{filename}</div>
                      <div className="p-4 overflow-x-auto">
                        <SyntaxHighlighter language={getLanguage(filename)} style={syntaxStyle}>
                          {safeContent}
                        </SyntaxHighlighter>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 px-4 pb-4">
                        <button
                          onClick={() => navigator.clipboard.writeText(safeContent)}
                          className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          📋 Copy {filename}
                        </button>
                        <button
                          onClick={() =>
                            saveAs(new Blob([safeContent], { type: 'text/plain' }), `codeweave-${filename}`)
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
                  <SyntaxHighlighter language={getLanguage(tool)} style={syntaxStyle} className="p-4 text-sm sm:text-base">
                    {code}
                  </SyntaxHighlighter>
                </div>
              )}

              <button
                onClick={() => {
                  setCode('');
                  setPrompt('');
                }}
                className="w-full sm:w-auto bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-medium py-2 px-4 rounded hover:bg-red-200 dark:hover:bg-red-700 transition"
              >
                🔁 Reset
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ClientWrapper>
  );
}
