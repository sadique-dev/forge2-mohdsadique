import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Ticket as TicketIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Inbox,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    open: 0,
    pending: 0,
    resolved: 0,
    closed: 0,
    breached: 0,
    unassigned: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('/api/v1/tickets');
        // If paginated, res.data.data has the items
        const ticketList = res.data.data || res.data || [];
        setTickets(ticketList);
        calculateMetrics(ticketList);
      } catch (err) {
        console.error("Failed to load dashboard tickets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const calculateMetrics = (list) => {
    let total = list.length;
    let open = 0;
    let pending = 0;
    let resolved = 0;
    let closed = 0;
    let breached = 0;
    let unassigned = 0;

    list.forEach(t => {
      if (t.status === 'open') open++;
      else if (t.status === 'pending') pending++;
      else if (t.status === 'resolved') resolved++;
      else if (t.status === 'closed') closed++;

      if (t.sla && t.sla.breached) {
        breached++;
      }

      if (!t.assignee_id) {
        unassigned++;
      }
    });

    setMetrics({ total, open, pending, resolved, closed, breached, unassigned });
  };

  const activeCount = metrics.open + metrics.pending;
  const breachRate = metrics.total > 0 ? Math.round((metrics.breached / metrics.total) * 100) : 0;
  const resolutionRate = metrics.total > 0 ? Math.round(((metrics.resolved + metrics.closed) / metrics.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        <Clock className="w-8 h-8 animate-spin mr-3 text-purple-500" />
        <span>Loading dashboard metrics...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Active Tickets', value: activeCount, description: `${metrics.open} Open, ${metrics.pending} Pending`, icon: TicketIcon, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Resolved Tickets', value: metrics.resolved + metrics.closed, description: 'Completed and archived', icon: CheckCircle2, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { label: 'SLA Breaches', value: metrics.breached, description: `Breach rate: ${breachRate}%`, icon: AlertTriangle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { label: 'Unassigned', value: metrics.unassigned, description: 'Waiting for claim', icon: Inbox, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Hello, {user?.name}!</h3>
          <p className="text-slate-400 text-sm mt-1">Here is what is happening with your organization support tickets today.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold">Resolution Rate: {resolutionRate}%</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`p-6 border rounded-2xl bg-slate-950 flex flex-col justify-between ${card.color.split(' ').slice(1).join(' ')}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
                <span className={`p-2 rounded-lg ${card.color.split(' ')[0]} bg-slate-900 border border-slate-800`}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-extrabold text-white tracking-tight">{card.value}</h4>
                <p className="text-xs text-slate-500 mt-1">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets List */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-md font-bold text-white">Recent Tickets</h4>
            <Link to="/tickets" className="text-xs text-purple-400 font-semibold hover:underline">View all</Link>
          </div>

          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No tickets recorded in this organization yet.</p>
            ) : (
              tickets.slice(0, 5).map(t => (
                <div key={t.id} className="p-4 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/70 rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex flex-col min-w-0 pr-4">
                    <Link to={`/tickets/${t.id}`} className="text-sm font-bold text-slate-200 hover:text-purple-400 truncate hover:underline">
                      {t.subject}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">By {t.requester?.name}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className="text-[10px] text-slate-500">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Priority Badge */}
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${
                      t.priority === 'urgent' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : t.priority === 'high' 
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                          : t.priority === 'medium'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>
                      {t.priority}
                    </span>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md ${
                      t.status === 'open' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : t.status === 'pending' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : t.status === 'resolved' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                            : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SLA Breach Watchlist */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-red-400" />
            <h4 className="text-md font-bold text-white">SLA Breach Warning</h4>
          </div>

          <div className="space-y-4 flex-1">
            {tickets.filter(t => t.sla && t.sla.breached && t.status !== 'resolved' && t.status !== 'closed').length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-xs">No active tickets are currently in breach of SLA policies.</p>
              </div>
            ) : (
              tickets.filter(t => t.sla && t.sla.breached && t.status !== 'resolved' && t.status !== 'closed').slice(0, 4).map(t => (
                <div key={t.id} className="p-3 bg-red-950/15 border border-red-900/20 rounded-xl flex flex-col gap-1.5">
                  <div className="flex justify-between items-start">
                    <Link to={`/tickets/${t.id}`} className="text-xs font-bold text-red-200 hover:underline truncate w-40">
                      {t.subject}
                    </Link>
                    <span className="text-[9px] bg-red-900/30 text-red-400 border border-red-800/40 px-1.5 py-0.5 rounded uppercase font-bold">
                      Breached
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Resolution target passed on {t.sla?.resolution_due_at ? new Date(t.sla.resolution_due_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
