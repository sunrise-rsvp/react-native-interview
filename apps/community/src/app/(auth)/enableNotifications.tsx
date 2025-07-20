import usePushNotifications from '@contexts/usePushNotifications';
import type { EventIntentionProps } from '@hoc/withEventIntention';
import withEventIntention from '@hoc/withEventIntention';
import {
  Button,
  ButtonVariants,
  Loader,
  PageHeader,
  TextReg,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

function EnableNotificationsScreen({
  eventIntention,
  isRunning,
  isSettingUp,
}: EventIntentionProps) {
  const { permission } = usePushNotifications();

  if (!permission || isRunning) return <Loader />;

  if (!permission?.granted && !permission?.canAskAgain)
    return (
      <View style={styles.container}>
        <PageHeader
          header="Oh no!"
          subheader="We rely on push notifications to provide you with reminders for events. Please go to your settings and enable them."
        />
      </View>
    );

  return (
    <View style={styles.container}>
      <PageHeader
        header={permission.granted ? "You're good to go!" : "Can't wait!"}
        subheader={
          permission.granted
            ? 'Push notifications are already enabled.'
            : 'Enable push notifications to get reminders when this event is about to start.'
        }
      />
      <TextReg style={styles.emoji}>&#128588;</TextReg>
      <Button
        onPress={eventIntention}
        variant={ButtonVariants.PURPLE}
        disabled={isSettingUp || isRunning}
        loading={isRunning}
      >
        <TextReg>{permission.granted ? 'Next' : "Let's do it"}</TextReg>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 125,
  },
});

export default withEventIntention(EnableNotificationsScreen, true);
