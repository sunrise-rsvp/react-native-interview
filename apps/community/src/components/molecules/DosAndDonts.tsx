import IconListItem from '@atoms/IconListItem';
import {
  CancelCircleIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import type { WithResponsive } from '@sunrise-ui/primitives';
import { TextBold, useDynamicStyles } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  dos: string[];
  donts: string[];
  useRowOnMobile?: boolean;
};

export default function DosAndDonts({ dos, donts, useRowOnMobile }: Props) {
  const styles = useDynamicStyles(createStyles, { useRowOnMobile });

  return (
    <View style={styles.dosAndDonts}>
      <View style={styles.list}>
        <TextBold style={styles.heading}>DO</TextBold>
        {dos.map((value, index) => (
          <IconListItem key={index} icon={CheckmarkCircle01Icon} text={value} />
        ))}
      </View>
      <View style={styles.list}>
        <TextBold style={styles.heading}>{"DON'T"}</TextBold>
        {donts.map((value, index) => (
          <IconListItem key={index} icon={CancelCircleIcon} text={value} />
        ))}
      </View>
    </View>
  );
}

const createStyles = ({ isMobile, useRowOnMobile }: WithResponsive<Props>) =>
  StyleSheet.create({
    dosAndDonts: {
      display: 'flex',
      gap: 30,
      flexDirection: isMobile && useRowOnMobile ? 'row' : 'column',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 4 : 6,
      flexShrink: 1,
      flexGrow: 1,
    },
    heading: {
      fontSize: isMobile ? 20 : 24,
      marginBottom: isMobile ? 5 : 10,
    },
  });
