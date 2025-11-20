import { Suspense } from "react";
import McqClient from "./McqClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-zinc-600 dark:text-zinc-400">Loading?</div>}>
      <McqClient />
    </Suspense>
  );
}
