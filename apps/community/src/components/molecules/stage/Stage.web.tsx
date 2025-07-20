import useCurrentRoom from '@contexts/useCurrentRoom';
import useNameTagsControl from '@contexts/useNameTagsControl';
import { useSyncMediaDeviceWithLiveKit } from '@hooks/useSyncMediaDeviceWithLiveKit';
import {
  isTrackReference,
  TrackLoop,
  TrackRefContext,
  useTracks,
  VideoTrack,
} from '@livekit/components-react';
import EmptyStage from '@molecules/EmptyStage';
import VideoNameTag from '@molecules/VideoNameTag';
import {
  MediaDeviceType,
  useDynamicStyles,
  useUserAuth,
} from '@sunrise-ui/primitives';
import { Track } from 'livekit-client';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  style: ViewStyle;
};

export default function StageWeb({ style }: Props) {
  const { currentUserId } = useUserAuth();
  const { hostId, flexDirection } = useCurrentRoom();
  const { showNameTags } = useNameTagsControl();
  const isRow = flexDirection === 'row';
  const tracks = useTracks([Track.Source.Camera]);
  const numberOfTracks = tracks.length;
  const styles = useDynamicStyles(createStyles);
  useSyncMediaDeviceWithLiveKit(MediaDeviceType.CAMERA);
  useSyncMediaDeviceWithLiveKit(MediaDeviceType.MICROPHONE);

  return (
    <View style={style}>
      <TrackLoop tracks={tracks}>
        <TrackRefContext.Consumer>
          {(trackRef) => {
            const participantId = trackRef?.participant.identity ?? '';
            const isHost = participantId === hostId;
            const isSelf = participantId === currentUserId;
            const style = {
              ...styles.participantView,
              ...(isSelf ? { scale: '-1 1' } : {}),
            };

            return (
              isTrackReference(trackRef) && (
                <View style={styles.trackContainer}>
                  <VideoTrack trackRef={trackRef} style={style} />
                  {showNameTags && (
                    <VideoNameTag
                      userId={participantId}
                      isOnLeft={isHost && isRow}
                      isOnBottom={isHost || (!isHost && isRow)}
                      shouldAnimate={true}
                    />
                  )}
                </View>
              )
            );
          }}
        </TrackRefContext.Consumer>
      </TrackLoop>
      {numberOfTracks === 1 && (
        <EmptyStage style={styles.participantView} hostId={hostId} />
      )}
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    trackContainer: {
      position: 'relative',
      flex: 1,
    },
    participantView: {
      flex: 1,
      overflow: 'hidden',
      objectFit: 'cover',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
  });
