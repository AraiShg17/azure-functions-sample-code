export type User = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  plan: "Enterprise" | "Business" | "Starter";
  status: "アクティブ" | "招待中" | "休止中";
  joinedAt: string;
  initials: string;
  color: string;
  birthDate?: string | null;
  age?: number | null;
  ageLabel?: string;
};
export type Store = {
  id: string;
  name: string;
  companyId: string;
  area: string;
  address: string;
  category: string;
  manager: string;
  monthlySales: number;
  growth: number;
  status: "営業中" | "準備中";
};
export type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string;
  color: string;
  employees: number;
  revenue: number;
  growth: number;
  profit: number;
  fiscalYear: string;
  status: "好調" | "安定" | "要注目";
};
export type Employee = {
  id: string;
  name: string;
  companyId: string;
  department: string;
  role: string;
  email: string;
  location: string;
  joinedAt: string;
  initials: string;
  color: string;
  status: "在籍" | "休暇中";
};
export type DashboardData = {
  users: User[];
  stores: Store[];
  companies: Company[];
  employees: Employee[];
};
export type Section =
  | "overview"
  | "users"
  | "stores"
  | "companies"
  | "employees";
