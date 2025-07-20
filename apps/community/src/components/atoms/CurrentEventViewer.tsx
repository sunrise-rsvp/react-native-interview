import RoomTimer from '@atoms/RoomTimer';
import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import {
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Draggable from 'react-native-draggable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CurrentEventViewer() {
  const { eventId } = useGlobalSearchParams();
  const { currentEventId } = useCurrentEventInfo();
  const { height, width } = useWindowDimensions();
  const { isMobile } = useMediaQueries();
  const itemWidth = isMobile ? 120 : 160;
  const itemHeight = isMobile ? 90 : 120;
  const insets = useSafeAreaInsets();
  const marginSides = isMobile ? 12 : 16;
  const marginTop = Math.max(isMobile ? 12 : 16, insets.top);
  const marginBottom = Math.max(isMobile ? 12 : 16, insets.bottom);
  const [x, setX] = useState(width - itemWidth - marginSides);
  const [y, setY] = useState(marginTop);
  const [key, setKey] = useState(false);
  const styles = useDynamicStyles(createStyles, { itemWidth, itemHeight });
  const possibleX = [marginSides, width - itemWidth - marginSides];
  const possibleY = [
    marginTop,
    height / 2 - itemHeight / 2,
    height - itemHeight - marginBottom,
  ];
  const setToNearestPosition = (dragX: number, dragY: number) => {
    const xBucket = Math.round(dragX / width);
    const yBucket = Math.round((dragY / height) * 2);
    setX(possibleX[xBucket]);
    setY(possibleY[yBucket]);
  };

  useEffect(() => {
    setX(width - itemWidth - marginSides);
    setY(marginTop);
  }, [width, height]);

  // If we are inside an event, or there is no event going on, then return null
  if (eventId || !currentEventId) return null;

  return (
    <Draggable
      key={String(key)}
      x={x}
      y={y}
      maxY={height - marginBottom}
      minY={marginTop}
      maxX={width - marginSides}
      minX={marginSides}
      onDragRelease={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setToNearestPosition(pageX, pageY);
        setKey(!key);
      }}
      onShortPressRelease={() => {
        router.navigate(`/live/${currentEventId}`);
      }}
    >
      <View style={styles.box}>
        <RoomTimer />
      </View>
    </Draggable>
  );
}

const createStyles = ({
  itemWidth,
  itemHeight,
  isMobile,
}: WithResponsive<{ itemWidth: number; itemHeight: number }>) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      pointerEvents: 'none',
      padding: isMobile ? 12 : 16,
    },
    box: {
      width: itemWidth,
      height: itemHeight,
      borderRadius: 30,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
