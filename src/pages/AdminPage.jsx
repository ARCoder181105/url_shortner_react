import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, ExternalLink, Copy, Eye, RefreshCw, Search } from 'lucide-react';


const AdminPage = ({ user }) => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  const fetchUrls = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/urls`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      // console.log(response.ok);

      if (response.ok) {
        setUrls(data || []);
      } else {
        // If the cookie is invalid or expired, the server will send an error.
        setError(data.message || 'Failed to fetch URLs. Your session may have expired.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  // The effect runs once when the component mounts to fetch initial data.
  useEffect(() => {
    fetchUrls();
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredUrls = urls.filter(url =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClicks = urls.reduce((sum, url) => sum + (url.visits || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            {/* Personalize the page with the user prop */}
            <p className="text-gray-600">
              Welcome, {user?.username || 'Admin'}! Monitor and manage your shortened URLs.
            </p>
          </div>
          <button
            onClick={fetchUrls} // The refresh button now calls the memoized function
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total URLs Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total URLs</p>
              <p className="text-3xl font-bold text-gray-900">{urls.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        {/* Total Clicks Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        {/* Average Clicks Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Clicks</p>
              <p className="text-3xl font-bold text-gray-900">
                {urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by original or short URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* URLs Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading URL Analytics...</p>
          </div>
        ) : filteredUrls.length === 0 ? (
          <div className="p-12 text-center">
            <ExternalLink className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No URLs match your search' : 'No URLs found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUrls.map((url) => (
                  <tr key={url._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs" title={url.originalUrl}>
                        {url.originalUrl}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-blue-600 font-mono">{`${import.meta.env.VITE_API_URL}/${url.shortUrl}`}</p>
                        <button
                          onClick={() => copyToClipboard(`${import.meta.env.VITE_API_URL}/${url.shortUrl}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedUrl === url.shortUrl ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{url.visits}</td>
                    <td className="px-6 py-4">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Visit original URL"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;