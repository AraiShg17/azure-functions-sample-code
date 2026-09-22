import {
  getUsers,
  getStores,
  getCompanies,
  getEmployees,
} from "@/lib/repository";

const sources = {
  users: getUsers,
  stores: getStores,
  companies: getCompanies,
  employees: getEmployees,
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const { entity } = await params;
  if (!(entity in sources))
    return Response.json({ error: "Unknown entity" }, { status: 404 });
  const items = await sources[entity as keyof typeof sources]();
  return Response.json({ items, count: items.length });
}
