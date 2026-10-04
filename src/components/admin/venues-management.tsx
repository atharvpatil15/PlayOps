"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, MapPin, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createVenue, updateVenue, deleteVenue, type VenueInput } from "@/actions/venues";

interface Venue {
  id: string;
  name: string;
  location: string;
  type: "indoor" | "outdoor" | "multipurpose";
  capacity: number | null;
  facilities: string[] | null;
  is_available: boolean;
}

interface VenuesManagementProps {
  initialVenues: Venue[];
}

export function VenuesManagement({ initialVenues }: VenuesManagementProps) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<VenueInput>({
    name: "",
    location: "",
    type: "outdoor",
    capacity: 200,
    facilities: [],
    is_available: true,
  });
  const [facilitiesText, setFacilitiesText] = useState("");

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || venue.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    setEditingVenue(null);
    setFormData({
      name: "",
      location: "",
      type: "outdoor",
      capacity: 200,
      facilities: [],
      is_available: true,
    });
    setFacilitiesText("");
    setIsOpen(true);
  };

  const handleOpenEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location,
      type: venue.type,
      capacity: venue.capacity || 0,
      facilities: venue.facilities || [],
      is_available: venue.is_available,
    });
    setFacilitiesText((venue.facilities || []).join(", "));
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) {
      toast.error("Venue name and location are required.");
      return;
    }

    const facilitiesArray = facilitiesText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: VenueInput = {
      ...formData,
      facilities: facilitiesArray,
      capacity: formData.capacity ? Number(formData.capacity) : undefined,
    };

    setLoading(true);
    try {
      if (editingVenue) {
        const res = await updateVenue(editingVenue.id, payload);
        if (!res.success) throw new Error(res.error || "Update failed");
        setVenues((prev) => prev.map((v) => (v.id === editingVenue.id ? { ...v, ...payload } : v)));
        toast.success(`Updated ${payload.name} successfully!`);
      } else {
        const res = await createVenue(payload);
        if (!res.success || !res.data) throw new Error(res.error || "Creation failed");
        setVenues((prev) => [...prev, res.data as Venue]);
        toast.success(`Created ${payload.name} successfully!`);
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVenue) return;
    setLoading(true);
    try {
      const res = await deleteVenue(deletingVenue.id);
      if (!res.success) throw new Error(res.error || "Delete failed");
      setVenues((prev) => prev.filter((v) => v.id !== deletingVenue.id));
      toast.success(`Deleted ${deletingVenue.name} successfully.`);
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete venue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Campus Venues & Facilities
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage sports grounds, indoor arenas, court availability, and tournament locations.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Venue</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search venue name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="All Venue Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="outdoor">Outdoor Ground</SelectItem>
              <SelectItem value="indoor">Indoor Arena</SelectItem>
              <SelectItem value="multipurpose">Multipurpose</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Venues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <span>Campus Venues ({filteredVenues.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ground / Court Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Facilities</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVenues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No venues found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVenues.map((venue) => (
                    <TableRow key={venue.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span>{venue.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{venue.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {venue.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {venue.capacity ? `${venue.capacity} spectators` : "N/A"}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {venue.facilities && venue.facilities.length > 0 ? (
                            venue.facilities.slice(0, 3).map((f, i) => (
                              <span
                                key={i}
                                className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {f}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                          {(venue.facilities?.length || 0) > 3 && (
                            <span className="self-center text-[10px] text-muted-foreground">
                              +{venue.facilities!.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={venue.is_available ? "success" : "secondary"}>
                          {venue.is_available ? "Available" : "Maintenance"}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-1 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(venue)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingVenue(venue);
                            setIsDeleteOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingVenue ? `Edit Venue: ${editingVenue.name}` : "Add Campus Venue"}
              </DialogTitle>
              <DialogDescription>
                Configure venue details, capacity, and campus facilities available.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="venueName" className="text-right">
                  Name
                </Label>
                <Input
                  id="venueName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Football Field North"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sports Complex - North"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="venueType" className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.type}
                    onValueChange={(val: "indoor" | "outdoor" | "multipurpose") =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor Ground</SelectItem>
                      <SelectItem value="indoor">Indoor Arena</SelectItem>
                      <SelectItem value="multipurpose">Multipurpose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={0}
                  value={formData.capacity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="e.g. 500"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="facilities" className="text-right">
                  Facilities
                </Label>
                <Input
                  id="facilities"
                  value={facilitiesText}
                  onChange={(e) => setFacilitiesText(e.target.value)}
                  placeholder="Comma separated: Floodlights, Scoreboard"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isAvailable" className="text-right">
                  Available
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.is_available ? "true" : "false"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, is_available: val === "true" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available for Matches</SelectItem>
                      <SelectItem value="false">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingVenue ? "Save Changes" : "Create Venue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{deletingVenue?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Venue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
