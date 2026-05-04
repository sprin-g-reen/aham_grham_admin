import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, UserCheck, UserMinus, Search, Filter } from 'lucide-react'

const ProgramDetails = () => {
  const { id } = useParams()

  // Placeholder data for users
  const registrations = [
    { id: 'USR-001', name: 'Alice Johnson', number: '+1 234 567 8901', status: 'Registered' },
    { id: 'USR-002', name: 'Bob Smith', number: '+1 234 567 8902', status: 'Registered' },
    { id: 'USR-003', name: 'Charlie Brown', number: '+1 234 567 8903', status: 'Canceled' },
    { id: 'USR-004', name: 'Diana Prince', number: '+1 234 567 8904', status: 'Registered' },
    { id: 'USR-005', name: 'Ethan Hunt', number: '+1 234 567 8905', status: 'Canceled' },
  ]

  const registeredCount = registrations.filter(r => r.status === 'Registered').length
  const canceledCount = registrations.filter(r => r.status === 'Canceled').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/dashboard/programs" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Program List
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Program Details: Intensive Bootcamp #{id}</h1>
            <p className="text-muted-foreground">Detailed overview of registrations and attendee status.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Users className="h-4 w-4" /> Manage All
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Registered</p>
              <p className="text-3xl font-bold">{registeredCount}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
              <UserMinus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Canceled</p>
              <p className="text-3xl font-bold">{canceledCount}</p>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20">
            <h2 className="text-lg font-semibold">Registration Details</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search user..." 
                  className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                />
              </div>
              <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Number</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrations.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm">{user.number}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.status === 'Registered' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-primary hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramDetails
