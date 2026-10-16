import { Wizard } from "./wizard";

export const metadata = { title: "New assessment" };

export default function NewAssessmentPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Create assessment</h1>
      <Wizard />
    </div>
  );
}
