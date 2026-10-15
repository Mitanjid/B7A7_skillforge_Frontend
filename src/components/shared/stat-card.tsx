import type { Icon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: Icon;
	hint?: string;
}

export function StatCard({
	label,
	value,
	icon: IconComponent,
	hint,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{label}
				</CardTitle>
				<IconComponent className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-bold">{value}</p>
				{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
			</CardContent>
		</Card>
	);
}
