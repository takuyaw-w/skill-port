import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { acceptInvitationRequestSchema } from "../schemas/invitations.requests.js";
import { acceptInvitation } from "../services/invitations/accept-invitation.js";
import { getPendingInvitationByToken } from "../services/invitations/get-invitation.js";
import { zodErrorResponse } from "../shared/validation/zod-error-response.js";

export const invitationRoutes = new Hono();

invitationRoutes.get("/:token", async (c) => {
  const token = c.req.param("token");

  const invitation = await getPendingInvitationByToken(token);

  if (!invitation) {
    return c.json(
      {
        error: "Invitation not found or expired",
      },
      404,
    );
  }

  return c.json({
    invitation: {
      id: invitation.invitationId,
      expiresAt: invitation.expiresAt,
    },
    employee: {
      id: invitation.employeeId,
      employeeCode: invitation.employeeCode,
      fullName: invitation.fullName,
      displayName: invitation.displayName,
      status: invitation.employeeStatus,
    },
  });
});

invitationRoutes.post(
  "/:token/accept",
  zValidator("json", acceptInvitationRequestSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const token = c.req.param("token");
    const body = c.req.valid("json");

    const result = await acceptInvitation(token, body);

    if (!result.ok) {
      switch (result.error) {
        case "INVITATION_NOT_FOUND_OR_EXPIRED":
          return c.json(
            {
              error: "Invitation not found or expired",
            },
            404,
          );

        case "EMPLOYEE_ALREADY_LINKED":
          return c.json(
            {
              error: "Employee is already linked to a user",
            },
            409,
          );

        case "EMPLOYEE_NOT_PENDING_INVITATION":
          return c.json(
            {
              error: "Employee is not pending invitation",
            },
            409,
          );
      }
    }

    return c.json({
      status: "ok",
      user: result.data.user,
      employee: result.data.employee,
    });
  },
);
