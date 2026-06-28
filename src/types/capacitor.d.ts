declare module "@capacitor/core" {
  export const Capacitor: {
    isNativePlatform: () => boolean;
    isPluginAvailable: (name: string) => boolean;
  };
}

declare module "@capacitor/push-notifications" {
  export const PushNotifications: {
    requestPermissions: () => Promise<{ receive: string }>;
    register: () => Promise<void>;
    addListener: (event: string, handler: (...args: any[]) => void) => Promise<void>;
  };
}
