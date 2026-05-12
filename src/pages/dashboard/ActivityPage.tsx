import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  History, 
  Trash2, 
  PlusCircle, 
  Edit, 
  FileUp, 
  LogIn, 
  LogOut,
  Search,
  Filter
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { API_URL } from "@/config";

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleLimit, setVisibleLimit] = useState(15);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/activities`);
      setActivities(response.data);
      setCurrentPage(1);
      setVisibleLimit(15);
    } catch (error) {
      toast.error("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handleClearLogs = async () => {
    try {
      await axios.delete(`${API_URL}/activities`);
      toast.success("Activity logs cleared");
      setIsConfirmOpen(false);
      fetchActivities();
    } catch (error) {
      toast.error("Failed to clear logs");
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case 'UPDATE': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'DELETE': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'IMPORT': return <FileUp className="w-4 h-4 text-purple-500" />;
      case 'LOGIN': return <LogIn className="w-4 h-4 text-orange-500" />;
      case 'LOGOUT': return <LogOut className="w-4 h-4 text-red-400" />;
      default: return <History className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case 'UPDATE': return "bg-blue-500/10 text-blue-600 border-blue-200";
      case 'DELETE': return "bg-red-500/10 text-red-600 border-red-200";
      case 'IMPORT': return "bg-purple-500/10 text-purple-600 border-purple-200";
      case 'LOGIN': return "bg-orange-500/10 text-orange-600 border-orange-200";
      case 'LOGOUT': return "bg-red-400/10 text-red-500 border-red-100";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const allFiltered = activities.filter((a: any) => {
    const matchesSearch = a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'ALL' || a.action === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const isSearching = searchTerm !== '' || filterType !== 'ALL';

  let displayedActivities = [];
  let totalVisiblePages = 1;

  if (isSearching) {
    displayedActivities = allFiltered;
    totalVisiblePages = 1;
  } else {
    // Paginate based on visibleLimit (starts at 15)
    const paginatedBase = activities.slice(0, visibleLimit);
    totalVisiblePages = Math.ceil(paginatedBase.length / ITEMS_PER_PAGE);
    displayedActivities = paginatedBase.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }

  const handleFetchMore = () => {
    const nextLimit = visibleLimit + 15;
    setVisibleLimit(nextLimit);
    // Automatically jump to the first page of the new batch
    setCurrentPage(visibleLimit / ITEMS_PER_PAGE + 1);
  };

  const hasMoreToFetch = !isSearching && visibleLimit < activities.length;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Activity Log
          </h1>
          <p className="text-muted-foreground">Monitor all administrative actions and system changes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="LOGOUT">Logout</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchActivities} disabled={loading} size="icon" title="Refresh">
              <History className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsConfirmOpen(true)} 
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Logs</span>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Action</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Module</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Description</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-center">Location (IP)</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">User</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading activities...</td>
                  </tr>
                ) : displayedActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No activities found.</td>
                  </tr>
                ) : (
                  displayedActivities.map((a: any) => (
                    <tr key={a._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getActionColor(a.action)}`}>
                          {getActionIcon(a.action)}
                          {a.action}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{a.module}</td>
                      <td className="px-6 py-4 text-muted-foreground">{a.description}</td>
                      <td className="px-6 py-4 text-center">
                        <code className="text-[10px] bg-muted px-2 py-1 rounded border text-muted-foreground">
                          {a.ip || 'Unknown'}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {a.user.charAt(0)}
                          </div>
                          {a.user}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isSearching && !loading && activities.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
              <p className="text-xs text-muted-foreground font-medium">
                Viewing {Math.min(visibleLimit, activities.length)} of {activities.length} logs
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalVisiblePages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "ghost"}
                      size="sm"
                      className={`w-9 h-9 p-0 font-bold ${currentPage === i + 1 ? 'shadow-md shadow-primary/20' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                {hasMoreToFetch ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleFetchMore}
                    className="ml-2 border-primary/20 text-primary hover:bg-primary/5 px-6 font-semibold"
                  >
                    Fetch More
                  </Button>
                ) : (
                  <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-4">
                    No other activity logs
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleClearLogs}
        title="Clear Activity Logs"
        description="Are you sure you want to permanently clear all activity logs? This action cannot be undone."
        confirmText="Clear All"
        variant="destructive"
      />
    </div>
  );
};

export default ActivityPage;
