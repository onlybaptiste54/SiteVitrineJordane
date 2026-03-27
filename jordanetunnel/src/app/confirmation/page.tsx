import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ConfirmationClient, { type EstimationData } from "./ConfirmationClient";

export default async function ConfirmationPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("merino_estimation")?.value;

  if (!raw) redirect("/");

  let data: EstimationData;
  try {
    data = JSON.parse(raw) as EstimationData;
  } catch {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-merino-ecru flex items-center justify-center">Chargement...</div>}>
      <ConfirmationClient data={data} />
    </Suspense>
  );
}
