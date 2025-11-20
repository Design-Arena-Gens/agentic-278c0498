"use client";
import { useEffect, useMemo, useState } from "react";
import { flashcards } from "@/data/flashcards";
import { subjects } from "@/data/subjects";
import { Flashcard } from "@/types";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

export default function FlashcardsPage() {
  const [subjectId, setSubjectId] = useState<string>("all");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = loadFromStorage<string[]>("studypro:flash-known", []);
    setKnown(new Set(stored));
  }, []);

  useEffect(() => {
    saveToStorage("studypro:flash-known", Array.from(known));
  }, [known]);

  const cards: Flashcard[] = useMemo(() => {
    const pool = subjectId === "all" ? flashcards : flashcards.filter((c) => c.subjectId === subjectId);
    return pool;
  }, [subjectId]);

  function next() {
    setFlipped(false);
    setIdx((i) => (i + 1) % Math.max(cards.length, 1));
  }
  function prev() {
    setFlipped(false);
    setIdx((i) => (i - 1 + Math.max(cards.length, 1)) % Math.max(cards.length, 1));
  }
  function toggleKnown() {
    const id = cards[idx]?.id;
    if (!id) return;
    setKnown((k) => {
      const n = new Set(k);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const current = cards[idx];
  const knownCount = Array.from(known).filter((id) => cards.some((c) => c.id === id)).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Flashcards</h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
        <div>
          <label className="text-sm text-zinc-600 dark:text-zinc-400">Subject</label>
          <select
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setIdx(0);
              setFlipped(false);
            }}
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>{knownCount} known / {cards.length} cards</span>
          <span>{cards.length > 0 ? idx + 1 : 0} of {cards.length}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div
          className="relative h-48 w-full max-w-xl cursor-pointer [perspective:1000px]"
          onClick={() => setFlipped((f) => !f)}
        >
          <div className={`absolute inset-0 rounded-2xl border border-zinc-200 bg-white p-6 text-center text-lg transition-transform duration-500 [transform-style:preserve-3d] dark:border-zinc-800 dark:bg-zinc-900 ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
            <div className="absolute inset-0 grid place-items-center [backface-visibility:hidden]">
              <div className="text-zinc-900 dark:text-zinc-100">{current?.front ?? "No cards"}</div>
            </div>
            <div className="absolute inset-0 grid place-items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="text-zinc-900 dark:text-zinc-100">{current?.back ?? "Add more cards"}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Prev</button>
          <button onClick={() => setFlipped((f) => !f)} className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-black">Flip</button>
          <button onClick={next} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Next</button>
          <button onClick={toggleKnown} className={`rounded-md px-3 py-2 text-sm ${current && known.has(current.id) ? "bg-emerald-600 text-white" : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"}`}>
            {current && known.has(current.id) ? "Known" : "Mark Known"}
          </button>
        </div>
      </div>
    </div>
  );
}
