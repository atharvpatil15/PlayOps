"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Trophy, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createSport, updateSport, deleteSport, type SportInput } from "@/actions/sports";

interface Sport {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  max_players_per_team: number;
  min_players_per_team: number;
  description: string | null;
  icon: string | null;
  is_active: boolean;
}

interface SportsManagementProps {
  initialSports: Sport[];
}

export function SportsManagement({ initialSports }: SportsManagementProps) {
  const [sports, setSports] = useState<Sport[]>(initialSports);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  const [deletingSport, setDeletingSport] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<SportInput>({
    name: "",
    type: "outdoor",
    max_players_per_team: 11,
    min_players_per_team: 7,
    description: "",
    icon: "🏆",
    is_active: true,
  });

  const filteredSports = sports.filter((sport) => {
    const matchesSearch = sport.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || sport.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    setEditingSport(null);
    setFormData({
      name: "",
      type: "outdoor",
      max_players_per_team: 11,
      min_players_per_team: 7,
      description: "",
      icon: "🏆",
      is_active: true,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (sport: Sport) => {
    setEditingSport(sport);
    setFormData({
      name: sport.name,
      type: sport.type,
      max_players_per_team: sport.max_players_per_team,
      min_players_per_team: sport.min_players_per_team,
      description: sport.description || "",
      icon: sport.icon || "🏆",
      is_active: sport.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a sport name.");
      return;
    }
    if (formData.min_players_per_team > formData.max_players_per_team) {
      toast.error("Min players cannot exceed max players per team.");
      return;
    }

    setLoading(true);
    try {
      if (editingSport) {
        const res = await updateSport(editingSport.id, formData);
        if (!res.success) throw new Error(res.error || "Update failed");
        setSports((prev) =>
          prev.map((s) => (s.id === editingSport.id ? { ...s, ...formData } : s))
        );
        toast.success(`Updated ${formData.name} successfully!`);
      } else {
        const res = await createSport(formData);
        if (!res.success || !res.data) throw new Error(res.error || "Creation failed");
        setSports((prev) => [...prev, res.data as Sport]);
        toast.success(`Added ${formData.name} successfully!`);
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSport) return;
    setLoading(true);
    try {
      const res = await deleteSport(deletingSport.id);
      if (!res.success) throw new Error(res.error || "Delete failed");
      setSports((prev) => prev.filter((s) => s.id !== deletingSport.id));
      toast.success(`Deleted ${deletingSport.name} successfully.`);
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete sport.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sports Catalog Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure official college sports, team roster requirements, and rulebooks.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Sport</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sports by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="All Classifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="indoor">Indoor Sports</SelectItem>
              <SelectItem value="outdoor">Outdoor Sports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <span>Configured Sports ({filteredSports.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Icon</TableHead>
                  <TableHead>Sport Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Min Players</TableHead>
                  <TableHead>Max Roster</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No sports found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSports.map((sport) => (
                    <TableRow key={sport.id} className="hover:bg-muted/50">
                      <TableCell className="text-2xl">{sport.icon || "🏆"}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        <div>{sport.name}</div>
                        {sport.description && (
                          <div className="line-clamp-1 text-xs text-muted-foreground">
                            {sport.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {sport.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{sport.min_players_per_team}</TableCell>
                      <TableCell>{sport.max_players_per_team}</TableCell>
                      <TableCell>
                        <Badge variant={sport.is_active ? "success" : "secondary"}>
                          {sport.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-1 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(sport)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingSport(sport);
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
                {editingSport ? `Edit Sport: ${editingSport.name}` : "Add New Sport"}
              </DialogTitle>
              <DialogDescription>
                Define sport classification, roster requirements, and rule description.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon / Emoji
                </Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. 🏏"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Football"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.type}
                    onValueChange={(val: "indoor" | "outdoor") =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minPlayers" className="text-right">
                  Min Players
                </Label>
                <Input
                  id="minPlayers"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.min_players_per_team}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_players_per_team: parseInt(e.target.value) || 1,
                    })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxPlayers" className="text-right">
                  Max Roster
                </Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.max_players_per_team}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_players_per_team: parseInt(e.target.value) || 1,
                    })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="desc" className="pt-2 text-right">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description or rules overview..."
                  className="col-span-3"
                />
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
                {editingSport ? "Save Changes" : "Create Sport"}
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
              <strong className="text-foreground">{deletingSport?.name}</strong>? This action cannot
              be undone if tournaments are linked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Sport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
