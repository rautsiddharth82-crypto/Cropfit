import React, { useState } from 'react';
import { Database, Search, ArrowRight, Activity, Calendar } from 'lucide-react';

export const ApiTesterView: React.FC = () => {
  const [lat, setLat] = useState('30.4764');
  const [lon, setLon] = useState('76.5927');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // We hit the existing weather/current which does the anomaly calculations using Meteoblue!
      const res = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}`);
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#6FAF78]/20 text-[#437A4B] text-xs font-bold rounded-full">
              ⚡ Developer Tools
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#26332A] mt-1">Meteoblue API Tester</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E6E9E5] shadow-xs">
            <h3 className="text-lg font-extrabold text-[#26332A] mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0284C7]" />
              Query Parameters
            </h3>
            
            <form onSubmit={handleTestApi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#68736B] mb-1">Latitude</label>
                <input 
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F7EF] border border-[#E6E9E5] rounded-xl text-sm font-semibold text-[#26332A] focus:outline-none focus:border-[#6FAF78]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#68736B] mb-1">Longitude</label>
                <input 
                  type="number"
                  step="0.0001"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F7EF] border border-[#E6E9E5] rounded-xl text-sm font-semibold text-[#26332A] focus:outline-none focus:border-[#6FAF78]"
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-75"
                >
                  {loading ? 'Fetching Data...' : 'Fetch Live Meteoblue Data'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2">
          <div className="bg-[#26332A] rounded-3xl p-6 shadow-xs h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#6FAF78]" />
                API Response JSON
              </h3>
              {results && (
                <span className="px-3 py-1 bg-[#6FAF78]/20 text-[#6FAF78] text-xs font-bold rounded-full">
                  Status: 200 OK
                </span>
              )}
            </div>

            {error ? (
              <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 font-mono text-sm">
                Error: {error}
              </div>
            ) : results ? (
              <div className="flex-1 bg-[#1A231C] border border-gray-700 rounded-2xl p-4 overflow-auto max-h-[600px]">
                <pre className="text-[#A8D5A2] font-mono text-xs sm:text-sm whitespace-pre-wrap">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500 space-y-3">
                <Search className="w-8 h-8 opacity-50" />
                <p className="text-sm font-medium">Run a query to view the Meteoblue dataset response.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
