import TokenPill from '@atoms/TokenPill';
import { useGetUserTokens } from '@queries/tokens';
import { TextLight } from '@sunrise-ui/primitives';
import React from 'react';

export default function TokenCountDisplay() {
  const { data: tokens } = useGetUserTokens();

  return (
    <>
      <TextLight>You have:</TextLight>
      <TokenPill amount={tokens?.count} size="medium" />
    </>
  );
}
