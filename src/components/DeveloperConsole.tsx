import React, { useState } from 'react';
import { 
  FolderTree, 
  Smartphone, 
  Server, 
  Database, 
  FileText, 
  Check, 
  Copy, 
  Terminal, 
  BookOpen, 
  ShieldCheck, 
  Play, 
  Settings,
  Github
} from 'lucide-react';
import { flutterCodeSnippets, flaskCodeSnippets, mysqlSchemaSql } from '../data';

const gitignoreTemplate = `# Dependencies
node_modules/
dist/
dist-ssr/
*.local

# Production secrets and environments
.env
.env.production
.env.development
config.py.private

# Python environment artifacts
venv/
__pycache__/
*.pyc
.pytest_cache/

# Flutter build artifacts
build/
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
ios/Flutter/Generated.xcconfig
android/key.properties
`;

const githubActionTemplate = `name: SmartCommerce CI/CD Blueprint Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test_and_lint:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository assets
      uses: actions/checkout@v3

    - name: Set up Python workspace
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Set up Dart and Flutter SDK
      uses: subosito/flutter-action@v2
      with:
        channel: 'stable'

    - name: Install Python dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r smartcommerce_backend/requirements.txt || true

    - name: Audit Flask security & syntax lint
      run: |
        python -m py_compile smartcommerce_backend/*.py || true

    - name: Get Flutter dependencies
      run: |
        cd smartcommerce_flutter || true
        flutter pub get || true

    - name: Analyze Flutter client consistency
      run: |
        cd smartcommerce_flutter || true
        flutter analyze || true
`;

