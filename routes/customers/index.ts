import { registerCustomer } from "./registerCustomer.ts";

export default {
  "/api/customers/register": {
    POST: registerCustomer,
  },
};
