import Colors from '@constants/Colors';
import useCurrentRoom from '@contexts/useCurrentRoom';
import { Video02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useParticipants } from '@livekit/components-react';
import ProfileResult from '@molecules/ProfileResult';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import { type Participant } from 'livekit-client';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AttendeeSideBar() {
  const participants = useParticipants();
  const { hostId } = useCurrentRoom();
  const styles = useDynamicStyles(createStyles);
  const cameraEnabledParticipants: Participant[] = [];
  const cameraDisabledParticipants: Participant[] = [];

  participants.forEach((participant) => {
    if (participant.isCameraEnabled) {
      if (participant.identity === hostId) {
        cameraEnabledParticipants.unshift(participant);
      } else {
        cameraEnabledParticipants.push(participant);
      }
    } else {
      cameraDisabledParticipants.push(participant);
    }
  });

  return (
    <View style={styles.container}>
      {cameraEnabledParticipants.map((participant) => (
        <ProfileResult
          key={participant.identity}
          userId={participant.identity}
          showFollowButton={true}
          size="small"
          style={styles.attendee}
        >
          <HugeiconsIcon
            icon={Video02Icon}
            color={Colors.dark.text}
            size={35}
          />
        </ProfileResult>
      ))}
      <View style={styles.lineBreak} />
      {cameraDisabledParticipants.map((participant) => (
        <ProfileResult
          key={participant.identity}
          userId={participant.identity}
          showFollowButton={true}
          size="small"
          style={styles.attendee}
        />
      ))}
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    container: {
      padding: isMobile ? 10 : 20,
      gap: 20,
      height: '100%',
      width: '100%',
      justifyContent: 'flex-start',
    },
    lineBreak: {
      width: 100,
      height: 1,
      backgroundColor: '#fff',
      alignSelf: 'center',
    },
    attendee: {
      flexGrow: 0,
    },
  });
