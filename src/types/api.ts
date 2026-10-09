export type Role = "CANDIDATE" | "COMPANY" | "ADMIN";
export type ProblemType = "MCQ" | "WRITTEN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EVALUATED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiFieldError {
  path?: string;
  message: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string | null;
  skills: string[];
  resumeUrl: string | null;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  website: string | null;
  industry: string | null;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  authProvider: "CREDENTIAL" | "GOOGLE";
  emailVerified: boolean;
  isActive: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  candidateProfile?: CandidateProfile | null;
  companyProfile?: CompanyProfile | null;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProblemOption {
  id: string;
  text: string;
}

export interface Problem {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type: ProblemType;
  difficulty: Difficulty;
  tags: string[];
  options: ProblemOption[] | null;
  correctOption: string | null;
  marks: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentProblem {
  id: string;
  assessmentId: string;
  problemId: string;
  order: number;
  marks: number;
  problem: Problem;
}

export interface Payment {
  id: string;
  assessmentId: string;
  companyId: string;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  status: AssessmentStatus;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
  problems?: AssessmentProblem[];
  payment?: Payment | null;
}

export interface InitiatePaymentResult {
  gatewayPageURL: string;
}

export interface Invitation {
  id: string;
  assessmentId: string;
  email: string;
  candidateId: string | null;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  assessment?: Pick<
    Assessment,
    "id" | "title" | "durationMinutes" | "totalMarks"
  >;
}

export interface InvitationPreview {
  assessmentTitle: string;
  companyName: string;
  durationMinutes: number;
  email: string;
  status: InvitationStatus;
  expiresAt: string;
  requiresRegistration: boolean;
}

export interface Submission {
  id: string;
  attemptId: string;
  problemId: string;
  selectedOption: string | null;
  answerText: string | null;
  isCorrect: boolean | null;
  score: number | null;
  evaluatedById: string | null;
  evaluatedAt: string | null;
  problem?: Problem;
}

export interface Attempt {
  id: string;
  invitationId: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt: string | null;
  totalScore: number | null;
  tabSwitchCount: number;
  assessment?: Pick<Assessment, "id" | "title" | "durationMinutes">;
  candidate?: Pick<User, "id" | "email"> & {
    candidateProfile?: CandidateProfile | null;
  };
  submissions?: Submission[];
}

export interface StartAttemptProblem {
  assessmentProblemId: string;
  order: number;
  marks: number;
  problem: {
    id: string;
    title: string;
    description: string;
    type: ProblemType;
    difficulty: Difficulty;
    options: ProblemOption[] | null;
  };
}

export interface StartAttemptResult {
  attempt: Attempt;
  deadline: string;
  problems: StartAttemptProblem[];
}

export interface AdminStats {
  users: {
    candidates: number;
    companies: number;
    admins: number;
    total: number;
  };
  assessments: {
    draft: number;
    published: number;
    closed: number;
    total: number;
  };
  attempts: {
    inProgress: number;
    submitted: number;
    evaluated: number;
    total: number;
  };
  revenue: { totalAmount: number; successfulPayments: number };
  totalProblems: number;
  totalInvitations: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
  authProvider: "CREDENTIAL" | "GOOGLE";
  profileImage: string | null;
  createdAt: string;
  candidateProfile: { fullName: string } | null;
  companyProfile: { companyName: string } | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  user: { id: string; email: string; role: Role } | null;
}
