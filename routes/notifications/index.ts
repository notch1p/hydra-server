import { registerNotifications } from "./registerNotifications.ts";

export default {
  "/api/notifications/register": {
    POST: registerNotifications,
  },
};
