import Dashboard from "@/components/dashboard";
import { getDashboardData } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <Dashboard data={await getDashboardData()} section="overview" />;
}
