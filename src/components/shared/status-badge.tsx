import { Badge } from "@/components/ui/badge";
import { STATUS_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-0 font-medium", STATUS_COLOR[status] ?? "bg-muted")}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
