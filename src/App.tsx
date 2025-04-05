import React, { useState } from 'react';
import { Search, Download, Globe2, Languages, Loader2 } from 'lucide-react';
import axios from 'axios';

interface KeywordResult {
  keyword: string;
  avg_monthly_searches: number;
  competition: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [keyword, setKeyword] = useState('');
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [country, setCountry] = useState('US');
  const [language, setLanguage] = useState('1000');
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = {
    "United States": "US",
    "United Kingdom": "GB",
    "Australia": "AU",
    "Canada": "CA",
    "Vietnam": "VN",
    "India": "IN",
    "Singapore": "SG",
    "Malaysia": "MY"
  };

  const languages = {
    "English": "1000",
    "Vietnamese": "1005",
    "French": "1002",
    "German": "1001",
    "Spanish": "1003",
    "Chinese": "1004",
    "Japanese": "1006",
    "Korean": "1007"
  };

  const handleSingleKeywordSearch = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8501/api/keyword', {
        params: {
          keyword: keyword.trim(),
          country: country,
          language: language
        }
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch keyword data. Please try again.');
      console.error('Error fetching keyword data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkKeywordAnalysis = async () => {
    if (!bulkKeywords.trim()) {
      setError('Please enter at least one keyword');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const keywords = bulkKeywords
        .split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const response = await axios.post('http://localhost:8501/api/bulk-keywords', {
        keywords,
        country,
        language
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to analyze keywords. Please try again.');
      console.error('Error analyzing keywords:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!results.length) return;

    const headers = ['Keyword', 'Monthly Searches', 'Competition'];
    const csvContent = [
      headers.join(','),
      ...results.map(row => 
        [
          `"${row.keyword}"`,
          row.avg_monthly_searches,
          row.competition
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'keyword_research.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Search className="w-10 h-10 text-blue-600" />
              Google Ads Keyword Research Tool
            </h1>
            <p className="text-gray-600 text-lg">
              Discover valuable keywords and their metrics for your Google Ads campaigns
            </p>
          </div>

          {/* Settings Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Globe2 className="w-4 h-4" />
                  Country
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {Object.entries(countries).map(([name, code]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Languages className="w-4 h-4" />
                  Language
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {Object.entries(languages).map(([name, code]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'single'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('single')}
              >
                Single Keyword Research
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'bulk'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('bulk')}
              >
                Bulk Keyword Analysis
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {activeTab === 'single' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Enter a keyword to research:
                    </label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g., digital marketing"
                    />
                  </div>
                  <button
                    onClick={handleSingleKeywordSearch}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {loading ? 'Researching...' : 'Research Keyword'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Enter keywords (one per line):
                    </label>
                    <textarea
                      value={bulkKeywords}
                      onChange={(e) => setBulkKeywords(e.target.value)}
                      className="w-full p-2 border rounded-md h-40"
                      placeholder="digital marketing&#13;&#10;social media&#13;&#10;content strategy"
                    />
                  </div>
                  <button
                    onClick={handleBulkKeywordAnalysis}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {loading ? 'Analyzing...' : 'Analyze Keywords'}
                  </button>
                </div>
              )}

              {/* Results section */}
              {results.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Results</h3>
                    <button 
                      onClick={downloadCsv}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Keyword
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monthly Searches
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Competition
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.keyword}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.avg_monthly_searches.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.competition}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!loading && !error && results.length === 0 && (
                <div className="mt-8">
                  <div className="bg-gray-50 rounded-md p-8 text-center text-gray-500">
                    Enter a keyword above to see the research results
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;