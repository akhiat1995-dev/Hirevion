import React, { useState } from 'react';
import { submitHiringWorkflow } from '../services/api';
import { Loader2, CheckCircle, AlertCircle, Code, Eye } from 'lucide-react';

const TestBackend = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showJson, setShowJson] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a simple test FormData
      const formData = new FormData();
      formData.append('job_title', 'Test Job');
      formData.append('number_of_positions', '1');
      formData.append('job_requirements', 'Looking for Python developers with 3+ years experience');
      
      // Note: You'll need to actually upload a file for this to work fully
      // This is just to test the connection
      
      const response = await submitHiringWorkflow(formData);
      console.log('Backend Response:', response);
      setResult(response);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Backend Connection Test</h1>
        <p className="text-gray-600 mt-2">Test if frontend can receive data from backend</p>
      </div>

      <div className="bg-white rounded-lg paper-shadow p-6 border border-warm-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={runTest}
            disabled={loading}
            className="bg-navy-800 text-white px-6 py-3 rounded-sm hover:bg-navy-900 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          {result && (
            <button
              onClick={() => setShowJson(!showJson)}
              className="bg-white border border-warm-200 text-navy-800 px-6 py-3 rounded-sm hover:bg-warm-50 transition-all flex items-center gap-2"
            >
              <Code size={18} />
              {showJson ? 'Hide JSON' : 'Show JSON'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-sm flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-700">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-warm-200">
              <div className="text-2xl font-bold text-navy-900">{result.approved_candidates?.length || 0}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-warm-200">
              <div className="text-2xl font-bold text-navy-900">{result.rejected_candidates?.length || 0}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-warm-200">
              <div className="text-2xl font-bold text-navy-900">{result.selection_summary?.total_candidates || 0}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-warm-200">
              <div className="text-2xl font-bold text-navy-900">{result.job_summary?.title || 'N/A'}</div>
              <div className="text-sm text-gray-600">Job Title</div>
            </div>
          </div>

          {/* JSON View */}
          {showJson && (
            <div className="bg-gray-900 rounded-lg p-6 overflow-auto max-h-[600px]">
              <pre className="text-green-400 text-sm font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-navy-50 border border-navy-100 rounded-lg p-6">
        <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
          <Eye size={18} />
          How to Debug Results
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Click "Test Connection" to see if backend responds</li>
          <li>Click "Show JSON" to see the raw data structure</li>
          <li>Open browser console (F12) to see detailed logs</li>
          <li>Check if data has: <code>approved_candidates</code>, <code>rejected_candidates</code>, <code>job_summary</code></li>
          <li>If empty, check backend is running: <code>python start.py</code></li>
        </ol>
      </div>
    </div>
  );
};

export default TestBackend;
