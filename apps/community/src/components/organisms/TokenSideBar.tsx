import ToggleButtons from '@atoms/ToggleButtons';
import useCurrentRoom from '@contexts/useCurrentRoom';
import useRoomTab, { TokenTab } from '@contexts/useRoomTab';
import BuyTokensDisplay from '@organisms/BuyTokensDisplay';
import TokenBidSideBar from '@organisms/TokenBidSideBar';
import TokenExtensionSideBar from '@organisms/TokenExtensionSideBar';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TokenSideBar() {
  const { currentTokenTab, setCurrentTokenTab } = useRoomTab();
  const { isHost } = useCurrentRoom();
  const styles = useDynamicStyles(createStyles);
  const buttons = [
    { label: 'Buy', value: TokenTab.BUY },
    { label: 'Extend', value: TokenTab.EXTEND },
  ];
  if (!isHost) buttons.push({ label: 'Bid', value: TokenTab.BID });

  return (
    <View style={styles.container}>
      <ToggleButtons
        value={currentTokenTab}
        onChange={(value: string) => {
          setCurrentTokenTab(value as TokenTab);
        }}
        buttons={buttons}
        style={styles.toggleButtons}
      />
      {currentTokenTab === TokenTab.BUY && <BuyTokensDisplay />}
      {currentTokenTab === TokenTab.EXTEND && <TokenExtensionSideBar />}
      {currentTokenTab === TokenTab.BID && !isHost && <TokenBidSideBar />}
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      paddingTop: isMobile ? 0 : 16,
    },
    toggleButtons: {
      paddingHorizontal: 16,
    },
  });
