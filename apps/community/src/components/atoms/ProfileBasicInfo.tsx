import Colors from '@constants/Colors';
import {
  TextBold,
  TextReg,
  isAndroid,
  isIos,
  isNative,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  firstName?: string;
  lastName?: string;
  pronouns?: string;
  headline?: string;
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  style?: ViewStyle;
  loadingStyle?: ViewStyle;
  nameButton?: React.ReactNode;
};

export default function ProfileBasicInfo({
  firstName,
  lastName,
  pronouns,
  headline,
  size = 'medium',
  isLoading,
  style,
  loadingStyle,
  nameButton,
}: PropsWithChildren<Props>) {
  const styles = useDynamicStyles(createStyles);

  if (isLoading)
    return (
      <View
        style={[
          styles.textContainer,
          styles[`${size}InfoFiller`],
          loadingStyle || style,
        ]}
      >
        <View style={styles[`${size}NameFiller`]} />
        <View style={styles[`${size}PronounsFiller`]} />
        <View style={styles[`${size}HeadlineFiller`]} />
      </View>
    );

  return (
    <View style={[styles.textContainer, style]}>
      <View style={styles.nameContainer}>
        <TextBold style={styles[`${size}Name`]}>
          {firstName} {lastName}
        </TextBold>
        {nameButton}
      </View>
      {pronouns && (
        <TextReg style={styles[`${size}Pronouns`]}>({pronouns})</TextReg>
      )}
      <TextReg style={styles[`${size}Headline`]}>{headline}</TextReg>
    </View>
  );
}

const createStyles = ({
  isMobile,
  isLoading,
  nameButton,
}: WithResponsive<Props>) => {
  const desktopButtonHeightAdjustment = isMobile && nameButton ? 5 : 0;
  const iosButtonHeightAdjustment = nameButton ? 7.3 : 0;
  const androidButtonHeightAdjustment = nameButton ? 9.4 : 0;
  const largeIosButtonHeightAdjustment = nameButton ? 2 : 0;
  const largeAndroidButtonHeightAdjustment = nameButton ? 3 : 0;

  return StyleSheet.create({
    textContainer: {
      flexShrink: 1,
      justifyContent: 'center',
      gap: isNative && !isLoading ? 3 : 0,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    smallName: {
      fontSize: 16,
    },
    smallPronouns: {
      fontSize: 8,
    },
    smallHeadline: {
      fontSize: 12,
    },
    mediumName: {
      fontSize: isMobile ? 16 : 32,
    },
    mediumPronouns: {
      fontSize: isMobile ? 8 : 12,
    },
    mediumHeadline: {
      fontSize: isMobile ? 12 : 16,
    },
    largeName: {
      fontSize: isMobile ? 20 : 36,
    },
    largePronouns: {
      fontSize: isMobile ? 10 : 14,
    },
    largeHeadline: {
      fontSize: isMobile ? 14 : 20,
    },
    smallInfoFiller: {
      width: '100%',
      maxWidth: 200,
      height: isIos
        ? 57 + iosButtonHeightAdjustment
        : isAndroid
          ? 53.7 + androidButtonHeightAdjustment
          : 55 + desktopButtonHeightAdjustment,
      justifyContent: 'space-between',
      paddingVertical: 3,
    },
    mediumInfoFiller: {
      width: '100%',
      maxWidth: isMobile ? 200 : 400,
      height: isIos
        ? 57 + iosButtonHeightAdjustment
        : isAndroid
          ? 53.7 + androidButtonHeightAdjustment
          : isMobile
            ? 55 + desktopButtonHeightAdjustment
            : 91,
      justifyContent: 'space-between',
      paddingVertical: isMobile ? 2.5 : 6,
    },
    largeInfoFiller: {
      width: '100%',
      maxWidth: isMobile ? 200 : 400,
      height: isIos
        ? 67.7 + largeIosButtonHeightAdjustment
        : isAndroid
          ? 64.4 + largeAndroidButtonHeightAdjustment
          : isMobile
            ? 67
            : 106,
      justifyContent: 'space-between',
      paddingVertical: isNative ? 0 : 3,
    },
    smallNameFiller: {
      maxWidth: 140,
      height: 16,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 8,
    },
    smallPronounsFiller: {
      maxWidth: 50,
      height: 8,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 4,
    },
    smallHeadlineFiller: {
      maxWidth: 200,
      height: 12,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 6,
    },
    mediumNameFiller: {
      maxWidth: isMobile ? 140 : 200,
      height: isMobile ? 16 : 32,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 16,
    },
    mediumPronounsFiller: {
      maxWidth: isMobile ? 50 : 60,
      height: isMobile ? 8 : 12,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 6,
    },
    mediumHeadlineFiller: {
      maxWidth: isMobile ? 200 : 400,
      height: isMobile ? 12 : 16,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 8,
    },
    largeNameFiller: {
      maxWidth: isMobile ? 140 : 200,
      height: isMobile ? 20 : 36,
      marginTop: isMobile ? 5 : 8.5,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 18,
    },
    largePronounsFiller: {
      maxWidth: isMobile ? 50 : 60,
      height: isMobile ? 8 : 14,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 7,
    },
    largeHeadlineFiller: {
      maxWidth: isMobile ? 200 : 400,
      height: isMobile ? 12 : 20,
      marginBottom: isMobile ? 3 : 5,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 10,
    },
  });
};
