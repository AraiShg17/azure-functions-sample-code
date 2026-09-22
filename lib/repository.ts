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
export async function getUsers(): Promise<User[]> {
  return users as User[];
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
