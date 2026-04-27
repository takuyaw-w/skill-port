import { hashInvitationToken } from "../../lib/invitation-token.js";
import { findPendingInvitationByTokenHash } from "../../repositories/employee-invitation-tokens.repository.js";

export async function getPendingInvitationByToken(token: string) {
  const tokenHash = hashInvitationToken(token);

  return findPendingInvitationByTokenHash(tokenHash);
}
