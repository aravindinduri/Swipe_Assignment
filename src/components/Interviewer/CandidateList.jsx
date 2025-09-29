import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CandidateDetailModal from './CandidateDetailModal';
import { Trophy, ArrowRight, Users, TrendingUp, Inbox, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
const CandidateList = () => {
  const allCandidates = useSelector(state => state.candidates.list)
    .filter(c => c.interviewStatus === 'completed');
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

  const candidates = useMemo(() => {
    let filtered = allCandidates.filter(candidate => {
      const searchLower = searchQuery.toLowerCase();
      return (
        candidate.profile.name.toLowerCase().includes(searchLower) ||
        candidate.profile.email.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch(sortConfig.key) {
        case 'name':
          aValue = a.profile.name.toLowerCase();
          bValue = b.profile.name.toLowerCase();
          break;
        case 'email':
          aValue = a.profile.email.toLowerCase();
          bValue = b.profile.email.toLowerCase();
          break;
        case 'score':
        default:
          aValue = a.finalScore;
          bValue = b.finalScore;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allCandidates, searchQuery, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-zinc-500" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-emerald-400" />
      : <ArrowDown className="h-4 w-4 text-emerald-400" />;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 6) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Work';
  };

  if (candidates.length === 0) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700 rounded-lg shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 shadow-inner">
            <Inbox className="h-8 w-8 text-zinc-500" />
          </div>
          <p className="text-zinc-400 text-center font-medium">No completed interviews yet</p>
          <p className="text-zinc-500 text-sm mt-1">Candidates will appear here after completing their interviews</p>
        </CardContent>
      </Card>
    );
  }

  const topCandidate = candidates[0];
  const avgScore = (candidates.reduce((sum, c) => sum + c.finalScore, 0) / candidates.length).toFixed(1);

  return (
    <Dialog>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-zinc-800/60 border-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Total Interviews</p>
                  <p className="text-3xl font-bold text-white">{candidates.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/60 border-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Average Score</p>
                  <p className="text-3xl font-bold text-white">{avgScore}/10</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/60 border-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Top Performer</p>
                  <p className="text-lg font-bold text-white truncate">{topCandidate.profile.name}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-800/60 border-zinc-700 rounded-lg shadow-sm">
          <CardHeader className="border-b border-zinc-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-medium text-white">Candidate Results</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-zinc-500 mb-3" />
                <p className="text-zinc-400">No candidates found</p>
                <p className="text-zinc-500 text-sm mt-1">Try adjusting your search</p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left text-zinc-400 font-medium text-sm py-3 px-4">Rank</th>
                          <th className="text-left text-zinc-400 font-medium text-sm py-3 px-4">
                            <button 
                              onClick={() => handleSort('name')}
                              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
                            >
                              Candidate
                              <SortIcon columnKey="name" />
                            </button>
                          </th>
                          <th className="text-left text-zinc-400 font-medium text-sm py-3 px-4">
                            <button 
                              onClick={() => handleSort('email')}
                              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
                            >
                              Email
                              <SortIcon columnKey="email" />
                            </button>
                          </th>
                          <th className="text-left text-zinc-400 font-medium text-sm py-3 px-4">Performance</th>
                          <th className="text-right text-zinc-400 font-medium text-sm py-3 px-4">
                            <button 
                              onClick={() => handleSort('score')}
                              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors ml-auto"
                            >
                              Score
                              <SortIcon columnKey="score" />
                            </button>
                          </th>
                          <th className="text-right text-zinc-400 font-medium text-sm py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((candidate, index) => (
                          <tr key={candidate.id} className="border-b border-zinc-700 hover:bg-zinc-800/40 transition-colors">
                            <td className="py-4 px-4">
                              <div className="w-8 h-8 rounded bg-zinc-200 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-white">{candidate.profile.name}</td>
                            <td className="py-4 px-4 text-zinc-400">{candidate.profile.email}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getScoreColor(candidate.finalScore)}`}>
                                {getScoreLabel(candidate.finalScore)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-white font-semibold">{candidate.finalScore.toFixed(1)}</span>
                              <span className="text-zinc-500">/10</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                  onClick={() => setSelectedCandidate(candidate)}
                                >
                                  View <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                              </DialogTrigger>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:hidden divide-y divide-zinc-700">
                  {candidates.map((candidate, index) => (
                    <div key={candidate.id} className="p-4 hover:bg-zinc-800/40 rounded-lg mb-2 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{candidate.profile.name}</h3>
                            <p className="text-sm text-zinc-400 truncate mt-0.5">{candidate.profile.email}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-lg font-semibold text-white">{candidate.finalScore.toFixed(1)}</div>
                          <div className="text-xs text-zinc-500">out of 10</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getScoreColor(candidate.finalScore)}`}>
                          {getScoreLabel(candidate.finalScore)}
                        </span>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <CandidateDetailModal candidate={selectedCandidate} />
    </Dialog>
  );
};

export default CandidateList;
