import ProfileImg from '@atoms/ProfileImg';
import TokenPill from '@atoms/TokenPill';
import Colors from '@constants/Colors';
import { useGetHighestBid } from '@queries/auctions';
import { useGetProfile } from '@queries/profiles';
import {
  TextBold,
  TextLight,
  useDynamicStyles,
  useUserAuth,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HighestBidderDisplay() {
  const styles = useDynamicStyles(createStyles);
  const { data: highestBid } = useGetHighestBid();
  const { currentUserId } = useUserAuth();
  const highestBidderId = highestBid?.user_id;
  const isHighestBidder = highestBidderId === currentUserId;
  const { isLoading, data: profile } = useGetProfile(highestBidderId);

  if (!highestBidderId || isLoading) return null;

  return (
    <>
      <TextLight>Current highest bidder:</TextLight>
      <View style={styles.bidderBar}>
        <View style={styles.bidder}>
          <ProfileImg
            key={highestBidderId}
            userId={highestBidderId}
            imgSize="thumbnail_large"
            styleSize={40}
          />
          <TextBold>
            {isHighestBidder
              ? 'You!'
              : `${profile?.first_name} ${profile?.last_name}`}
          </TextBold>
        </View>
        <TokenPill amount={highestBid.amount} size="medium" />
      </View>
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'center',
    },
    bidderBar: {
      width: '100%',
      borderRadius: 20,
      height: 40,
      backgroundColor: Colors.dark.purple1opacity50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bidder: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
  });
