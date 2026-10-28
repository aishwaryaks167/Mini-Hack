/**
 * Notification management & permissions handler.
 * Interfaces with Web Notifications API with graceful fallbacks and mobile background notes.
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export function getNotificationPermissionStatus(): NotificationPermissionStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
}

export interface ExtendedNotificationOptions extends NotificationOptions {
  image?: string;
  vibrate?: number[];
}

export function triggerSystemNotification(title: string, options: ExtendedNotificationOptions): boolean {
  if (getNotificationPermissionStatus() !== 'granted') {
    return false;
  }

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          icon: '/favicon.ico',
          vibrate: [200, 100, 200],
          tag: 'smartdose-reminder',
          ...(options as any),
        });
      });
      return true;
    }

    new Notification(title, options);
    return true;
  } catch (error) {
    console.warn('System notification trigger failed (handled gracefully):', error);
    return false;
  }
}
