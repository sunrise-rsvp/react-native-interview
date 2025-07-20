import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React, { useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  onResize?: (squareSize: number) => void;
};
export default function SquareContainer({
  children,
  onResize,
}: PropsWithChildren<Props>) {
  const [squareSize, setSquareSize] = useState(0);
  const styles = useDynamicStyles(createStyles, { squareSize });

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        const squareSize = width > height ? height : width;
        setSquareSize(squareSize);
        onResize?.(squareSize);
      }}
    >
      <View style={styles.squareContainer}>{children}</View>
    </View>
  );
}

const createStyles = ({ squareSize }: WithResponsive<{ squareSize: number }>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    },
    squareContainer: {
      height: squareSize,
      width: squareSize,
      maxHeight: squareSize,
      maxWidth: squareSize,
    },
  });
