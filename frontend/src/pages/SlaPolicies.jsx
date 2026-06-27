import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, Plus, AlertCircle, Sparkles } from 'lucide-react';

const SlaPolicies = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [firstResponseHours, setFirstResponseHours] = useState(24);
  const [resolutionHours, setResolutionHours] = useState(72);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('/api/v1/sla-policies');
      setPolicies(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    if (!name) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/v1/sla-policies', {
        name,
        first_response_hours: firstResponseHours,
        resolution_hours: resolutionHours,
      });

      setPolicies(prev => [...prev, res.data]);
      setName('');
      setFirstResponseHours(24);
      setResolutionHours(72);
      setSuccess('SLA Policy created successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create SLA Policy.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h4 className="text-lg font-bold text-white">Access Denied</h4>
        <p className="text-slate-400">Only administrators can access and configure organization SLA policies.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* SLA Policies List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-md font-bold text-white mb-6">Active SLA Policies</h3>

          {loading ? (
            <div className="flex justify-center items-center py-12 text-slate-500">
              <Clock className="w-6 h-6 animate-spin mr-2 text-purple-500" />
              <span>Loading SLA policies...</span>
            </div>
          ) : policies.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No SLA policies configured for this organization.</p>
          ) : (
            <div className="space-y-4">
              {policies.map(p => (
                <div key={p.id} className="p-5 bg-slate-900 border border-slate-800/80 hover:border-slate-700/60 rounded-xl flex items-center justify-between transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100">{p.name}</h4>
                    <p className="text-xs text-slate-500">Configured SLA parameters</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-center min-w-28">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Response Target</span>
                      <span className="text-sm font-extrabold text-purple-400 mt-0.5 block">{p.first_response_hours} hrs</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-center min-w-28">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Resolution Target</span>
                      <span className="text-sm font-extrabold text-blue-400 mt-0.5 block">{p.resolution_hours} hrs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create SLA Policy Form */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-fit shadow-xl">
        <h3 className="text-md font-bold text-white mb-6">Create SLA Policy</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleCreatePolicy} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Policy Name</label>
            <input
              type="text"
              placeholder="e.g. Standard SLA, Enterprise Fast Track"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Response Hours</label>
            <input
              type="number"
              min="1"
              value={firstResponseHours}
              onChange={(e) => setFirstResponseHours(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resolution Hours</label>
            <input
              type="number"
              min="1"
              value={resolutionHours}
              onChange={(e) => setResolutionHours(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 px-4 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 cursor-pointer disabled:opacity-50 mt-6"
          >
            {submitting ? 'Creating Policy...' : 'Create SLA Policy'}
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default SlaPolicies;
