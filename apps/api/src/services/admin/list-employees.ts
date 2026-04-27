import { listEmployees as listEmployeesRepository } from "../../repositories/employees.repository.js";

export async function listEmployees() {
  return listEmployeesRepository();
}
