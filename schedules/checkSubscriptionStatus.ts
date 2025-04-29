import { RevenueCat } from "../services/RevenueCat";
import { db } from "../db/db";
import { customers } from "../db/schema";
import { eq } from "drizzle-orm";

const doCheck = async () => {
  const custs = await db
    .select({
      customerId: customers.customerId,
    })
    .from(customers)
    .where(eq(customers.isSubscribed, true));

  for (const customer of custs) {
    const isSubscribed = await RevenueCat.isCustomerSubscribed(
      customer.customerId,
    );
    await db
      .update(customers)
      .set({
        isSubscribed: isSubscribed,
      })
      .where(eq(customers.customerId, customer.customerId))
      .execute();

    // Wait 10 seconds to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1_000 * 10));
  }
};

export default async function checkSubscriptionStatus() {
  doCheck();
  setInterval(
    () => {
      doCheck();
    },
    1_000 * 60 * 60 * 12,
  );
}
