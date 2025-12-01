import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Upload, FileText, Download, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TextMaker() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      // In a real app, you would read the file content here
      // For demo purposes, we'll just set some sample text
      setText("This is sample text extracted from the uploaded document. In a real application, this would contain the actual content of the uploaded file.");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would call your summarization API here
    // For demo purposes, we'll generate a simple summary
    const sentences = text.split('. ').filter(s => s.trim().length > 0);
    const summarySentences = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 3)));
    setSummary(summarySentences.join('. ') + '.');
    setIsProcessing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Document Summarizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a document or paste text to generate a concise summary
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Input
              </h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Document
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOCX, TXT files
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </div>
                {file && (
                  <p className="text-sm text-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              
              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Or paste text directly
                </label>
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Paste your text here..."
                />
              </div>
              
              <button
                onClick={handleSummarize}
                disabled={!text.trim() || isProcessing}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
            
            {/* Output Section */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Summary
                </h2>
                {summary && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/10 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/10 rounded-lg transition-colors"
                      title="Download summary"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              {summary ? (
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{summary}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your summary will appear here after processing
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}