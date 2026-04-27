import { db } from '../../src/db/client.js'
import { account, employeeInvitationTokens, employees, healthChecks, session, user, verification } from '../../src/db/schema.js'

export async function cleanupDatabase() {
  await db.delete(employeeInvitationTokens)
  await db.delete(employees)

  await db.delete(session)
  await db.delete(account)
  await db.delete(verification)
  await db.delete(user)

  await db.delete(healthChecks)
}
