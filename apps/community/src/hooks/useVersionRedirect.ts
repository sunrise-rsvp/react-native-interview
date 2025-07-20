import { useCheckVersion } from '@queries/auth';
import { Platform, type Version } from '@sunrise-ui/api/cerebro';
import { isIos, isNative } from '@sunrise-ui/primitives';
import * as Application from 'expo-application';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export default function useVersionRedirect() {
  const { data: versions } = useCheckVersion(isNative);

  useEffect(() => {
    if (!versions || versions.length === 0 || !isNative) {
      return;
    }

    async function checkVersion() {
      try {
        // Retrieve the current app version from expo-application
        const currentVersion = Application.nativeApplicationVersion;

        if (!currentVersion) {
          console.error('Could not retrieve app version.');
          return;
        }

        // Filter the versions to match the current platform
        const platform = isIos ? Platform.Ios : Platform.Android;
        const supportedVersions = versions?.filter(
          (version: Version) => version.platform === platform,
        );

        // Check if the current version is supported
        const isSupported = supportedVersions?.some(
          (version: Version) => version.version === currentVersion,
        );

        if (
          supportedVersions &&
          supportedVersions?.length > 0 &&
          !isSupported
        ) {
          // Redirect the user to the appropriate app store
          const storeUrl = isIos
            ? 'https://apps.apple.com/us/app/sunrise-rsvp/id6736870572'
            : 'https://play.google.com/store/apps/details?id=rsvp.sunrise.app';

          await Linking.openURL(storeUrl);
        }
      } catch (error) {
        console.error('Error checking app version:', error);
      }
    }

    void checkVersion();
  }, [versions]);
}
