import "server-only";
import users from "@/data/users.json";
import stores from "@/data/stores.json";
import companies from "@/data/companies.json";
import employees from "@/data/employees.json";
import type { DashboardData, User, Store, Company, Employee } from "./types";

/**
 * Data access boundary. Replace these functions with database queries when a DB is ready.
 * The pages and UI only depend on the returned types, never on JSON files directly.
 */
function getAgeFromBirthDate(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;

  const date = new Date(`${birthDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  if (date > todayUtc) return null;

  let age = todayUtc.getUTCFullYear() - date.getUTCFullYear();
  const birthdayHasPassed =
    todayUtc.getUTCMonth() > date.getUTCMonth() ||
    (todayUtc.getUTCMonth() === date.getUTCMonth() &&
      todayUtc.getUTCDate() >= date.getUTCDate());
  if (!birthdayHasPassed) age -= 1;

  return age >= 0 && age <= 120 ? age : null;
}

function withAgeLabel(user: User): User {
  const age =
    user.age != null && Number.isInteger(user.age) && user.age >= 0 && user.age <= 120
      ? user.age
      : getAgeFromBirthDate(user.birthDate);

  return {
    ...user,
    age,
    ageLabel: age == null ? "未登録" : `${age}歳`,
  };
}

export async function getUsers(): Promise<User[]> {
  return (users as User[]).map(withAgeLabel);
}
export async function getStores(): Promise<Store[]> {
  return stores as Store[];
}
export async function getCompanies(): Promise<Company[]> {
  return companies as Company[];
}
export async function getEmployees(): Promise<Employee[]> {
  return employees as Employee[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const [users, stores, companies, employees] = await Promise.all([
    getUsers(),
    getStores(),
    getCompanies(),
    getEmployees(),
  ]);
  return { users, stores, companies, employees };
}
