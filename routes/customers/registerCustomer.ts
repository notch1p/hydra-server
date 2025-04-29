import { db } from "../../db/db";
import { customers } from "../../db/schema";
import { RevenueCat } from "../../services/RevenueCat";
import { z } from "zod";

const registerCustomerSchema = z.object({
  customerId: z.string(),
});

export async function registerCustomer(req: Request) {
  const body = await req.json();
  const { customerId } = registerCustomerSchema.parse(body);

  const isSubscribed = await RevenueCat.isCustomerSubscribed(customerId);

  await db
    .insert(customers)
    .values({
      customerId,
      isSubscribed,
      pushToken: null,
    })
    .onConflictDoUpdate({
      target: customers.customerId,
      set: {
        isSubscribed,
      },
    });

  return new Response("success");
}
