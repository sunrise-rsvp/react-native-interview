import Colors from '@constants/Colors';
import PublicEventsCardList from '@organisms/PublicEventsCardList';
import {
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function EventsScreen() {
  const styles = useDynamicStyles(createStyles);
  return (
    <View style={styles.container}>
      <PublicEventsCardList />
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between',
    },
    outerMenuContainer: {
      display: 'none',
      position: 'absolute',
      margin: isMobile ? 12 : isTablet ? 16 : 20,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    menu: {
      marginTop: isMobile ? -130 : -150,
    },
    addButton: {
      backgroundColor: Colors.dark.purple1,
    },
  });
