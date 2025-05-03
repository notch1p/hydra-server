import { z } from "zod";
import { customers, redditAccounts } from "../../db/schema";
import { db } from "../../db/db";
import { RevenueCat } from "../../services/RevenueCat";
import { encrypt } from "../../utils/crypto";

const registerNotificationsSchema = z.object({
  customerId: z.string(),
  pushToken: z.string(),
  accounts: z.array(
    z.object({
      username: z.string(),
      session: z.string(),
    }),
  ),
});

export async function registerNotifications(req: Request) {
  const body = await req.json();
  const { customerId, pushToken, accounts } =
    registerNotificationsSchema.parse(body);

  const isSubscribed = await RevenueCat.isCustomerSubscribed(customerId);

  await db
    .insert(customers)
    .values({
      customerId,
      isSubscribed,
      pushToken,
    })
    .onConflictDoUpdate({
      target: customers.customerId,
      set: {
        isSubscribed,
        pushToken,
      },
    });

  await Promise.all(
    accounts.map(async (account) => {
      const encryptedSession = encrypt(account.session);
      await db
        .insert(redditAccounts)
        .values({
          customerId,
          username: account.username,
          session: encryptedSession,
          lastCheckedAt: null,
        })
        .onConflictDoUpdate({
          target: [redditAccounts.customerId, redditAccounts.username],
          set: {
            username: account.username,
            session: encryptedSession,
          },
        });
    }),
  );

  return new Response("success");
}
