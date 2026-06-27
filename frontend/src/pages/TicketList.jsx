import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  X,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TicketList = () => {
  const { user } = useAuth();
  
  // State
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        assignee_id: assigneeId || undefined,
      };
      
      const res = await axios.get('/api/v1/tickets', { params });
      
      if (res.data.data) {
        setTickets(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else {
        setTickets(res.data || []);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get('/api/v1/users');
      // Filter out only agents and admins for assignee list
      const agentList = (res.data || []).filter(u => u.role === 'agent' || u.role === 'admin');
      setAgents(agentList);
    } catch (err) {
      console.error("Failed to load organization members", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, status, priority, assigneeId]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      setModalError('Subject and description are required.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      // Split tags by comma
      const tagsArray = newTags 
        ? newTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

      await axios.post('/api/v1/tickets', {
        subject,
        description,
        priority: newPriority,
        tags: tagsArray
      });

      // Reset form and reload
      setSubject('');
      setDescription('');
      setNewPriority('medium');
      setNewTags('');
      setShowModal(false);
      setPage(1);
      fetchTickets();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-2xl">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search tickets by subject or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all duration-200"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-2" />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="bg-transparent text-xs font-semibold text-slate-300 outline-none pr-2 py-1.5 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-2" />
            <select
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(1); }}
              className="bg-transparent text-xs font-semibold text-slate-300 outline-none pr-2 py-1.5 cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Assignee filter */}
          {user?.role !== 'customer' && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500 mr-2" />
              <select
                value={assigneeId}
                onChange={(e) => { setAssigneeId(e.target.value); setPage(1); }}
                className="bg-transparent text-xs font-semibold text-slate-300 outline-none pr-2 py-1.5 cursor-pointer"
              >
                <option value="">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Add Ticket Button */}
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto lg:ml-0 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <Clock className="w-8 h-8 animate-spin mr-3 text-purple-500" />
            <span>Loading tickets list...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 text-slate-500 space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto" />
            <h4 className="font-bold text-slate-300">No Tickets Found</h4>
            <p className="text-sm">Try modifying your query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Requester</th>
                  <th className="py-4 px-6">Assignee</th>
                  <th className="py-4 px-6">SLA Status</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-900/20 text-slate-300 transition-colors">
                    <td className="py-4 px-6 max-w-xs md:max-w-md">
                      <div className="flex flex-col min-w-0">
                        <Link to={`/tickets/${t.id}`} className="text-sm font-bold text-slate-100 hover:text-purple-400 truncate hover:underline">
                          {t.subject}
                        </Link>
                        <span className="text-xs text-slate-500 truncate mt-1">{t.description}</span>
                        {/* Tags */}
                        {t.tags && t.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {t.tags.map(tag => (
                              <span key={tag.id} className="px-1.5 py-0.5 bg-slate-850 border border-slate-800 text-[9px] rounded text-slate-400 font-semibold">
                                #{tag.tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{t.requester?.name}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {t.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-900/50 border border-purple-800 flex items-center justify-center text-[10px] text-purple-300 font-bold">
                            {t.assignee.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-200 font-medium">{t.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs">
                      {t.sla ? (
                        t.sla.breached ? (
                          <span className="px-2 py-1 bg-red-950/20 text-red-400 border border-red-900/30 rounded-md font-bold uppercase tracking-wider text-[9px]">
                            Breached
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-950/20 text-green-400 border border-green-900/30 rounded-md font-bold uppercase tracking-wider text-[9px]">
                            Within SLA
                          </span>
                        )
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <span className={`px-2 py-0.5 uppercase font-bold tracking-wider rounded border ${
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
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md ${
                        t.status === 'open' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : t.status === 'pending' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : t.status === 'resolved' 
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between">
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="p-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="p-2 border border-slate-800 rounded-lg bg-slate-950 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create New Ticket</h3>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Summarize the issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="Provide all details about the problem..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none transition-colors"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-3 text-sm text-slate-300 outline-none transition-colors cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. billing, bug, slow"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 px-4 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer disabled:opacity-50 mt-6"
              >
                {submitting ? 'Creating Ticket...' : 'Create Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