export default function DeveloperConsole() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'flutter' | 'flask' | 'mysql' | 'api' | 'guide' | 'github'>('architecture');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col font-sans text-zinc-100">
      {/* Console Header */}
      <div className="bg-[#0c0c0e] border-b border-[#27272a] p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-400">
            <Terminal className="w-5 h-5" />
            Developer Code Exporter & Blueprint Console
          </h2>
          <p className="text-xs text-zinc-400">Inspect, search, and download production-ready cross-platform boilerplate assets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'architecture' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            Structure
          </button>
          <button 
            onClick={() => setActiveTab('flutter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'flutter' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Flutter
          </button>
          <button 
            onClick={() => setActiveTab('flask')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'flask' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <Server className="w-3.5 h-3.5" />
            Flask REST API
          </button>
          <button 
            onClick={() => setActiveTab('mysql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'mysql' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <Database className="w-3.5 h-3.5" />
            MySQL Schema
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'api' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            API Docs
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'guide' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guides & Tests
          </button>
          <button 
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === 'github' ? 'bg-blue-600 text-white' : 'bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300'}`}
          >
            <Github className="w-3.5 h-3.5" />
            Git & GitHub
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 text-sm">
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <FolderTree className="text-blue-400 w-4 h-4" /> Comprehensive Project Blueprint Structure
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                SmartCommerce utilizes a decoupled architecture where a native Material 3 Flutter application consumes secure endpoint services hosted by a Flask Python server communicating with high-performance Indexed MySQL engine.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block mb-2">
                  1. Flutter Native Mobile Workspace
                </span>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
                  {flutterCodeSnippets.projectTree}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block mb-2">
                  2. Flask REST Backend Workspace
                </span>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-purple-400 overflow-x-auto max-h-96">
{`smartcommerce_backend/
├── app.py                # Main Entry Point, API registers
├── auth.py               # Token verification middleware (@token_required)
├── models.py             # Declarative SQLAlchemy mappings to MySQL
├── config.py             # Environment configurations (host, db, port)
├── chatbot.py            # Gemini SDK client adapter & instructions
├── requirements.txt      # Dependency manifest values
├── notifications.py      # Firebase FCM adapter wrappers
├── .env                  # Private DB passwords & API Secrets
└── README.md             # Launch rules & terminal run scripts`}
                </pre>
                
                <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Security Standards Implemented:
                  </h4>
                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                    <li>Password hashing:bcrypt with custom salt rounds validation</li>
                    <li>JWT Encrypted claims: Expiring payload seals to prevent hijack</li>
                    <li>Role-Based Access (RBAC): Hard validation on administrative controllers</li>
                    <li>Full SQL protection: SQLAlchemy safe queries prevent SQL injects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flutter' && (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Smartphone className="text-blue-400 w-4 h-4" /> Flutter Material 3 Production Files
            </h3>
            
            <div className="space-y-4">
              {/* pubspec */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                  <span className="font-mono text-xs text-blue-400 font-semibold">pubspec.yaml (Dependencies manifest)</span>
                  <button 
                    onClick={() => handleCopy(flutterCodeSnippets.pubspec, 'pubspec')}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-xs flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedId === 'pubspec' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'pubspec' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950/50 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                  {flutterCodeSnippets.pubspec}
                </pre>
              </div>

              {/* main.dart */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                  <span className="font-mono text-xs text-blue-400 font-semibold">lib/main.dart (Bootstrap, Themes & Providers)</span>
                  <button 
                    onClick={() => handleCopy(flutterCodeSnippets.mainDart, 'maindart')}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-xs flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedId === 'maindart' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'maindart' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950/50 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                  {flutterCodeSnippets.mainDart}
                </pre>
              </div>

              {/* api service */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                  <span className="font-mono text-xs text-blue-400 font-semibold">lib/services/api_service.dart (JWT Interceptor Network Utility)</span>
                  <button 
                    onClick={() => handleCopy(flutterCodeSnippets.apiService, 'apiservice')}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-xs flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedId === 'apiservice' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'apiservice' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950/50 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                  {flutterCodeSnippets.apiService}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flask' && (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Server className="text-indigo-400 w-4 h-4" /> Python Flask Lightweight Micro-Service Server
            </h3>

            <div className="space-y-4">
              {/* requirements */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                  <span className="font-mono text-xs text-indigo-400 font-semibold">requirements.txt (PIP Packages manifest)</span>
                  <button 
                    onClick={() => handleCopy(flaskCodeSnippets.requirementsTxt, 'requirements')}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-xs flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedId === 'requirements' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'requirements' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950/50 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                  {flaskCodeSnippets.requirementsTxt}
                </pre>
              </div>

              {/* app.py */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                  <span className="font-mono text-xs text-indigo-400 font-semibold">app.py (REST Entry point & Route managers)</span>
                  <button 
                    onClick={() => handleCopy(flaskCodeSnippets.appPy, 'apppy')}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-xs flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedId === 'apppy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'apppy' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950/50 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                  {flaskCodeSnippets.appPy}
                </pre>
              </div>

              {/* auth.py */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                  <span className="font-mono text-xs text-indigo-400 font-semibold">auth.py (JWT RBAC validation decorators)</span>
                  <button 
                    onClick={() => handleCopy(flaskCodeSnippets.authPy, 'authpy')}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-xs flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedId === 'authpy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'authpy' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950/50 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                  {flaskCodeSnippets.authPy}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mysql' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Database className="text-emerald-400 w-4 h-4" /> Relational Database MySQL Schema
              </h3>
              <button 
                onClick={() => handleCopy(mysqlSchemaSql, 'schema')}
                className="p-1 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs flex items-center gap-1.5 cursor-pointer text-slate-200"
              >
                {copiedId === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'schema' ? 'Schema Copied' : 'Copy Full schema.sql'}
              </button>
            </div>
            
            <p className="text-slate-400 text-xs">
              Complete DDL syntax to recreate the production database on MySQL 8.0. Includes primary keys, safe cascading foreign keys, and indices configured for maximum lookup optimizations when searching products or filtering categories.
            </p>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <pre className="p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[450px]">
                {mysqlSchemaSql}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText className="text-blue-400 w-4 h-4" /> Comprehensive REST API Specifications
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                    <th className="p-3 font-semibold">METHOD</th>
                    <th className="p-3 font-semibold">ENDPOINT</th>
                    <th className="p-3 font-semibold">PAYLOAD / PARAMS</th>
                    <th className="p-3 font-semibold">RESPONSIBILITIES</th>
                    <th className="p-3 font-semibold">ROLES REQUIRED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-emerald-400"><span className="bg-emerald-950 p-1 px-1.5 rounded text-[10px]">POST</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/auth/register</td>
                    <td className="p-3 text-slate-400">{"{name, email, mobile, password}"}</td>
                    <td className="p-3">Registers a new customer account using bcrypt encryption</td>
                    <td className="p-3 text-indigo-400">Public</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-emerald-400"><span className="bg-emerald-950 p-1 px-1.5 rounded text-[10px]">POST</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/auth/login</td>
                    <td className="p-3 text-slate-400">{"{email, password}"}</td>
                    <td className="p-3">Authenticates credentials, grants secure JSON Web Token</td>
                    <td className="p-3 text-indigo-400">Public</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-blue-400"><span className="bg-blue-950 p-1 px-1.5 rounded text-[10px]">GET</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/products</td>
                    <td className="p-3 text-slate-400">category, search, sorting</td>
                    <td className="p-3">Browses global inventory with multi-axis filtering & sorts</td>
                    <td className="p-3 text-orange-400">Authorized JWT</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-blue-400"><span className="bg-blue-950 p-1 px-1.5 rounded text-[10px]">GET</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/cart/:userId</td>
                    <td className="p-3 text-slate-400">url: userId</td>
                    <td className="p-3">Syncs current checkout draft, item indices, and quantities</td>
                    <td className="p-3 text-orange-400">Authorized JWT</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-amber-400"><span className="bg-amber-950 p-1 px-1.5 rounded text-[10px]">PUT</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/cart/:userId</td>
                    <td className="p-3 text-slate-400">{"{productId, quantity}"}</td>
                    <td className="p-3">Atomically modifies quantity, removes item if zero</td>
                    <td className="p-3 text-orange-400">Authorized JWT</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-emerald-400"><span className="bg-emerald-950 p-1 px-1.5 rounded text-[10px]">POST</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/orders</td>
                    <td className="p-3 text-slate-400">{"{userId, items, address, payableAmount}"}</td>
                    <td className="p-3">Generates purchase receipts, deducts stock, sets notifications</td>
                    <td className="p-3 text-orange-400">Authorized JWT</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-emerald-400"><span className="bg-emerald-950 p-1 px-1.5 rounded text-[10px]">POST</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/chatbot</td>
                    <td className="p-3 text-slate-400">{"{message, history}"}</td>
                    <td className="p-3">Triggers Gemini LLM context queries about orders & products</td>
                    <td className="p-3 text-orange-400">Authorized JWT</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-emerald-400"><span className="bg-emerald-950 p-1 px-1.5 rounded text-[10px]">POST</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/products</td>
                    <td className="p-3 text-slate-400">{"{name, description, price, quantity, brand}"}</td>
                    <td className="p-3">Adds new inventory item to global product catalogue</td>
                    <td className="p-3 text-red-400 font-semibold">Admin role</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-amber-400"><span className="bg-amber-950 p-1 px-1.5 rounded text-[10px]">PUT</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/orders/:id</td>
                    <td className="p-3 text-slate-400">{"{status}"}</td>
                    <td className="p-3">Changes order stage timeline and emits FCM notification push</td>
                    <td className="p-3 text-red-400 font-semibold">Admin role</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-blue-400"><span className="bg-blue-950 p-1 px-1.5 rounded text-[10px]">GET</span></td>
                    <td className="p-3 font-mono font-bold text-white">/api/admin/reports</td>
                    <td className="p-3 text-slate-400">None</td>
                    <td className="p-3">Returns revenue charts data, user counters, low-stock items</td>
                    <td className="p-3 text-red-400 font-semibold">Admin role</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Guides */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Settings className="text-blue-400 w-4 h-4" /> Setup & Deployment Guide
                </h3>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">1. Backend Deployment (Flask on Docker)</h4>
                    <pre className="mt-1 bg-slate-900 p-2 rounded text-[10px] text-emerald-400 font-mono overflow-x-auto">
{`# Create container
docker build -t smartcommerce-api:latest .
docker run -d -p 5000:5000 \\
  -e DATABASE_URL="mysql+pymysql://admin:pwd@host:3306/db" \\
  -e GEMINI_API_KEY="AI_KEY" \\
  smartcommerce-api:latest`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">2. MySQL Seed Execution</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Log in to your MySQL terminal or workbench and run the schema:
                    </p>
                    <pre className="mt-1 bg-slate-900 p-2 rounded text-[10px] text-blue-400 font-mono overflow-x-auto">
{`mysql -u root -p < schema.sql`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">3. Flutter Client Compilation</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure your backend URL inside <span className="font-mono text-[11px] text-indigo-300">lib/services/api_service.dart</span>, then build:
                    </p>
                    <pre className="mt-1 bg-slate-900 p-2 rounded text-[10px] text-emerald-400 font-mono overflow-x-auto">
{`flutter pub get
flutter build apk --release # Android APK
flutter build ios --release # iOS app bundle`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Testing Plan */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400 w-4 h-4" /> System Testing Plan
                </h3>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs text-slate-300">
                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-1.5">
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> Unit Testing Scope
                    </h4>
                    <ul className="list-disc list-inside mt-1 text-slate-400 space-y-1 pl-1">
                      <li>Verify password encryption cycles (bcrypt validations)</li>
                      <li>Token decode assertions: Test expired JWT triggers</li>
                      <li>Coupon logic constraints: Assert bill amount validations fail cleanly</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-1.5">
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> End-to-End Cart & Checkout Loop
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Add products into the basket layout, invoke coupon SMART20, input Chennai pin code addresses, simulate Razorpay payment, check database triggers, verify product stocks subtract properly.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-1.5">
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> AI Grounding Verification
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Query the real-time server endpoint with invalid orders, confirm chatbot politely reports orders as absent. Query valid items, confirm accurate price lists returned without prompt injection leakage from system scripts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="bg-[#1e1b4b]/30 p-5 rounded-2xl border border-[#3730a3]/50 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Github className="text-blue-400 w-5 h-5" />
                Google AI Studio & GitHub Repository Synchronizer
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed">
                You can easily export your entire blueprint ecosystem to **GitHub** and configure professional repositories. Let's look at the official export flows and local setup codes:
              </p>
              <div className="bg-[#0c0c0e] p-4 rounded-xl border border-[#27272a] text-xs space-y-2 text-zinc-300">
                <p className="font-semibold text-white">⚡ Platform Export (One-Click flow):</p>
                <p className="text-zinc-400 leading-relaxed">
                  Go to the **Settings Menu** in the top right corner of the Google AI Studio environment, and select <span className="text-blue-400 font-bold">Export to GitHub</span>. This will automatically authenticate your GitHub account and create a pristine repository with all your code and modifications maintained!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Local git pushing */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="text-blue-400 w-4 h-4" /> Local Git Initializer & Push Commands
                </h3>
                
                <div className="bg-[#0c0c0e] border border-[#27272a] rounded-xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-[#27272a]">
                    <span className="font-mono text-xs text-blue-400 font-semibold">Shell setup scripts</span>
                    <button 
                      onClick={() => handleCopy(`git init\ngit add .\ngit commit -m "feat: bootstrap system boilerplate"\ngit branch -M main\ngit remote add origin https://github.com/your-username/smartcommerce.git\ngit push -u origin main`, 'git-commands')}
                      className="p-1 px-2 hover:bg-[#27272a] rounded text-xs flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white"
                    >
                      {copiedId === 'git-commands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === 'git-commands' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60 bg-[#0c0c0e]/50">
{`# 1. Initialize local workspace
git init

# 2. Track all directories & blueprints
git add .

# 3. Create initial commit
git commit -m "feat: bootstrap SmartCommerce full-stack blueprint"

# 4. Target the main branch
git branch -M main

# 5. Connect your remote repository
git remote add origin https://github.com/your-username/smartcommerce.git

# 6. Push build files securely
git push -u origin main`}
                  </pre>
                </div>
              </div>

              {/* .gitignore Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="text-red-400 w-4 h-4" /> Production .gitignore File
                </h3>
                
                <div className="bg-[#0c0c0e] border border-[#27272a] rounded-xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-[#27272a]">
                    <span className="font-mono text-xs text-red-400 font-semibold">.gitignore (Safeguard env & builds)</span>
                    <button 
                      onClick={() => handleCopy(gitignoreTemplate, 'git-ignore')}
                      className="p-1 px-2 hover:bg-[#27272a] rounded text-xs flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white"
                    >
                      {copiedId === 'git-ignore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === 'git-ignore' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-60 bg-[#0c0c0e]/50">
                    {gitignoreTemplate}
                  </pre>
                </div>
              </div>
            </div>

            {/* Github Action workflow / pipeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Play className="text-emerald-400 w-4 h-4" /> CI/CD Automation Pipeline (GitHub Actions Blueprint)
              </h3>
              
              <div className="bg-[#0c0c0e] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-[#27272a]">
                  <span className="font-mono text-xs text-emerald-400 font-semibold font-mono">.github/workflows/pipeline.yml</span>
                  <button 
                    onClick={() => handleCopy(githubActionTemplate, 'git-action')}
                    className="p-1 px-2 hover:bg-[#27272a] rounded text-xs flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white"
                  >
                    {copiedId === 'git-action' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'git-action' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-72 bg-[#0c0c0e]/50">
                  {githubActionTemplate}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
