import cli from "./client.ts";

export async function create(name: string, password: string, code: string) {
  return await cli.post("/user/create", {
    name,
    password,
    code,
  });
}
