import {
  Buildings,
  ChartBar,
  ChartLineUp,
  ClipboardText,
  CreditCard,
  FileText,
  Gauge,
  Gear,
  ListChecks,
  Scroll,
  UserCircle,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import type { Role } from "@/types/api";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof Gauge;
  exact?: boolean;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  CANDIDATE: [
    { label: "Overview", href: "/dashboard", icon: Gauge, exact: true },
    { label: "My Attempts", href: "/dashboard/attempts", icon: ClipboardText },
    { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  COMPANY: [
    { label: "Overview", href: "/company", icon: Gauge, exact: true },
    { label: "Problems", href: "/company/problems", icon: FileText },
    { label: "Assessments", href: "/company/assessments", icon: ListChecks },
    { label: "Billing", href: "/company/billing", icon: CreditCard },
    { label: "Analytics", href: "/company/analytics", icon: ChartLineUp },
    { label: "Profile", href: "/company/profile", icon: Buildings },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: Gauge, exact: true },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: Scroll },
    { label: "Analytics", href: "/admin/analytics", icon: ChartBar },
    { label: "Settings", href: "/admin/settings", icon: Gear },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  CANDIDATE: "Candidate",
  COMPANY: "Company",
  ADMIN: "Admin",
};
