import { LogoFull } from '@assets/images';
import { Header } from '@sunrise-ui/primitives';
import React, { type ReactNode } from 'react';

export const headerOptionsCreator = (
  headerLeft?: ReactNode,
  headerRight?: ReactNode,
) => ({
  header: () => (
    <Header headerLeft={headerLeft} headerRight={headerRight} logo={LogoFull} />
  ),
});
