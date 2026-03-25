import { Suspense } from "react";
import ChargementClient from "./ChargementClient";

export default function ChargementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-merino-blue flex items-center justify-center text-white">Chargement...</div>}>
      <ChargementClient />
    </Suspense>
  );
}
