"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function AdminSettingsPage() {
	const { user } = useAuth();
	const { theme, setTheme } = useTheme();

	return (
		<div className="mx-auto max-w-xl space-y-6">
			<h1 className="text-2xl font-semibold">Settings</h1>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Account</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1 text-sm">
					<p>
						<span className="text-muted-foreground">Email: </span>
						{user?.email}
					</p>
					<p>
						<span className="text-muted-foreground">Role: </span>
						{user?.role}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Appearance</CardTitle>
				</CardHeader>
				<CardContent className="flex gap-2">
					<Button
						variant={theme === "light" ? "default" : "outline"}
						onClick={() => setTheme("light")}
					>
						<Sun className="mr-2 size-4" />
						Light
					</Button>
					<Button
						variant={theme === "dark" ? "default" : "outline"}
						onClick={() => setTheme("dark")}
					>
						<Moon className="mr-2 size-4" />
						Dark
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
