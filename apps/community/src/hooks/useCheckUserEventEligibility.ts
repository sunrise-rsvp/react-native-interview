import usePushNotifications from '@contexts/usePushNotifications';
import type { EventIntentionParams } from '@hoc/withEventIntention';
import { isNative } from '@sunrise-ui/primitives';
import { router } from 'expo-router';

export default function useCheckUserEventEligibility(
  cleanupBeforeNavigation?: () => void,
  shouldRequestPermission?: boolean,
) {
  const { requestPermission, refetchPermission } = usePushNotifications();

  const checkUserEventEligibility = async ({
    intention,
    eventId,
    eventType,
  }: EventIntentionParams) => {
    if (!eventId) return;

    const searchParam = `?eventId=${eventId}&intention=${intention}&eventType=${eventType}`;

    if (isNative) {
      const pushNotificationsPermission = shouldRequestPermission
        ? await requestPermission()
        : await refetchPermission();
      if (pushNotificationsPermission.granted) return true;

      cleanupBeforeNavigation?.();
      router.navigate(`/enableNotifications${searchParam}`);
      return false;
    }

    return true;
  };

  return {
    checkUserEventEligibility,
  };
}
