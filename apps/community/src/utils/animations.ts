import { withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const ANGLE = 10;
const TIME = 100;

export const getWobbleAnimation = () =>
  withSequence(
    // deviate left to start from -ANGLE
    withTiming(-ANGLE, { duration: TIME / 2 }),
    // wobble between -ANGLE and ANGLE 7 times
    withRepeat(
      withTiming(ANGLE, {
        duration: TIME,
      }),
      7,
      true,
    ),
    // go back to 0 at the end
    withTiming(0, { duration: TIME / 2 }),
  );
