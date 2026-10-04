"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  User,
  Shield,
  Phone,
  QrCode,
  Download,
  Edit2,
  Calendar,
  Heart,
  Activity,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  registerPlayerProfile,
  updatePlayerProfile,
  type PlayerProfileInput,
} from "@/actions/players";

const DEPARTMENTS = [
  "Computer Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Telecommunication",
  "Electrical Engineering",
  "Chemical Engineering",
  "Robotics & Automation",
  "MBA",
  "MCA",
];

const YEARS = [
  "First Year (FE)",
  "Second Year (SE)",
  "Third Year (TE)",
  "Final Year (BE)",
  "Postgraduate (ME/MTech)",
  "MBA 1st Year",
  "MBA 2nd Year",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const POPULAR_SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Kabaddi",
  "Kho-Kho",
  "Athletics",
];

interface PlayerProfileViewProps {
  initialPlayer: any;
  user: any;
  initialEditOpen?: boolean;
}

export function PlayerProfileView({
  initialPlayer,
  user,
  initialEditOpen = false,
}: PlayerProfileViewProps) {
  const [player, setPlayer] = useState<any>(initialPlayer);
  const [isEditOpen, setIsEditOpen] = useState(initialEditOpen);
  const [loading, setLoading] = useState(false);

  // Form state for registration or editing
  const [formData, setFormData] = useState<PlayerProfileInput>({
    registration_number: player?.registration_number || "",
    department: player?.department || DEPARTMENTS[0],
    year: player?.year || YEARS[2],
    date_of_birth: player?.date_of_birth || "2004-01-01",
    blood_group: player?.blood_group || "O+",
    height: player?.height || 175,
    weight: player?.weight || 68,
    sports_interested: player?.sports_interested || ["Cricket", "Badminton"],
    emergency_contact: player?.emergency_contact || "",
    medical_info: player?.medical_info || "",
  });

  const openEditModal = () => {
    if (player) {
      setFormData({
        registration_number: player.registration_number || "",
        department: player.department || DEPARTMENTS[0],
        year: player.year || YEARS[2],
        date_of_birth: player.date_of_birth || "2004-01-01",
        blood_group: player.blood_group || "O+",
        height: player.height || 175,
        weight: player.weight || 68,
        sports_interested: player.sports_interested || ["Cricket", "Badminton"],
        emergency_contact: player.emergency_contact || "",
        medical_info: player.medical_info || "",
      });
    }
    setIsEditOpen(true);
  };

  const toggleSport = (sportName: string) => {
    const current = formData.sports_interested || [];
    if (current.includes(sportName)) {
      setFormData({
        ...formData,
        sports_interested: current.filter((s) => s !== sportName),
      });
    } else {
      setFormData({
        ...formData,
        sports_interested: [...current, sportName],
      });
    }
  };

  const handleRegisterOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registration_number.trim()) {
      toast.error("PRN / Registration Number is required.");
      return;
    }
    if (!formData.emergency_contact.trim()) {
      toast.error("Emergency Contact Phone is required.");
      return;
    }

    setLoading(true);
    try {
      if (player?.id) {
        const res = await updatePlayerProfile(player.id, formData);
        if (!res.success || !res.data) throw new Error(res.error || "Update failed");
        setPlayer(res.data);
        toast.success("Sports pass & academic records updated successfully!");
        setIsEditOpen(false);
      } else {
        const res = await registerPlayerProfile(formData);
        if (!res.success || !res.data) throw new Error(res.error || "Registration failed");
        setPlayer(res.data);
        toast.success("Sports pass registered successfully! Your digital pass is permanently active.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const qrValue =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${player?.qr_code || player?.registration_number}`
      : `https://playops.kkwagh.edu.in/verify/${player?.qr_code || "PASS"}`;

  // If user has not yet created a player profile, show the onboarding registration form
  if (!player) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="border-b border-border pb-4">
          <Badge variant="outline" className="mb-2">
            Player Onboarding
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Complete Your Student Athlete Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Register your college PRN to generate your official K. K. Wagh Sports ID Pass and join
            tournament rosters.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Athletic Registration Details</CardTitle>
            <CardDescription>
              Logged in as: <strong className="text-foreground">{user?.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prn">College PRN (Permanent Registration No.)</Label>
                  <Input
                    id="prn"
                    placeholder="e.g. 202301048821"
                    value={formData.registration_number}
                    onChange={(e) =>
                      setFormData({ ...formData, registration_number: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Engineering Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year of Study</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(val) => setFormData({ ...formData, year: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((yr) => (
                        <SelectItem key={yr} value={yr}>
                          {yr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={formData.blood_group}
                    onValueChange={(val) => setFormData({ ...formData, blood_group: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sports of Interest (Select all that apply)</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {POPULAR_SPORTS.map((sport) => {
                    const isSelected = formData.sports_interested?.includes(sport);
                    return (
                      <button
                        type="button"
                        key={sport}
                        onClick={() => toggleSport(sport)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sport}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact Phone & Relationship</Label>
                <Input
                  id="emergency"
                  placeholder="+91 98230 11223 (Parent / Guardian)"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical">Medical Conditions / Allergies (Optional)</Label>
                <Textarea
                  id="medical"
                  placeholder="None, or specify asthma, dust allergies, etc."
                  value={formData.medical_info || ""}
                  onChange={(e) => setFormData({ ...formData, medical_info: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Official Sports ID Pass
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user profile is already registered, display the Official Pass & Information Card
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Player Profile & Digital Pass
          </h1>
          <p className="text-sm text-muted-foreground">
            Official K. K. Wagh Sports ID pass with verifiable QR code check-in.
          </p>
        </div>
        <Button
          onClick={openEditModal}
          className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 font-medium"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit Pass & Academic Year</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Digital ID Pass Card */}
        <Card className="border-primary/30 bg-gradient-to-b from-card to-muted/30 text-center shadow-lg md:col-span-1">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary ring-2 ring-primary/30">
              {player.users?.full_name?.slice(0, 2).toUpperCase() || "AJ"}
            </div>
            <CardTitle className="text-lg font-bold text-foreground">
              {player.users?.full_name || "Student Athlete"}
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              PRN: {player.registration_number}
            </CardDescription>
            <Badge variant="success" className="mx-auto mt-1 gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified Athlete
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            {/* Real Verifiable QR Code */}
            <div className="mx-auto inline-block rounded-xl border border-border bg-white p-4 shadow-sm">
              <QRCodeSVG value={qrValue} size={140} level="M" includeMargin={false} />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {player.qr_code || `PLAYOPS-${player.registration_number}`}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Scan with referee camera to verify eligibility
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                size="sm"
                variant="default"
                className="w-full gap-2 text-xs font-semibold shadow-sm"
                onClick={openEditModal}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Update Academic Year (FE / SE / TE / BE)</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2 text-xs"
                onClick={() => window.print()}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Print / Save Digital Pass</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Academic & Athletic Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Athletic Attributes & Records</CardTitle>
                <CardDescription>
                  Academic department, annual enrollment, and emergency contacts
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5 font-semibold"
                onClick={openEditModal}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Records</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <span className="text-xs text-muted-foreground">Department</span>
                <p className="mt-0.5 font-semibold text-foreground">{player.department}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <span className="text-xs text-muted-foreground">Academic Year</span>
                <p className="mt-0.5 font-semibold text-foreground">{player.year}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <span className="text-xs text-muted-foreground">Blood Group</span>
                <p className="mt-0.5 font-semibold text-foreground">
                  {player.blood_group || "Not provided"}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <span className="text-xs text-muted-foreground">Physical Stats</span>
                <p className="mt-0.5 font-semibold text-foreground">
                  {player.height ? `${player.height} cm` : "—"} /{" "}
                  {player.weight ? `${player.weight} kg` : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Registered Sports Disciplines
              </span>
              <div className="flex flex-wrap gap-2">
                {player.sports_interested && player.sports_interested.length > 0 ? (
                  player.sports_interested.map((s: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="px-2.5 py-1">
                      🏆 {s}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No sports selected yet.</span>
                )}
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Emergency & Medical Information
              </span>
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-mono text-xs">{player.emergency_contact}</span>
                </div>
                {player.medical_info && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Medical Notes:</strong> {player.medical_info}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <form onSubmit={handleRegisterOrUpdate}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Edit2 className="h-5 w-5 text-primary" />
                <span>Edit Sports Pass & Academic Year</span>
              </DialogTitle>
              <DialogDescription>
                Update your academic year of study (FE / SE / TE / BE), branch, sports preferences, or contact details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="edit-prn">College PRN (Permanent Registration No.)</Label>
                <Input
                  id="edit-prn"
                  value={formData.registration_number}
                  onChange={(e) =>
                    setFormData({ ...formData, registration_number: e.target.value })
                  }
                  placeholder="e.g. 72454855G"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(val) => setFormData({ ...formData, year: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((yr) => (
                        <SelectItem key={yr} value={yr}>
                          {yr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Blood Group</Label>
                  <Select
                    value={formData.blood_group}
                    onValueChange={(val) => setFormData({ ...formData, blood_group: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Sports of Interest</Label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_SPORTS.map((sport) => {
                    const isSelected = formData.sports_interested?.includes(sport);
                    return (
                      <button
                        type="button"
                        key={sport}
                        onClick={() => toggleSport(sport)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sport}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Emergency Contact Phone</Label>
                <Input
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Medical Notes</Label>
                <Textarea
                  value={formData.medical_info || ""}
                  onChange={(e) => setFormData({ ...formData, medical_info: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
