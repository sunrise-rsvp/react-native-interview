import useCurrentRoom from '@contexts/useCurrentRoom';
import useNameTagsControl from '@contexts/useNameTagsControl';
import { isTrackReference, useTracks, VideoTrack } from '@livekit/react-native';
import EmptyStage from '@molecules/EmptyStage';
import VideoNameTag from '@molecules/VideoNameTag';
import { Track } from 'livekit-client';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  style: ViewStyle;
};

export default function StageNative({ style }: Props) {
  const { hostId } = useCurrentRoom();
  const tracks = useTracks([Track.Source.Camera]);
  const numberOfTracks = tracks.length;
  const { showNameTags } = useNameTagsControl();

  return (
    <View style={style}>
      {tracks.map((track, index) => {
        const participantId = track?.participant.identity ?? '';
        const isHost = participantId === hostId;

        if (isTrackReference(track)) {
          return (
            <View style={styles.trackContainer} key={participantId}>
              <VideoTrack
                key={index}
                trackRef={track}
                style={styles.participantView}
                mirror={true}
              />
              {showNameTags && (
                <VideoNameTag
                  userId={participantId}
                  isOnLeft={false}
                  isOnBottom={isHost}
                  shouldAnimate={true}
                />
              )}
            </View>
          );
        }

        return <View key={index} style={styles.participantView} />;
      })}
      {numberOfTracks === 1 && (
        <EmptyStage style={styles.participantView} hostId={hostId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  participantView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  trackContainer: {
    position: 'relative',
    flex: 1,
  },
});
