"use client";

import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Warning,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	useFlagViolation,
	useSubmitAnswer,
	useSubmitAttempt,
} from "@/hooks/use-attempts";
import { cn } from "@/lib/utils";
import type { StartAttemptProblem } from "@/types/api";

interface ExamRoomProps {
	attemptId: string;
	deadline: string;
	problems: StartAttemptProblem[];
}

type SaveState = "idle" | "saving" | "saved";
interface Answer {
	selectedOption?: string;
	answerText?: string;
}

export function ExamRoom({ attemptId, deadline, problems }: ExamRoomProps) {
	const submitAnswer = useSubmitAnswer(attemptId);
	const submitAttempt = useSubmitAttempt(attemptId);
	const flagViolation = useFlagViolation(attemptId);

	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<string, Answer>>({});
	const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
	const [tabSwitches, setTabSwitches] = useState(0);
	const [remainingMs, setRemainingMs] = useState(
		new Date(deadline).getTime() - Date.now(),
	);
	const autoSubmitted = useRef(false);
	const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
		{},
	);

	// Refs so the long-lived timer/listener always call the latest mutations.
	const submitRef = useRef(submitAttempt.mutate);
	submitRef.current = submitAttempt.mutate;
	const flagRef = useRef(flagViolation.mutate);
	flagRef.current = flagViolation.mutate;

	const problem = problems[current];

	// Countdown, with auto-submit at the deadline.
	useEffect(() => {
		const id = setInterval(() => {
			const left = new Date(deadline).getTime() - Date.now();
			setRemainingMs(left);
			if (left <= 0 && !autoSubmitted.current) {
				autoSubmitted.current = true;
				clearInterval(id);
				toast.warning("Time's up. Submitting your attempt.");
				submitRef.current();
			}
		}, 1000);
		return () => clearInterval(id);
	}, [deadline]);

	// Tab-switch detection, reported to the backend so the count survives a
	// refresh and the company sees it while grading.
	useEffect(() => {
		const onVisibility = () => {
			if (document.visibilityState !== "hidden") return;
			flagRef.current(undefined, {
				onSuccess: ({ data }) => setTabSwitches(data.tabSwitchCount),
				onError: () => setTabSwitches((n) => n + 1),
			});
			toast.warning("Switching tabs during the exam is noted.", {
				id: "tab-switch-warning",
			});
		};
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	// Clear pending autosave timers on unmount.
	useEffect(() => {
		const timers = debounceTimers.current;
		return () => {
			for (const t of Object.values(timers)) clearTimeout(t);
		};
	}, []);

	const saveAnswer = (problemId: string, value: Answer) => {
		setAnswers((prev) => ({ ...prev, [problemId]: value }));
		setSaveState((prev) => ({ ...prev, [problemId]: "saving" }));

		clearTimeout(debounceTimers.current[problemId]);
		debounceTimers.current[problemId] = setTimeout(() => {
			// The backend rejects empty written answers, so don't send them.
			if (value.answerText !== undefined && !value.answerText.trim()) {
				setSaveState((prev) => ({ ...prev, [problemId]: "idle" }));
				return;
			}
			submitAnswer.mutate(
				{ problemId, ...value },
				{
					onSuccess: () =>
						setSaveState((prev) => ({ ...prev, [problemId]: "saved" })),
					onError: () =>
						setSaveState((prev) => ({ ...prev, [problemId]: "idle" })),
				},
			);
		}, 700);
	};

	const answeredCount = useMemo(
		() =>
			problems.filter((p) => {
				const a = answers[p.problem.id];
				return !!a && (!!a.selectedOption || !!a.answerText?.trim());
			}).length,
		[problems, answers],
	);

	const minutes = Math.max(0, Math.floor(remainingMs / 60_000));
	const seconds = Math.max(0, Math.floor((remainingMs % 60_000) / 1000));
	const lowTime = remainingMs < 5 * 60_000;

	if (!problem) return null;

	const currentAnswer = answers[problem.problem.id] ?? {};
	const currentSaveState = saveState[problem.problem.id] ?? "idle";

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
				<p className="text-sm text-muted-foreground">
					Question {current + 1} of {problems.length} · {answeredCount} answered
				</p>
				<div
					className={cn(
						"rounded-md px-3 py-1 font-mono text-sm font-medium",
						lowTime ? "bg-destructive/10 text-destructive" : "bg-muted",
					)}
					role="timer"
				>
					{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-[1fr_200px]">
				<Card>
					<CardContent className="space-y-4 p-5">
						<div className="flex items-center justify-between">
							<Badge variant="outline">{problem.problem.type}</Badge>
							<Badge variant="outline">{problem.marks} marks</Badge>
						</div>

						<div>
							<h2 className="text-lg font-semibold">{problem.problem.title}</h2>
							<p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
								{problem.problem.description}
							</p>
						</div>

						{problem.problem.type === "MCQ" ? (
							<div className="space-y-2">
								{problem.problem.options?.map((opt) => (
									<label
										key={opt.id}
										className={cn(
											"flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors",
											currentAnswer.selectedOption === opt.id
												? "border-primary bg-primary/5"
												: "hover:bg-muted/50",
										)}
									>
										<input
											type="radio"
											name={`q-${problem.problem.id}`}
											checked={currentAnswer.selectedOption === opt.id}
											onChange={() =>
												saveAnswer(problem.problem.id, {
													selectedOption: opt.id,
												})
											}
										/>
										{opt.text}
									</label>
								))}
							</div>
						) : (
							<Textarea
								rows={10}
								placeholder="Type your answer here..."
								value={currentAnswer.answerText ?? ""}
								onChange={(e) =>
									saveAnswer(problem.problem.id, {
										answerText: e.target.value,
									})
								}
							/>
						)}

						<p className="h-4 text-xs text-muted-foreground">
							{currentSaveState === "saving" && "Saving…"}
							{currentSaveState === "saved" && "Saved"}
						</p>

						<div className="flex items-center justify-between pt-2">
							<Button
								variant="outline"
								disabled={current === 0}
								onClick={() => setCurrent((c) => c - 1)}
							>
								<ArrowLeft className="mr-2 size-4" />
								Previous
							</Button>
							{current < problems.length - 1 ? (
								<Button onClick={() => setCurrent((c) => c + 1)}>
									Next
									<ArrowRight className="ml-2 size-4" />
								</Button>
							) : (
								<AlertDialog>
									<AlertDialogTrigger render={<Button />}>
										Finish & submit
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Submit your attempt?</AlertDialogTitle>
											<AlertDialogDescription>
												You've answered {answeredCount} of {problems.length}{" "}
												questions. You won't be able to make changes after
												submitting.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Keep working</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => submitAttempt.mutate()}
											>
												Submit
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</CardContent>
				</Card>

				<Card className="h-fit">
					<CardContent className="p-4">
						<p className="mb-3 text-sm font-medium">Questions</p>
						<div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
							{problems.map((p, i) => {
								const a = answers[p.problem.id];
								const answered =
									!!a && (!!a.selectedOption || !!a.answerText?.trim());
								return (
									<button
										key={p.problem.id}
										type="button"
										onClick={() => setCurrent(i)}
										aria-label={`Go to question ${i + 1}`}
										className={cn(
											"flex size-9 items-center justify-center rounded-md border text-xs font-medium",
											i === current && "ring-2 ring-primary",
											answered
												? "bg-primary/10 text-primary"
												: "bg-muted text-muted-foreground",
										)}
									>
										{answered ? (
											<CheckCircle className="size-4" weight="fill" />
										) : (
											i + 1
										)}
									</button>
								);
							})}
						</div>

						{tabSwitches > 0 && (
							<p className="mt-4 flex items-center gap-1 text-xs text-destructive">
								<Warning className="size-3" />
								{tabSwitches} tab switch{tabSwitches > 1 ? "es" : ""} detected
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
