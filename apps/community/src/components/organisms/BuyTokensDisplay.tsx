import { TokenPackage } from '@constants/TokenPackage';
import TokenCountDisplay from '@molecules/TokenCountDisplay';
import TokenPurchaseCard from '@molecules/TokenPurchaseCard';
import { TextLight, useDynamicStyles } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BuyTokensDisplay() {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TokenCountDisplay />
      </View>
      <TextLight>Need more tokens?</TextLight>
      <View style={styles.tokenCards}>
        <View style={styles.row}>
          <TokenPurchaseCard tokenPackage={TokenPackage.A} />
          <TokenPurchaseCard tokenPackage={TokenPackage.B} />
        </View>
        <View style={styles.row}>
          <TokenPurchaseCard tokenPackage={TokenPackage.C} />
          <TokenPurchaseCard tokenPackage={TokenPackage.D} />
        </View>
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 20,
      padding: 20,
    },
    topSection: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
    },
    tokenCards: {
      display: 'flex',
      flexDirection: 'row',
      gap: 20,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      gap: 20,
    },
  });
