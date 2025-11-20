import { notes } from "@/data/notes";
import { subjects } from "@/data/subjects";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function NoteDetail({ params }: Props) {
  const { id } = params;
  const note = notes.find((n) => n.id === id);
  if (!note) return notFound();
  const subject = subjects.find((s) => s.id === note.subjectId);
  return (
    <div className="space-y-6">
      <div>
        <Link href="/notes" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          ? Back to notes
        </Link>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {subject?.name}
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {note.title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{note.summary}</p>
        <div className="mt-4 space-y-5">
          {note.sections.map((s) => (
            <section key={s.heading} className="space-y-2">
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {s.heading}
              </h2>
              <div className="space-y-2">
                {s.content.map((p, i) => (
                  <p key={i} className="text-zinc-700 dark:text-zinc-300">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
