"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminNavigation } from "@/components/admin-navigation";
import { Footer } from "@/components/footer";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string; // YYYYMMDD format
  time?: string;
  location?: string;
  address?: string;
  description?: string;
  type?: string;
  image?: string;
  spots?: string;
  price?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to format YYYYMMDD to readable date
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(dateStr.substring(6, 8));
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Helper function to convert readable date input to YYYYMMDD
function parseDateInput(dateInput: string): string {
  if (!dateInput) return '';
  // If already in YYYYMMDD format, return as is
  if (/^\d{8}$/.test(dateInput)) return dateInput;
  
  // Parse YYYY-MM-DD format manually to avoid timezone issues (from input[type="date"])
  const ymdMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const [, year, month, day] = ymdMatch;
    return `${year}${month}${day}`;
  }
  
  // Parse MM/DD/YYYY format manually to avoid timezone issues
  const mdyMatch = dateInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdyMatch) {
    const [, month, day, year] = mdyMatch;
    return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
  }
  
  // If we can't parse it, return empty string (don't use Date constructor which has timezone issues)
  return '';
}

// Helper function to convert YYYYMMDD to YYYY-MM-DD for input[type="date"]
function dateToInputFormat(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return '';
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '', // Will be stored as YYYYMMDD
    time: '',
    location: '',
    address: '',
    description: '',
    type: '',
    image: '',
    spots: '',
    price: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Convert date input to YYYYMMDD format
      const dateFormatted = parseDateInput(formData.date);
      if (!dateFormatted) {
        alert('Please enter a valid date');
        setFormLoading(false);
        return;
      }

      const payload = {
        ...formData,
        date: dateFormatted,
      };

      const url = editingEvent 
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events';
      
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
        resetForm();
        fetchEvents();
        
        // Scroll to top after successful save
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const error = await response.json();
        alert(`Failed to save event: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      date: dateToInputFormat(event.date), // Convert to YYYY-MM-DD for date input
      time: event.time || '',
      location: event.location || '',
      address: event.address || '',
      description: event.description || '',
      type: event.type || '',
      image: event.image || '',
      spots: event.spots || '',
      price: event.price || '',
    });
    setShowAddForm(true);
    
    // Scroll to form after a brief delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.getElementById('event-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Event deleted successfully');
        fetchEvents();
      } else {
        const error = await response.json();
        alert(`Failed to delete event: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      address: '',
      description: '',
      type: '',
      image: '',
      spots: '',
      price: '',
    });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  // Helper to check if event is past
  const isPastEvent = (dateStr: string): boolean => {
    if (!dateStr || dateStr.length !== 8) return false;
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const eventDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminNavigation />
        <div className="pt-24 pb-12 md:pb-16 bg-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminNavigation />

      <section className="pt-24 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Manage Events
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4">
              Add, edit, and manage events and workshops
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Add/Edit Form */}
            {showAddForm && (
              <Card id="event-form" className="mb-8">
                <CardHeader>
                  <CardTitle>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </CardTitle>
                  <CardDescription>
                    Fill in the details below to {editingEvent ? 'update' : 'add'} an event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Date will be stored as YYYYMMDD format
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          placeholder="e.g., 4:00 PM - 7:00 PM"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Event Type</Label>
                        <Select
                          value={formData.type || undefined}
                          onValueChange={(value) => setFormData({ ...formData, type: value || "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Market">Market</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Bazaar">Bazaar</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Hasentree Clubhouse"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full address"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="image">Image URL/Path</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="/images/events/event.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="spots">Available Spots</Label>
                        <Input
                          id="spots"
                          value={formData.spots}
                          onChange={(e) => setFormData({ ...formData, spots: e.target.value })}
                          placeholder="e.g., Limited to 10 participants"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g., $50 per person"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={formLoading}>
                        {formLoading ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                All Events ({events.length})
              </h2>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              )}
            </div>

            {events.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No events yet. Add your first event above!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                            {event.type && (
                              <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">
                                {event.type}
                              </span>
                            )}
                            {isPastEvent(event.date) && (
                              <span className="text-sm px-2 py-1 bg-muted text-muted-foreground rounded">
                                Past Event
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <div><strong>Date:</strong> {formatDate(event.date)}</div>
                            {event.time && <div><strong>Time:</strong> {event.time}</div>}
                            {event.location && <div><strong>Location:</strong> {event.location}</div>}
                            {event.address && <div><strong>Address:</strong> {event.address}</div>}
                          </div>
                          {event.description && (
                            <p className="text-muted-foreground mb-3 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {event.spots && <span>Spots: <strong>{event.spots}</strong></span>}
                            {event.price && <span>Price: <strong>{event.price}</strong></span>}
                            {event.image && (
                              <span className="truncate max-w-xs">Image: {event.image}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

