"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
	name: z.string().min(2, "Enter your name"),
	email: z.email("Enter a valid email address"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactValues = z.infer<typeof schema>;

// TODO: replace with your real support address.
// There is no contact endpoint on the backend, so this opens the visitor's own
// mail client instead of pretending to send something.
const SUPPORT_EMAIL = "support@skillforge.com";

export function ContactForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactValues>({ resolver: zodResolver(schema) });

	const onSubmit = (v: ContactValues) => {
		const subject = encodeURIComponent(`SkillForge enquiry from ${v.name}`);
		const body = encodeURIComponent(`${v.message}\n\n— ${v.name} (${v.email})`);
		window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
			<div className="space-y-2">
				<Label htmlFor="name">Name</Label>
				<Input id="name" {...register("name")} />
				{errors.name && (
					<p className="text-sm text-destructive">{errors.name.message}</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" {...register("email")} />
				{errors.email && (
					<p className="text-sm text-destructive">{errors.email.message}</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="message">Message</Label>
				<Textarea id="message" rows={5} {...register("message")} />
				{errors.message && (
					<p className="text-sm text-destructive">{errors.message.message}</p>
				)}
			</div>
			<Button type="submit" className="w-full">
				Open in email app
			</Button>
		</form>
	);
}
