import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from 'sonner';
import { saveDeviceToken } from './database';

export async function initPushNotifications(userId: string) {
    if (!Capacitor.isNativePlatform()) {
        console.log('Push notifications not supported on web');
        return;
    }

    try {
        // Request permission
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            console.log('User denied push notifications');
            return;
        }

        // Register
        await PushNotifications.register();

        // Add Listeners
        await addListeners(userId);

    } catch (error) {
        console.error('Error initializing push notifications:', error);
    }
}

async function addListeners(userId: string) {
    await PushNotifications.removeAllListeners();

    // Registration success
    await PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token: ' + token.value);
        try {
            await saveDeviceToken({
                user_id: userId,
                token: token.value,
                platform: Capacitor.getPlatform() as 'android' | 'ios',
            });
        } catch (error) {
            console.error('Error saving device token:', error);
        }
    });

    // Registration error
    await PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error: ', error.error);
    });

    // Push notification received
    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
        toast.info(notification.title || 'New Notification', {
            description: notification.body,
        });
    });

    // Push notification action performed
    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ', notification);
        // Handle navigation if needed based on data
        // const data = notification.notification.data;
        // if (data.url) router.push(data.url);
    });
}
