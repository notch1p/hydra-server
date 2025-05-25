type Customer = {
  active_entitlements: {
    items: {
      object: string;
      entitlement_id: string;
      expires_at: number;
    }[];
    next_page: string | null;
    url: string;
  };
  project_id: string;
  object: "customer";
  is_subscribed: boolean;
  push_token: string;
};

const HYDRA_PRO_ENTITLEMENT_ID = "entla7f4253fb6";

export class RevenueCat {
  private static readonly projectId: string =
    process.env.REVENUECAT_PROJECT_ID!;
  private static readonly apiKey: string = process.env.REVENUECAT_API_KEY!;

  static async getCustomers(limit: number = 1_000_000) {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());

    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${this.projectId}/customers?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.json();
  }

  static async isCustomerSubscribed(customerId: string) {
    if (process.env.IS_CUSTOM_SERVER === "true") {
      return true;
    }
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${this.projectId}/customers/${customerId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = (await response.json()) as Customer;

    return data.active_entitlements.items.some(
      (item) => item.entitlement_id === HYDRA_PRO_ENTITLEMENT_ID,
    );
  }
}
