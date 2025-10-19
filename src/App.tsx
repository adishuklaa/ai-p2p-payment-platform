import React, { useState } from 'react';
import { CreditCard, Send, ArrowDownToLine, Clock, AlertTriangle, CheckCircle, XCircle, Search, ShieldAlert, History, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Synthetic Data
const mockTransactions = [
  { id: 'tx-001', type: 'send', amount: 150.00, recipient: 'Alice Johnson', status: 'completed', date: '2026-09-24 10:30', notes: 'Dinner split' },
  { id: 'tx-002', type: 'request', amount: 45.00, recipient: 'Bob Smith', status: 'pending', date: '2026-09-23 14:15', notes: 'Movie tickets' },
  { id: 'tx-003', type: 'send', amount: 500.00, recipient: 'Charlie Davis', status: 'failed', date: '2026-09-22 09:00', notes: 'Rent portion', error: 'Insufficient funds' },
  { id: 'tx-004', type: 'send', amount: 25.50, recipient: 'Dana Lee', status: 'completed', date: '2026-09-21 18:45', notes: 'Coffee' },
  { id: 'tx-005', type: 'send', amount: 1200.00, recipient: 'Eve Carter', status: 'pending', date: '2026-09-20 11:20', notes: 'Laptop buy', error: 'Risk hold' },
];

const activityData = [
  { name: 'Mon', amount: 120 },
  { name: 'Tue', amount: 250 },
  { name: 'Wed', amount: 180 },
  { name: 'Thu', amount: 500 },
  { name: 'Fri', amount: 300 },
  { name: 'Sat', amount: 150 },
  { name: 'Sun', amount: 400 },
];

const mockContacts = [
  { id: 'c1', name: 'Alice Johnson', handle: '@alicej' },
  { id: 'c2', name: 'Bob Smith', handle: '@bobsm' },
  { id: 'c3', name: 'Charlie Davis', handle: '@charlied' },
  { id: 'c4', name: 'Dana Lee', handle: '@danalee' },
  { id: 'c5', name: 'Eve Carter', handle: '@evec' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'disputes'>('dashboard');
  const [balance, setBalance] = useState(2450.75);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [dailyLimit, setDailyLimit] = useState({ used: 800, total: 2000 });

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'send' | 'request'>('send');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed' | 'risk_hold'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentState('processing');

    // Simulate payment logic
    setTimeout(() => {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setPaymentState('failed');
        setErrorMessage('Invalid amount');
        return;
      }
      if (paymentType === 'send' && numAmount > balance) {
        setPaymentState('failed');
        setErrorMessage('Insufficient funds');
        return;
      }
      if (paymentType === 'send' && numAmount + dailyLimit.used > dailyLimit.total) {
        setPaymentState('failed');
        setErrorMessage('Daily limit exceeded');
        return;
      }
      if (numAmount > 1000) {
        setPaymentState('risk_hold');
        setErrorMessage('Transaction flagged for review');
        const newTx = {
          id: `tx-${Date.now()}`, type: paymentType, amount: numAmount, recipient, status: 'pending', date: new Date().toISOString().replace('T', ' ').substring(0, 16), notes, error: 'Risk hold'
        };
        setTransactions([newTx, ...transactions]);
        return;
      }

      // Success
      if (paymentType === 'send') {
        setBalance(prev => prev - numAmount);
        setDailyLimit(prev => ({ ...prev, used: prev.used + numAmount }));
      }
      const newTx = {
        id: `tx-${Date.now()}`, type: paymentType, amount: numAmount, recipient, status: paymentType === 'send' ? 'completed' : 'pending', date: new Date().toISOString().replace('T', ' ').substring(0, 16), notes
      };
      setTransactions([newTx, ...transactions]);
      setPaymentState('success');
    }, 1500);
  };

  const resetModal = () => {
    setShowPaymentModal(false);
    setPaymentState('idle');
    setRecipient('');
    setAmount('');
    setNotes('');
    setErrorMessage('');
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 text-indigo-600">
          <Activity className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">PayFlow AI</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: CreditCard, label: 'Dashboard' },
            { id: 'history', icon: History, label: 'Transactions' },
            { id: 'disputes', icon: ShieldAlert, label: 'Disputes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">JD</div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">@johndoe</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => { setPaymentType('request'); setShowPaymentModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
            >
              <ArrowDownToLine className="w-4 h-4" /> Request
            </button>
            <button
              onClick={() => { setPaymentType('send'); setShowPaymentModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
            >
              <Send className="w-4 h-4" /> Send Money
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg col-span-2">
                <p className="text-indigo-100 text-sm font-medium mb-1">Available Balance</p>
                <h3 className="text-4xl font-bold mb-6">${balance.toFixed(2)}</h3>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">Daily Limit Used</p>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400" style={{ width: `${(dailyLimit.used / dailyLimit.total) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium">${dailyLimit.used} / ${dailyLimit.total}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                </div>
              </div>

              {/* Velocity / AI Insights */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">AI Velocity Check</h4>
                    <p className="text-xs text-gray-500">Normal activity pattern</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transactions Today</span>
                    <span className="font-medium">4 / 10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Risk Score</span>
                    <span className="font-medium text-green-600">Low (12/100)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts & Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6">Activity Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <button onClick={() => setActiveTab('history')} className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 3).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                        {tx.recipient.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{tx.recipient}</p>
                        <p className="text-xs text-gray-500">{tx.notes} • {tx.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={cn("font-semibold", tx.type === 'send' ? 'text-gray-900' : 'text-green-600')}>
                          {tx.type === 'send' ? '-' : '+'}${tx.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 justify-end text-xs text-gray-500 capitalize">
                          <StatusIcon status={tx.status} /> {tx.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search transactions..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
            <table className="w-full text-left">
               <thead>
                 <tr className="text-gray-500 text-sm border-b">
                   <th className="pb-3 font-medium">Transaction</th>
                   <th className="pb-3 font-medium">Type</th>
                   <th className="pb-3 font-medium">Date</th>
                   <th className="pb-3 font-medium">Status</th>
                   <th className="pb-3 font-medium text-right">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {transactions.map(tx => (
                   <tr key={tx.id} className="hover:bg-gray-50">
                     <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">{tx.recipient.charAt(0)}</div>
                          <div>
                            <p className="font-medium text-sm">{tx.recipient}</p>
                            <p className="text-xs text-gray-500">{tx.notes}</p>
                          </div>
                        </div>
                     </td>
                     <td className="py-4 text-sm capitalize text-gray-600">{tx.type}</td>
                     <td className="py-4 text-sm text-gray-500">{tx.date}</td>
                     <td className="py-4">
                       <span className={cn(
                         "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                         tx.status === 'completed' && "bg-green-50 text-green-700",
                         tx.status === 'pending' && "bg-yellow-50 text-yellow-700",
                         tx.status === 'failed' && "bg-red-50 text-red-700"
                       )}>
                         {tx.status}
                       </span>
                       {tx.error && <p className="text-xs text-red-500 mt-1">{tx.error}</p>}
                     </td>
                     <td className={cn("py-4 text-sm font-semibold text-right", tx.type === 'send' ? 'text-gray-900' : 'text-green-600')}>
                        {tx.type === 'send' ? '-' : '+'}${tx.amount.toFixed(2)}
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
           </div>
        )}

        {activeTab === 'disputes' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Dispute Center</h3>
                <p className="text-sm text-gray-500">Manage and track your disputed transactions.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100">
                File New Dispute
              </button>
            </div>
            <div className="text-center py-12">
              <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-gray-900 font-medium mb-1">No Active Disputes</h4>
              <p className="text-gray-500 text-sm">You haven't filed any disputes recently.</p>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            {paymentState === 'idle' && (
              <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold capitalize">{paymentType} Money</h3>
                  <button onClick={resetModal} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <input 
                      type="text" required 
                      value={recipient} onChange={e => setRecipient(e.target.value)}
                      placeholder="Name, @handle, or Email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                      {mockContacts.map(c => (
                        <button type="button" key={c.id} onClick={() => setRecipient(c.handle)} className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input 
                      type="number" step="0.01" required
                      value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0.00" 
                      className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What's it for? (Optional)</label>
                    <input 
                      type="text" 
                      value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Dinner last night" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md transition-colors">
                      Confirm {paymentType === 'send' ? 'Payment' : 'Request'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {paymentState === 'processing' && (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900">Processing...</h3>
                <p className="text-sm text-gray-500 mt-2">Securely processing your transaction</p>
              </div>
            )}

            {paymentState === 'success' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                <p className="text-gray-500 mb-8">
                  {paymentType === 'send' ? `Successfully sent $${amount} to ${recipient}` : `Requested $${amount} from ${recipient}`}
                </p>
                <button onClick={resetModal} className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200">
                  Done
                </button>
              </div>
            )}

            {paymentState === 'failed' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-gray-500 mb-8">{errorMessage}</p>
                <button onClick={() => setPaymentState('idle')} className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200">
                  Try Again
                </button>
              </div>
            )}

            {paymentState === 'risk_hold' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Security Review</h3>
                <p className="text-gray-500 mb-8">Transaction flagged for security review. It is currently pending.</p>
                <button onClick={resetModal} className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
