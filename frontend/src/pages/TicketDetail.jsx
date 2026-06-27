import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  Trash2, 
  Send, 
  AlertTriangle,
  Lock,
  MessageSquare,
  Sparkles,
  Tag,
  UserCheck
} from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [agents, setAgents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment Form State
  const [body, setBody] = useState('');
  const [commentType, setCommentType] = useState('reply'); // reply, note
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Edit ticket state
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const fetchTicketDetails = async () => {
    try {
      const ticketRes = await axios.get(`/api/v1/tickets/${id}`);
      const t = ticketRes.data;
      setTicket(t);
      setStatus(t.status);
      setPriority(t.priority);
      setAssigneeId(t.assignee_id || '');
      
      const convRes = await axios.get(`/api/v1/tickets/${id}/conversations`);
      setConversations(convRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get('/api/v1/users');
      const agentList = (res.data || []).filter(u => u.role === 'agent' || u.role === 'admin');
      setAgents(agentList);
    } catch (err) {
      console.error("Failed to load organization members", err);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    if (user?.role !== 'customer') {
      fetchAgents();
    }
  }, [id]);

  const handleUpdateField = async (field, value) => {
    try {
      const data = {};
      data[field] = value === '' ? null : value;
      
      const res = await axios.patch(`/api/v1/tickets/${id}`, data);
      setTicket(res.data);
      if (field === 'status') setStatus(res.data.status);
      if (field === 'priority') setPriority(res.data.priority);
      if (field === 'assignee_id') setAssigneeId(res.data.assignee_id || '');
      
      // Refresh conversations because updates might add events or re-open status
      const convRes = await axios.get(`/api/v1/tickets/${id}/conversations`);
      setConversations(convRes.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update ticket field.');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    setCommentSubmitting(true);
    try {
      const res = await axios.post(`/api/v1/tickets/${id}/conversations`, {
        body,
        type: commentType
      });
      
      setConversations(prev => [...prev, res.data]);
      setBody('');
      
      // Reload ticket status in case customer reply re-opened a closed ticket
      const ticketRes = await axios.get(`/api/v1/tickets/${id}`);
      setTicket(ticketRes.data);
      setStatus(ticketRes.data.status);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action is soft-deleting.')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/tickets/${id}`);
      navigate('/tickets');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete ticket.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-500">
        <Clock className="w-8 h-8 animate-spin mr-3 text-purple-500" />
        <span>Loading ticket conversation...</span>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h4 className="text-lg font-bold text-white">Access Denied / Error</h4>
        <p className="text-slate-400">{error || 'Ticket not found.'}</p>
        <Link to="/tickets" className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to tickets list
        </Link>
      </div>
    );
  }

  const isEmployee = user?.role === 'admin' || user?.role === 'agent';

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <Link to="/tickets" className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to tickets list
        </Link>

        {user?.role === 'admin' && (
          <button 
            onClick={handleDeleteTicket}
            className="flex items-center gap-2 bg-red-950/20 hover:bg-red-900/20 border border-red-900/30 hover:border-red-900/40 text-red-400 text-xs font-semibold rounded-xl py-2 px-3 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Ticket
          </button>
        )}
      </div>

      {/* Detail Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Area: Subject, Description & Conversation Thread */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ticket Header & Description Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono">TICKET #{ticket.id}</span>
              <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
              <span className="text-xs text-slate-400">Created on {new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-white leading-tight">{ticket.subject}</h1>
            
            <div className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl">
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>

            {/* Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <div className="flex flex-wrap gap-1.5">
                  {ticket.tags.map(t => (
                    <span key={t.id} className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-[10px] rounded text-slate-400 font-semibold">
                      #{t.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Conversation Thread
            </h3>

            <div className="space-y-4">
              {conversations.map((c) => {
                const isNote = c.type === 'note';
                const isCommenterEmployee = c.user?.role === 'admin' || c.user?.role === 'agent';
                
                return (
                  <div 
                    key={c.id} 
                    className={`p-5 rounded-2xl border transition-all duration-200 ${
                      isNote 
                        ? 'bg-amber-950/15 border-amber-900/35 shadow-inner' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {c.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-200">{c.user?.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider border border-slate-800 bg-slate-900 px-1.5 py-0.5 rounded ml-2">
                            {c.user?.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        {isNote && (
                          <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider text-amber-500 bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 rounded-md">
                            <Lock className="w-3 h-3" /> Internal Note
                          </span>
                        )}
                        <span>{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${isNote ? 'text-amber-200/90' : 'text-slate-300'}`}>
                      {c.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comment Composer */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-4">Post a Response</h4>
            
            <form onSubmit={handlePostComment} className="space-y-4">
              {/* Type Switcher for Agents/Admins */}
              {isEmployee && (
                <div className="flex gap-2 p-1 bg-slate-900 rounded-xl max-w-xs border border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setCommentType('reply')}
                    className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      commentType === 'reply' 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Public Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentType('note')}
                    className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      commentType === 'note' 
                        ? 'bg-amber-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Internal Note
                  </button>
                </div>
              )}

              <div className="relative">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={
                    commentType === 'note' 
                      ? "Write an internal note visible only to admins and agents..." 
                      : "Type your public reply to the customer..."
                  }
                  rows="4"
                  className="w-full bg-slate-900 border border-slate-800/80 focus:border-purple-500 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none transition-colors"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={commentSubmitting}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg cursor-pointer transition-colors ${
                  commentType === 'note'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
                }`}
              >
                {commentSubmitting ? 'Posting...' : 'Submit Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Area: Ticket Settings & SLA Timer Info */}
        <div className="space-y-6">
          
          {/* Ticket Metadata Controls Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-md font-bold text-white border-b border-slate-900 pb-3">Properties</h3>
            
            {/* Status Control */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => handleUpdateField('status', e.target.value)}
                disabled={!isEmployee}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-200 outline-none cursor-pointer focus:border-purple-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Control */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</label>
              <select
                value={priority}
                onChange={(e) => handleUpdateField('priority', e.target.value)}
                disabled={!isEmployee}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-200 outline-none cursor-pointer focus:border-purple-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee Control */}
            {isEmployee && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignee</label>
                <select
                  value={assigneeId}
                  onChange={(e) => handleUpdateField('assignee_id', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-200 outline-none cursor-pointer focus:border-purple-500"
                >
                  <option value="">Claim / Unassigned</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Requester Contact Info */}
            <div className="pt-4 border-t border-slate-900 space-y-3">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Requester Details</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">
                  {ticket.requester?.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h5 className="text-xs font-bold text-slate-200 truncate">{ticket.requester?.name}</h5>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{ticket.requester?.email}</p>
                </div>
              </div>
            </div>

          </div>

          {/* SLA Performance Timer Card */}
          {ticket.sla && (
            <div className={`p-6 border rounded-2xl bg-slate-950 shadow-xl relative overflow-hidden ${
              ticket.sla.breached 
                ? 'border-red-900/35 bg-red-950/5' 
                : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className={`w-5 h-5 ${ticket.sla.breached ? 'text-red-400' : 'text-purple-400'}`} />
                <h4 className="text-sm font-bold text-white">SLA Targets</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider">First Response Due</span>
                  <p className="text-xs text-slate-200 mt-1 font-mono">
                    {new Date(ticket.sla.first_response_due_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Resolution Due</span>
                  <p className="text-xs text-slate-200 mt-1 font-mono">
                    {new Date(ticket.sla.resolution_due_at).toLocaleString()}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900/60">
                  {ticket.sla.breached ? (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>SLA Breach Warning</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg">
                      <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
                      <span>SLA Compliance Active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default TicketDetail;
