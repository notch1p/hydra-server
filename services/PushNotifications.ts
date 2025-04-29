import { Expo } from "expo-server-sdk";

export default class PushNotifications {
  private static expo = new Expo();

  static async send(
    token: string,
    title: string,
    body: string,
    badge: number = 0,
  ) {
    console.log("message sent");
    await this.expo.sendPushNotificationsAsync([
      {
        to: token,
        title,
        body,
        sound: "default",
        badge,
      },
    ]);
  }
}
