'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'bash' }: React.PropsWithChildren<Props>): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `code.${language}`;
    link.click();
  };

  return (
    <div className="relative mt-6">
      <div className="absolute top-2 right-3 flex gap-2">
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="text-xs px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Download
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{ paddingTop: '2.5rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
