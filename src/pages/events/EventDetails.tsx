import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Trash2, 
  Edit, 
  Filter, 
  Search,
  Plus,
  Play
} from 'lucide-react'
import { ConfirmDialog } from "@/components/ConfirmDialog"

import { 
  Dialog as ShadcnDialog, 
  DialogContent as ShadcnContent, 
  DialogHeader as ShadcnHeader, 
  DialogTitle as ShadcnTitle,
  DialogFooter as ShadcnFooter 
} from "@/components/ui/dialog"

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const EventDetails = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  // Edit State
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    eventId: '',
    bookingPrice: '',
    description: '',
    about: '',
    category: ''
  })
  const [editFile, setEditFile] = useState<File | null>(null)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)

  // Add State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: '',
    eventId: '',
    bookingPrice: '',
    description: '',
    about: '',
    category: '',
    isBlog: false
  })
  const [addFile, setAddFile] = useState<File | null>(null)
  const [isAddLoading, setIsAddLoading] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events')
      setEvents(response.data)
    } catch (error) {
      toast.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    try {
      await axios.delete(`http://localhost:5000/api/events/${deleteConfirmId}`)
      toast.success("Event deleted")
      setDeleteConfirmId(null)
      fetchData()
    } catch (error) {
      toast.error("Failed to delete event")
    }
  }

  const handleEditClick = (event: any) => {
    setEditingEvent(event)
    setEditForm({
      name: event.name,
      eventId: event.eventId,
      bookingPrice: event.bookingPrice.toString(),
      description: event.description || '',
      about: event.about || '',
      category: event.category || 'Main Event'
    })
    setEditFile(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const isHighlight = editForm.category === 'Highlight'
    if (!editForm.name || !editForm.eventId || !editForm.category || !editForm.about || !editForm.description) {
      toast.error("Please fill all required fields, including 'What it is all about'.")
      return
    }

    setIsUpdateLoading(true)
    try {
      let imageBase64 = '';
      if (editFile) {
        imageBase64 = await fileToBase64(editFile);
      }

      const payload = {
        name: editForm.name,
        eventId: editForm.eventId,
        bookingPrice: editForm.bookingPrice,
        description: editForm.description,
        about: editForm.about,
        category: editForm.category,
        isBlog: editingEvent.isBlog,
        image: imageBase64 || editingEvent.image
      };

      await axios.put(`http://localhost:5000/api/events/${editingEvent._id}`, payload)
      toast.success("Event updated successfully")
      setEditingEvent(null)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update event")
    } finally {
      setIsUpdateLoading(false)
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isHighlight = addForm.category === 'Highlight'
    if (!addForm.name || !addForm.eventId || !addForm.category || !addForm.about || !addForm.description || !addFile) {
      toast.error(`All fields are required, including Category and ${isHighlight ? 'Highlight Image' : 'Event Image'}.`)
      return
    }

    setIsAddLoading(true)
    try {
      let imageBase64 = '';
      if (addFile) {
        imageBase64 = await fileToBase64(addFile);
      }

      const payload = {
        name: addForm.name,
        eventId: addForm.eventId,
        bookingPrice: addForm.bookingPrice,
        description: addForm.description,
        about: addForm.about,
        category: addForm.category,
        isBlog: addForm.isBlog,
        image: imageBase64
      };

      await axios.post('http://localhost:5000/api/events', payload)
      toast.success("Event added successfully")
      setAddForm({ name: '', eventId: '', bookingPrice: '', description: '', about: '', category: '', isBlog: false })
      setAddFile(null)
      setIsAddOpen(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add event")
    } finally {
      setIsAddLoading(false)
    }
  }

  const filteredEvents = events.filter(e => 
    (e.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (e.eventId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage and view all your active events and meetups.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search event..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 border rounded-xl border-dashed">
            {searchTerm ? "No events match your search." : "No events found."}
          </p>
        ) : (
          filteredEvents.map((ev) => (
            <Card key={ev._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6 p-6">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative group">
                    <img 
                      src={ev.image ? `http://localhost:5000${ev.image}` : 'https://placehold.co/80x80/2c2c3a/white?text=No+Img'} 
                      alt={ev.name} 
                      className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl truncate">{ev.name}</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase">
                      {ev.eventId}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs mt-2">
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                      {ev.category !== 'Highlight' && <span>₹{ev.bookingPrice}</span>}
                    </div>
                    <span className="text-muted-foreground">Created: {new Date(ev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-2 hover:bg-primary/5 hover:text-primary border-muted ${ev.isBlog ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}`}
                    onClick={async () => {
                      try {
                        await axios.patch(`http://localhost:5000/api/events/${ev._id}/toggle-blog`)
                        toast.success(ev.isBlog ? "Removed from Blog" : "Added to Blog")
                        fetchData()
                      } catch (error) {
                        toast.error("Failed to update blog status")
                      }
                    }}
                  >
                    {ev.isBlog ? "Remove from Blog" : "Add to Blog"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary border-muted"
                    onClick={() => handleEditClick(ev)}
                  >
                    <Edit className="h-4 w-4" />
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-muted"
                    onClick={() => setDeleteConfirmId(ev._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog 
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />

      {/* UPDATE MODAL */}
      <ShadcnDialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <ShadcnContent className="sm:max-w-[500px]" aria-describedby={undefined}>
          <ShadcnHeader>
            <ShadcnTitle>Update Event</ShadcnTitle>
          </ShadcnHeader>
          <form onSubmit={handleUpdate} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name" className="text-xs">Event Name</Label>
                <Input 
                  id="edit-name" 
                  required
                  className="h-9"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-id" className="text-xs">Event ID</Label>
                <Input 
                  id="edit-id" 
                  required
                  className="h-9"
                  value={editForm.eventId}
                  onChange={(e) => setEditForm({...editForm, eventId: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {editForm.category !== 'Highlight' && (
                <div className="space-y-1">
                  <Label htmlFor="edit-price" className="text-xs">Booking Price (₹)</Label>
                  <Input 
                    id="edit-price" 
                    type="number"
                    required
                    className="h-9"
                    value={editForm.bookingPrice}
                    onChange={(e) => setEditForm({...editForm, bookingPrice: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="edit-category" className="text-xs">Category</Label>
                <select 
                  id="edit-category"
                  className="w-full h-9 p-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                >
                  <option value="Main Event">Main Event</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Highlight">Highlight</option>
                  <option value="Upcoming Event">Upcoming Event</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-desc" className="text-xs">Short Description</Label>
              <Textarea 
                id="edit-desc" 
                required
                className="min-h-[60px] text-sm"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-about" className="text-xs">What it is all about</Label>
              <Textarea 
                id="edit-about" 
                required
                placeholder="Detailed info..." 
                className="min-h-[80px] text-sm"
                value={editForm.about}
                onChange={(e) => setEditForm({...editForm, about: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-media" className="text-xs">
                {editForm.category === 'Highlight' ? 'Highlight Image' : 'Update Image'}
              </Label>
              <Input 
                id="edit-media" 
                type="file" 
                className="h-9 text-xs"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              />
            </div>
            <ShadcnFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingEvent(null)}>Cancel</Button>
              <Button type="submit" disabled={isUpdateLoading}>
                {isUpdateLoading ? "Updating..." : "Save Changes"}
              </Button>
            </ShadcnFooter>
          </form>
        </ShadcnContent>
      </ShadcnDialog>

      {/* ADD MODAL */}
      <ShadcnDialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <ShadcnContent className="sm:max-w-[500px]" aria-describedby={undefined}>
          <ShadcnHeader>
            <ShadcnTitle>Add New Event</ShadcnTitle>
          </ShadcnHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="add-name" className="text-xs">Event Name</Label>
                <Input 
                  id="add-name" 
                  required
                  className="h-9"
                  placeholder="e.g. Retreat" 
                  value={addForm.name}
                  onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="add-id" className="text-xs">Event ID</Label>
                <Input 
                  id="add-id" 
                  required
                  className="h-9"
                  placeholder="e.g. EVNT-001" 
                  value={addForm.eventId}
                  onChange={(e) => setAddForm({...addForm, eventId: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {addForm.category !== 'Highlight' && (
                <div className="space-y-1">
                  <Label htmlFor="add-price" className="text-xs">Booking Price (₹)</Label>
                  <Input 
                    id="add-price" 
                    type="number"
                    required
                    className="h-9"
                    placeholder="0.00" 
                    value={addForm.bookingPrice}
                    onChange={(e) => setAddForm({...addForm, bookingPrice: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="add-category" className="text-xs">Category</Label>
                <select 
                  id="add-category"
                  className="w-full h-9 p-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={addForm.category}
                  onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Main Event">Main Event</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Highlight">Highlight</option>
                  <option value="Upcoming Event">Upcoming Event</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-desc" className="text-xs">Short Description</Label>
              <Textarea 
                id="add-desc" 
                required
                placeholder="A brief summary..." 
                className="min-h-[60px] text-sm"
                value={addForm.description}
                onChange={(e) => setAddForm({...addForm, description: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-about" className="text-xs">What it is all about</Label>
              <Textarea 
                id="add-about" 
                required
                placeholder="Detailed info..." 
                className="min-h-[80px] text-sm"
                value={addForm.about}
                onChange={(e) => setAddForm({...addForm, about: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-media" className="text-xs">
                {addForm.category === 'Highlight' ? 'Highlight Image' : 'Event Image'}
              </Label>
              <Input 
                id="add-media" 
                type="file" 
                required
                className="h-9 text-xs"
                accept="image/*"
                onChange={(e) => setAddFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex items-center space-x-2 py-1">
              <input 
                id="add-isBlog" 
                type="checkbox" 
                className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
                checked={addForm.isBlog}
                onChange={(e) => setAddForm({...addForm, isBlog: e.target.checked})}
              />
              <Label htmlFor="add-isBlog" className="text-[10px] font-medium leading-none">
                Show in Blog section
              </Label>
            </div>

            <ShadcnFooter className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={isAddLoading}>
                {isAddLoading ? "Adding..." : "Add Event"}
              </Button>
            </ShadcnFooter>
          </form>
        </ShadcnContent>
      </ShadcnDialog>
    </div>
  )
}

export default EventDetails
