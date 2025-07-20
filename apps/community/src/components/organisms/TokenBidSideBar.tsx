import Alert from '@atoms/Alert';
import useBidHistory from '@contexts/useBidHistory';
import useCurrentRoom from '@contexts/useCurrentRoom';
import HighestBidderDisplay from '@molecules/HighestBidderDisplay';
import TokenCountDisplay from '@molecules/TokenCountDisplay';
import BidDisplay from '@organisms/BidDisplay';
import { useGetHighestBid } from '@queries/auctions';
import { useGetProfile } from '@queries/profiles';
import {
  Loader,
  TextLight,
  useDynamicStyles,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function TokenBidSideBar() {
  const styles = useDynamicStyles(createStyles);
  const { currentUserId } = useUserAuth();
  const { hasPreviouslyBid } = useBidHistory();
  const { hostId } = useCurrentRoom();
  const { data: hostProfile, isLoading: isLoadingHostProfile } =
    useGetProfile(hostId);
  const { data: highestBid } = useGetHighestBid();
  const isHighestBidder = highestBid?.user_id === currentUserId;
  const hostName = hostProfile?.first_name ?? 'the host';

  if (!hostProfile || isLoadingHostProfile)
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Loader />
      </ScrollView>
    );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <HighestBidderDisplay />
      {hasPreviouslyBid && highestBid?.user_id && !isHighestBidder && (
        <Alert text="You've been outbid!" />
      )}
      <TextLight>Place a bid to talk to {hostName} next.</TextLight>
      <BidDisplay disabled={isHighestBidder} />
      <TokenCountDisplay />
    </ScrollView>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    scrollView: {
      width: '100%',
      paddingTop: 16,
      padding: isMobile ? 16 : 20,
    },
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: isMobile ? 16 : 20,
    },
    emoji: {
      fontSize: 140,
    },
  });
