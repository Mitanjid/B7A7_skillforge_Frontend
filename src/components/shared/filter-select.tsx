"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FilterSelectProps {
	param: string;
	label: string;
	options: { value: string; label: string }[];
}

export function FilterSelect({ param, label, options }: FilterSelectProps) {
	const router = useRouter();
	const params = useSearchParams();

	const onChange = (value: string) => {
		const sp = new URLSearchParams(params.toString());
		if (value) sp.set(param, value);
		else sp.delete(param);
		sp.set("page", "1");
		router.push(`?${sp.toString()}`);
	};

	return (
		<select
			aria-label={label}
			value={params.get(param) ?? ""}
			onChange={(e) => onChange(e.target.value)}
			className="h-9 rounded-md border bg-background px-3 text-sm"
		>
			<option value="">{label}</option>
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
	);
}
