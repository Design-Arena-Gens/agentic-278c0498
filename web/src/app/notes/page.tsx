import Link from "next/link";
import { notes } from "@/data/notes";
import { subjects } from "@/data/subjects";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Theory Notes</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n) => {
          const subject = subjects.find((s) => s.id === n.subjectId);
          return (
            <Link key={n.id} href={`/notes/${n.id}`} className={`rounded-2xl bg-gradient-to-br ${subject?.color ?? "from-zinc-500 to-zinc-700"} p-[2px]`}>
              <div className="h-full rounded-[14px] bg-white p-5 dark:bg-black">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{subject?.name}</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{n.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
