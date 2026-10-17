import "server-only";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { serverFetch } from "@/lib/server-api";
import type { Role, User } from "@/types/api";

// Real role check on the server. proxy.ts only decodes the JWT for routing UX;
// this confirms the session with the backend before rendering a dashboard.
export async function requireRole(role: Role): Promise<User> {
	let user: User;
	try {
		user = (await serverFetch<User>("/users/me")).data;
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) redirect("/login");
		throw err;
	}
	if (user.role !== role) redirect("/login");
	return user;
}
