import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-merino-ecru flex items-center justify-center">Calcul en cours...</div>}>
      <ConfirmationClient />
    </Suspense>
  );
}
