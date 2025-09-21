import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "warning";
}

const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary", 
  accent: "text-accent",
  warning: "text-warning"
};

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <Card className="card-hover minimal-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {value.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/30">
            <Icon className={`w-6 h-6 ${colorClasses[color]} icon-glow`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}