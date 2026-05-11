import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Trash2, 
  PlusCircle, 
  Edit, 
  FileUp, 
  LogIn, 
  LogOut,
  Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/activities');
      setActivities(response.data);
    } catch (error) {
      toast.error("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleClearLogs = async () => {
    try {
      await axios.delete('http://localhost:5000/api/activities');
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

  const filteredActivities = activities.filter((a: any) => 
    a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchActivities} disabled={loading}>
            Refresh
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsConfirmOpen(true)} 
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </Button>
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
                  <th className="px-6 py-4 font-semibold text-muted-foreground">User</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading activities...</td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No activities found.</td>
                  </tr>
                ) : (
                  filteredActivities.map((a: any) => (
                    <tr key={a._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getActionColor(a.action)}`}>
                          {getActionIcon(a.action)}
                          {a.action}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{a.module}</td>
                      <td className="px-6 py-4 text-muted-foreground">{a.description}</td>
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
