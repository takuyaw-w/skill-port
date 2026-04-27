import { z } from "zod";

export const acceptInvitationRequestSchema = z
  .object({
    password: z.string().min(8).max(128),
  })
  .strict();

export type AcceptInvitationRequest = z.infer<typeof acceptInvitationRequestSchema>;
