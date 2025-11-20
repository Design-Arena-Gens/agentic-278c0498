"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mcqQuestions } from "@/data/questions";
import { subjects } from "@/data/subjects";
import { McqQuestion } from "@/types";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

type ViewState = "setup" | "quiz" | "result";

export default function McqClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialSubject = (params.get("subject") as string) || "all";
  const [subjectId, setSubjectId] = useState<string>(initialSubject);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [view, setView] = useState<ViewState>("setup");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [order, setOrder] = useState<number[]>([]);

  const availableQuestions = useMemo(() => {
    const pool =
      subjectId === "all"
        ? mcqQuestions
        : mcqQuestions.filter((q) => q.subjectId === subjectId);
    return pool;
  }, [subjectId]);

  const quizQuestions: McqQuestion[] = useMemo(() => {
    const idxs =
      order.length > 0
        ? order
        : shuffle(Array.from({ length: availableQuestions.length }, (_, i) => i)).slice(
            0,
            Math.min(numQuestions, availableQuestions.length)
          );
    return idxs.map((i) => availableQuestions[i]);
  }, [availableQuestions, numQuestions, order]);

  useEffect(() => {
    if (initialSubject) {
      setSubjectId(initialSubject);
    }
  }, [initialSubject]);

  function startQuiz() {
    const generatedOrder = shuffle(
      Array.from({ length: availableQuestions.length }, (_, i) => i)
    ).slice(0, Math.min(numQuestions, availableQuestions.length));
    setOrder(generatedOrder);
    setCurrentIndex(0);
    setScore(0);
    setSelectedId(null);
    setView("quiz");
    const url = subjectId === "all" ? "/mcq" : `/mcq?subject=${subjectId}`;
    router.replace(url);
  }

  function submitAnswer(optionId: string) {
    if (selectedId) return;
    setSelectedId(optionId);
    const q = quizQuestions[currentIndex];
    if (optionId === q.answerId) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
    } else {
      setView("result");
      persistProgress();
    }
  }

  function persistProgress() {
    const key = "studypro:quiz-progress";
    const existing = loadFromStorage<any[]>(key, []);
    existing.unshift({
      subjectId,
      correct: score,
      total: quizQuestions.length,
      completedAt: Date.now(),
    });
    saveToStorage(key, existing.slice(0, 20));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        MCQ Practice
      </h1>
      {view === "setup" && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Subject</label>
              <select
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="all">All subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Number of questions</label>
              <input
                type="number"
                min={1}
                max={20}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
          >
            Start Quiz
          </button>
        </div>
      )}

      {view === "quiz" && quizQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Question {currentIndex + 1} of {quizQuestions.length}
          </div>
          <QuestionCard
            question={quizQuestions[currentIndex]}
            selectedId={selectedId}
            onSelect={submitAnswer}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Score: {score}</div>
            <button
              onClick={nextQuestion}
              disabled={!selectedId}
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
            >
              {currentIndex + 1 < quizQuestions.length ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      )}

      {view === "result" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Results</div>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              You scored {score} / {quizQuestions.length}
            </p>
            <button
              className="mt-3 inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-black"
              onClick={() => setView("setup")}
            >
              Try Again
            </button>
          </div>
          <div className="space-y-3">
            {quizQuestions.map((q, i) => (
              <ReviewItem key={q.id} q={q} idx={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard(props: {
  question: McqQuestion;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
}) {
  const { question, selectedId, onSelect } = props;
  const answered = Boolean(selectedId);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
      <div className="text-zinc-900 dark:text-zinc-100">{question.question}</div>
      <div className="mt-3 grid gap-2">
        {question.options.map((o) => {
          const isCorrect = o.id === question.answerId;
          const isSelected = selectedId === o.id;
          const color = !answered
            ? "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            : isCorrect
            ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
            : isSelected
            ? "border-red-600 bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200"
            : "opacity-60";
          return (
            <button
              key={o.id}
              disabled={answered}
              onClick={() => onSelect(o.id)}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${color}`}
            >
              {o.text}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {question.explanation}
        </div>
      )}
    </div>
  );
}

function ReviewItem({ q, idx }: { q: McqQuestion; idx: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {idx + 1}. {q.question}
      </div>
      <div className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
        Correct answer: {q.options.find((o) => o.id === q.answerId)?.text}
      </div>
      {q.explanation && (
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{q.explanation}</div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
