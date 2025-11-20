import Link from "next/link";
import { subjects } from "@/data/subjects";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Master exams with MCQs, Flashcards, and Notes
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Practice smarter. Remember longer. Understand deeper.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          href="/mcq"
          title="MCQ Practice"
          description="Timed quizzes, instant feedback, explanations."
          gradient="from-indigo-500 to-cyan-500"
        />
        <FeatureCard
          href="/flashcards"
          title="Flashcards"
          description="Active recall with simple flip interactions."
          gradient="from-amber-500 to-red-500"
        />
        <FeatureCard
          href="/notes"
          title="Theory Notes"
          description="Concise summaries and quick references."
          gradient="from-emerald-500 to-lime-500"
        />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Subjects
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={`/mcq?subject=${s.id}`}
              className={`rounded-xl bg-gradient-to-br ${s.color} p-[1px] transition-transform hover:scale-[1.01]`}
            >
              <div className="h-full rounded-[11px] bg-white p-4 dark:bg-black">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {s.name}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {s.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard(props: {
  href: string;
  title: string;
  description: string;
  gradient: string;
}) {
  const { href, title, description, gradient } = props;
  return (
    <Link
      href={href}
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-[2px] transition-transform hover:scale-[1.01]`}
    >
      <div className="h-full rounded-[14px] bg-white p-5 dark:bg-black">
        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
