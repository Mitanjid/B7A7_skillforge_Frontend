"use client";

import { NAV_ITEMS, ROLE_LABEL } from "@/lib/nav-config";
import type { User } from "@/types/api";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardShellProps {
	user: User;
	children: React.ReactNode;
}

// Nav items contain icon components, which can't be passed from a Server
// Component, so the shell looks them up itself from the user's role.
export function DashboardShell({ user, children }: DashboardShellProps) {
	const navItems = NAV_ITEMS[user.role];

	return (
		<div className="flex min-h-screen">
			<aside className="hidden w-64 shrink-0 border-r lg:block">
				<Sidebar items={navItems} brand={ROLE_LABEL[user.role]} />
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<Topbar user={user} navItems={navItems} />
				<main className="flex-1 p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
