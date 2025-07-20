import { TextMonoBold, isAndroid, isIos } from '@sunrise-ui/primitives';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, View, type TextProps } from 'react-native';

type TickerListProps = {
  number: number;
  size: 'small' | 'medium';
  index: number;
};

type TickerProps = {
  value: number;
  size: 'small' | 'medium';
};

const numberWheel = [...Array(10).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const STAGGER_DELAY = 50;

function Tick({ children, ...rest }: TextProps) {
  return <TextMonoBold {...rest}>{children}</TextMonoBold>;
}

function TickerList({ number, size, index }: TickerListProps) {
  const fontSize = size === 'small' ? 16 : 24;
  const LINE_HEIGHT_MULTIPLIER = isAndroid
    ? size === 'small'
      ? 1.071
      : 1.079
    : isIos
      ? 1.083
      : 1.1;

  return (
    <View style={{ height: fontSize, overflow: 'hidden' }}>
      <MotiView
        animate={{
          translateY: -fontSize * LINE_HEIGHT_MULTIPLIER * number,
        }}
        transition={{
          delay: index * STAGGER_DELAY,
          damping: 80,
          stiffness: 200,
        }}
      >
        {numberWheel.map((num, index) => (
          <Tick
            key={`number-${num}-${index}`}
            style={{
              fontSize,
              lineHeight: fontSize * LINE_HEIGHT_MULTIPLIER,
            }}
          >
            {num}
          </Tick>
        ))}
      </MotiView>
    </View>
  );
}

export default function AnimatedTicker({ value, size }: TickerProps) {
  const styles = createStyles();
  const splitValue = value.toString().split('');

  return (
    <View>
      <View style={styles.ticker}>
        {splitValue.map((digit, index) => (
          <TickerList
            size={size}
            number={parseInt(digit, 10)}
            key={index}
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    ticker: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });
