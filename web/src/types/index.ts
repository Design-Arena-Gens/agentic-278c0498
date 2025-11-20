export type SubjectId = "math" | "physics" | "chemistry" | "biology" | "history";

export interface Subject {
  id: SubjectId;
  name: string;
  color: string;
  description: string;
}

export interface McqOption {
  id: string;
  text: string;
}

export interface McqQuestion {
  id: string;
  subjectId: SubjectId;
  question: string;
  options: McqOption[];
  answerId: string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  front: string;
  back: string;
}

export interface NoteSection {
  heading: string;
  content: string[];
}

export interface NoteArticle {
  id: string;
  subjectId: SubjectId;
  title: string;
  summary: string;
  sections: NoteSection[];
}

export interface QuizProgress {
  subjectId: SubjectId | "all";
  correct: number;
  total: number;
  completedAt: number;
}

export interface FlashcardProgress {
  knownCardIds: string[];
  lastReviewedAt: number;
}

