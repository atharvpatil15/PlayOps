import { Users, Shield, Plus, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PlayerTeamPage() {
  const teamMembers = [
    { name: "Atharva Joshi (You)", jersey: 7, role: "Captain / Batsman", prn: "202301048821" },
    { name: "Rohan Patil", jersey: 18, role: "All-Rounder", prn: "202301048822" },
    { name: "Siddhesh Shinde", jersey: 45, role: "Opening Batsman", prn: "202301048835" },
    { name: "Omkar Deshmukh", jersey: 99, role: "Wicket Keeper", prn: "202301048840" },
    { name: "Pranav Kulkarni", jersey: 12, role: "Fast Bowler", prn: "202301048848" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Team Squad
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your registered team members, jerseys, and tournament lineups.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Teammate</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Computer Strikers</span>
              </CardTitle>
              <CardDescription>Department of Computer Engineering • Cricket Squad</CardDescription>
            </div>
            <Badge variant="success">Registered Squad (12/15)</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {teamMembers.map((member) => (
              <div key={member.prn} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                    #{member.jersey}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role} • PRN: {member.prn}</p>
                  </div>
                </div>
                <Badge variant="outline">Verified</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
