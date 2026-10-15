export function PageHero({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) {
	return (
		<section className="border-b bg-muted/30">
			<div className="mx-auto max-w-4xl px-4 py-14 text-center">
				<h1 className="font-heading text-3xl font-semibold sm:text-4xl">
					{title}
				</h1>
				<p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
					{subtitle}
				</p>
			</div>
		</section>
	);
}
