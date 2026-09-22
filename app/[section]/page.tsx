import { notFound } from "next/navigation";
import Dashboard from "@/components/dashboard";
import { getDashboardData } from "@/lib/repository";
import type { Section } from "@/lib/types";

const sections: Section[] = ["users", "stores", "companies", "employees"];

export const dynamic = "force-dynamic";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.includes(section as Section)) notFound();
  return (
    <Dashboard data={await getDashboardData()} section={section as Section} />
  );
}
