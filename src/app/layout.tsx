import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SkillForge", template: "%s | SkillForge" },
  description:
    "Create, run and grade developer assessments. Invite candidates, auto-grade MCQs, and review written answers in one place.",
  openGraph: {
    title: "SkillForge",
    description: "The developer assessment platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontHeading.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
