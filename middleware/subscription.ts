import { db } from "../db/db";
import { customers } from "../db/schema";
import { eq } from "drizzle-orm";

export async function verifySubscription(customerId: string): Promise<boolean> {
  try {
    if (!customerId) return false;

    const customer = db
      .select()
      .from(customers)
      .where(eq(customers.customerId, customerId))
      .get();

    return !!customer?.isSubscribed;
  } catch {
    return false;
  }
}
