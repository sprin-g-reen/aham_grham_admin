import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, UserPlus, UserX, Search, Download } from 'lucide-react'

const EventDetails = () => {
  const { id } = useParams()

  // Placeholder data for attendees
  const attendees = [
    { id: 'EVT-REG-001', name: 'John Doe', number: '+1 555 123 4567', status: 'Registered' },
    { id: 'EVT-REG-002', name: 'Jane Smith', number: '+1 555 987 6543', status: 'Registered' },
    { id: 'EVT-REG-003', name: 'Mike Ross', number: '+1 555 246 8135', status: 'Canceled' },
    { id: 'EVT-REG-004', name: 'Rachel Zane', number: '+1 555 369 2580', status: 'Registered' },
    { id: 'EVT-REG-005', name: 'Harvey Specter', number: '+1 555 147 2589', status: 'Registered' },
    { id: 'EVT-REG-006', name: 'Donna Paulsen', number: '+1 555 951 7532', status: 'Canceled' },
  ]

  const registeredCount = attendees.filter(a => a.status === 'Registered').length
  const canceledCount = attendees.filter(a => a.status === 'Canceled').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/dashboard/events" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event List
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Management: Tech Summit #{id}</h1>
            <p className="text-muted-foreground">Monitor attendee registration and cancellation metrics.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-background border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm border-l-4 border-l-emerald-500">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Registered</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{registeredCount}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm border-l-4 border-l-rose-500">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
              <UserX className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Canceled</p>
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{canceledCount}</p>
            </div>
          </div>
        </div>

        {/* Attendees Table Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" /> Attendee List
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search attendee..." 
                className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="px-6 py-4">Attendee ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Contact Number</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{attendee.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{attendee.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{attendee.number}</td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold tracking-tight ${
                        attendee.status === 'Registered' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                      }`}>
                        {attendee.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border bg-muted/20 text-center">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Load more attendees</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
