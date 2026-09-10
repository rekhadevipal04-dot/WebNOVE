import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  FileText,
  Upload,
  Download,
  Eye,
  BarChart3,
  History,
  Calendar,
  LogOut,
  User,
  Key,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  HardDrive,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import {
  ClientUser,
  EncryptedDocument,
  HistoricalAuditRecord,
  AnalyticsData,
  ConsultationBooking,
} from '../types/index.ts';
import {
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  ANALYTICS_SAMPLE_DATA,
} from '../data/webnovaData.ts';

interface ClientPortalProps {
  currentUser: ClientUser | null;
  onLogin: (user: ClientUser) => void;
  onLogout: () => void;
  bookings: ConsultationBooking[];
  onOpenBooking: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  currentUser,
  onLogin,
  onLogout,
  bookings,
  onOpenBooking,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'analytics' | 'history' | 'appointments'>('vault');
  const [documents, setDocuments] = useState<EncryptedDocument[]>(INITIAL_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<HistoricalAuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [analyticsData] = useState<AnalyticsData>(ANALYTICS_SAMPLE_DATA);

  // Auth Form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginCompany, setLoginCompany] = useState('');

  // Upload modal state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<EncryptedDocument['category']>('Contract');
  const [uploadFileName, setUploadFileName] = useState('');
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);

  // Document details modal
  const [previewDoc, setPreviewDoc] = useState<EncryptedDocument | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [docSearch, setDocSearch] = useState('');

  // Interactive chart state
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any | null>(null);

  const demoAccounts: ClientUser[] = [
    {
      id: 'usr-1',
      name: 'Client Account',
      email: 'client@webnova.in',
      company: 'Client Workspace',
      role: 'Account Administrator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      activeTier: 'Enterprise Growth Tier',
      phone: '+91 95198 32055',
    },
    {
      id: 'usr-2',
      name: 'Partner Account',
      email: 'partner@webnova.in',
      company: 'Partner Workspace',
      role: 'Collaborator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      activeTier: 'E-Commerce Scale Tier',
      phone: '+91 95198 32055',
    },
  ];

  const handleDemoLogin = (account: ClientUser) => {
    onLogin(account);
    onShowToast('success', 'Authenticated Successfully', `Welcome back to ${account.company}`);
  };

