import { Settings, Shield, Bell, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Portal Configuration & Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          System parameters, institution details, points engine weighting, and API integrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Institution Branding</CardTitle>
          <CardDescription>Displayed across certificates and official portals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inst">College Name</Label>
            <Input id="inst" defaultValue="K. K. Wagh Institute of Engineering Education & Research" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campus">Campus Address</Label>
            <Input id="campus" defaultValue="Hirabai Haridas Vidyanagari, Amrutdham, Panchavati, Nashik" />
          </div>
          <Button size="sm">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