  const handleCustomAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      onShowToast('error', 'Authentication Failed', 'Please enter your email address.');
      return;
    }

    const newUser: ClientUser = {
      id: `usr-${Date.now()}`,
      name: loginName || (loginEmail.split('@')[0].toUpperCase()),
      email: loginEmail,
      company: loginCompany || 'Verified Client Co.',
      role: 'Client Representative',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      activeTier: 'Verified Client Tier',
      phone: '+91 95198 32055',
    };

    onLogin(newUser);
    onShowToast('success', 'Secure Session Established', `Welcome to the WEBNOVA Client Portal.`);
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = uploadFileName || selectedFileObj?.name || 'Client-Document.pdf';

    // Simulated cryptographic SHA-256 hash generator
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newDoc: EncryptedDocument = {
      id: `doc-${Date.now()}`,
      name: finalName,
      category: uploadCategory,
      fileSize: selectedFileObj ? `${(selectedFileObj.size / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
      uploadedAt: 'Today (Just now)',
      status: 'Verified',
      encryptionHash: randomHex,
    };

    const newAuditLog: HistoricalAuditRecord = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action: 'Document Upload & AES Encryption',
      actor: currentUser?.name || 'Client Representative',
      ipAddress: '157.34.122.84 (Mumbai, IN)',
      status: 'authenticated',
      details: `File "${finalName}" encrypted and stored with SHA-256 verification.`,
    };

    setDocuments([newDoc, ...documents]);
    setAuditLogs([newAuditLog, ...auditLogs]);
    setIsUploading(false);
    setUploadFileName('');
    setSelectedFileObj(null);
    onShowToast('success', 'Document Encrypted & Uploaded', `File verified with SHA-256 hash checksum.`);
  };

  const handleDownloadDoc = (doc: EncryptedDocument) => {
    const fakeContent = `WEBNOVA CLIENT DOCUMENT ARCHIVE
Document Name: ${doc.name}
Category: ${doc.category}
Verification Status: ${doc.status}
SHA-256 Checksum: ${doc.encryptionHash}
Uploaded: ${doc.uploadedAt}
Authorized Client: ${currentUser?.name || 'WEBNOVA Client'} (${currentUser?.company || 'Authorized Enterprise'})
Encryption Standard: AES-256-GCM Enterprise Vault`;

    const blob = new Blob([fakeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onShowToast('info', 'Document Decrypted', `File ${doc.name} securely downloaded to your device.`);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <section id="portal" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            <span>CLIENT PORTAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Client Portal
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Document management, real-time project analytics, and verified consultation records.
          </p>
        </div>

        {!currentUser ? (
          /* Authentication Screen */
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Client Access Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your authorized credentials or use 1-click test accounts below
              </p>
            </div>

            {/* Quick 1-Click Demo Accounts */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
                Quick 1-Click Demo Accounts (Instant Test):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleDemoLogin(acc)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 hover:border-blue-300 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {acc.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {acc.company}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Sign In / Sign Up Form */}
            <form onSubmit={handleCustomAuth} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nexus FinTech"
                      value={loginCompany}
                      onChange={(e) => setLoginCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {authMode === 'login' ? 'Sign In to Client Portal' : 'Create Client Account'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {authMode === 'login'
                    ? 'New enterprise client? Register for an account'
                    : 'Already have credentials? Sign In'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-6">
            {/* Top User Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-blue-500/20">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                      {currentUser.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold">
                      Authenticated Session
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentUser.role} • <strong className="text-slate-700 dark:text-slate-300">{currentUser.company}</strong>
                  </p>
                </div>
              </div>

              {/* Encryption Status & Logout */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-mono flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>AES-256-GCM ACTIVE</span>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock &amp; Exit</span>
                </button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('vault')}
                className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'vault'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>Document Vault ({documents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Performance Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Audit &amp; Historical Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'appointments'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Scheduled Consultations ({bookings.length})</span>
              </button>
            </div>

            {/* TAB 1: DOCUMENT VAULT */}
            {activeTab === 'vault' && (
              <div className="space-y-4">
                {/* Actions & Search Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter documents by name or category..."
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => setIsUploading(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                </div>

                {/* Document Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Document Name</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Size</th>
                          <th className="py-3 px-4">Uploaded</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredDocs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                              No documents matched your filter query.
                            </td>
                          </tr>
                        ) : (
                          filteredDocs.map((doc) => (
                            <tr
                              key={doc.id}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                                    {doc.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                                  {doc.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px]">{doc.fileSize}</td>
                              <td className="py-3.5 px-4 text-slate-400 text-[11px]">{doc.uploadedAt}</td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    doc.status === 'Verified' || doc.status === 'Paid'
                                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                      : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                  }`}
                                >
                                  {doc.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setPreviewDoc(doc)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                    title="View Encryption & Checksum"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDownloadDoc(doc)}
                                    className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400"
                                    title="Download Document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERFORMANCE ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* KPI Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Monthly Organic Visitors
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {analyticsData.monthlyVisitors.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-emerald-500">
                        +{analyticsData.monthlyVisitorsGrowth}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">vs preceding period</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Avg Conversion Rate
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {analyticsData.conversionRate}%
                      </span>
                      <span className="text-xs font-bold text-emerald-500">
                        +{analyticsData.conversionRateGrowth}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Inbound Leads &amp; Checkout</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Core Web Vitals
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {analyticsData.webVitalsScore}/100
                      </span>
                      <span className="text-xs font-bold text-blue-500">
                        {analyticsData.avgLoadTime}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Google Search Score</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Marketing ROAS
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {analyticsData.roasMultiplier}x
                      </span>
                      <span className="text-xs font-bold text-emerald-500">High Return</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Return on Ad Spend</span>
                  </div>
                </div>

                {/* Interactive SVG Chart */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                        30-Day Growth &amp; Engagement Trajectory
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Daily visitor velocity and qualified conversion actions
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <span className="text-slate-600 dark:text-slate-300">Visitors</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-300">Leads Generated</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="relative h-56 w-full">
                    <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="40" x2="700" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                      <line x1="0" y1="140" x2="700" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                      <line x1="0" y1="190" x2="700" y2="190" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

                      {/* Area Fill */}
                      <path
                        d="M 20 160 L 120 130 L 220 110 L 320 95 L 420 70 L 520 50 L 650 30 L 650 190 L 20 190 Z"
                        fill="url(#visitorGradient)"
                      />

                      {/* Line: Visitors */}
                      <path
                        d="M 20 160 L 120 130 L 220 110 L 320 95 L 420 70 L 520 50 L 650 30"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Line: Leads */}
                      <path
                        d="M 20 178 L 120 165 L 220 150 L 320 138 L 420 120 L 520 102 L 650 88"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="4 2"
                      />

                      {/* Interactive Data Points */}
                      {analyticsData.dailyTraffic.map((pt, idx) => {
                        const cx = 20 + idx * 105;
                        const cy = 160 - idx * 21.5;
                        return (
                          <g key={pt.day}>
                            <circle
                              cx={cx}
                              cy={cy}
                              r="5"
                              fill="#2563EB"
                              className="cursor-pointer hover:r-7 transition-all"
                              onMouseEnter={() => setHoveredDataPoint(pt)}
                              onMouseLeave={() => setHoveredDataPoint(null)}
                            />
                            <text
                              x={cx}
                              y="198"
                              fontSize="10"
                              textAnchor="middle"
                              fill="#94A3B8"
                              className="font-mono"
                            >
                              {pt.day}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {hoveredDataPoint && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-slate-700 pointer-events-none font-mono">
                        {hoveredDataPoint.day}: {hoveredDataPoint.visitors.toLocaleString()} visitors • {hoveredDataPoint.leads} leads
                      </div>
                    )}
                  </div>
                </div>

                {/* Two columns: Traffic Sources & Active Sprint Milestones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Sources */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                      Acquisition Channels Breakdown
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.trafficSources.map((src, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {src.name}
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {src.percentage}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${src.percentage}%`,
                                backgroundColor: src.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sprint Progress */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                      Development &amp; Optimization Sprint
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.projectMilestones.map((m) => (
                        <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                              {m.title}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                m.status === 'completed'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                              }`}
                            >
                              {m.progress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mt-1.5">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${m.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AUDIT & HISTORICAL LOGS */}
            {activeTab === 'history' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Tamper-Evident Access Audit Log
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      All system logins, vault downloads, and contract sign-offs are cryptographically logged.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                    Integrity 100%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp (UTC)</th>
                        <th className="py-2.5 px-3">Action Event</th>
                        <th className="py-2.5 px-3">Actor</th>
                        <th className="py-2.5 px-3">IP / Location</th>
                        <th className="py-2.5 px-3">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {log.details}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                            {log.actor}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {log.ipAddress}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SCHEDULED CONSULTATIONS */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Your Scheduled Initial Consultations
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Direct strategy meetings with Anand Pal &amp; Suryapartap Pal
                    </p>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Book New Slot
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-xs font-medium">No consultations scheduled yet.</p>
                    <button
                      onClick={onOpenBooking}
                      className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Schedule your first discussion now →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                            Ref: {b.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                            {b.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                            {b.serviceType}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {b.date} at {b.timeSlot} ({b.timezone})
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <a
                            href={b.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>Open Video Room</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a
                            href={`https://wa.me/919519832055?text=Hello%20WEBNOVA,%20checking%20status%20for%20consultation%20${b.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            WhatsApp Desk
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload Document Modal */}
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-1">
                Upload &amp; Encrypt Document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Files are automatically processed with AES-256 encryption and cryptographic hashing.
              </p>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileObj(e.target.files[0]);
                        setUploadFileName(e.target.files[0].name);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-blue-300 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scope-Of-Work-Addendum.pdf"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category Tag
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Contract">Contract / Master Agreement</option>
                    <option value="Invoice">Invoice / Billing Receipt</option>
                    <option value="Architecture">Technical Spec / Architecture</option>
                    <option value="SEO Report">SEO &amp; Growth Audit</option>
                    <option value="Audit">Security &amp; Compliance Audit</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploading(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Encrypt &amp; Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Document Details & Hash Check Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Cryptographic Verification
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Document Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{previewDoc.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Category</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{previewDoc.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Encryption Status</span>
                    <span className="font-semibold text-emerald-500">AES-256-GCM Verified</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 block text-[10px] uppercase">SHA-256 Hash Checksum</span>
                    <button
                      onClick={() => handleCopyHash(previewDoc.encryptionHash)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[10px] break-all text-slate-700 dark:text-slate-300 select-all">
                    {previewDoc.encryptionHash}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadDoc(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
