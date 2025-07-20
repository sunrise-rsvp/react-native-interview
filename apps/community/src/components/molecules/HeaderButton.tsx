import { useMediaQueries } from '@sunrise-ui/primitives';
import React from 'react';
import { View } from 'react-native';

import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react-native';
import { type NavigationProp } from '@react-navigation/core';
import { IconButton } from '@sunrise-ui/primitives';
import { defaultBack } from '@utils/navigation';
import { useGlobalSearchParams, useNavigation } from 'expo-router';

type Props<T = NavigationProp<ReactNavigation.RootParamList>> = {
  icon?: IconSvgElement;
  onPress?: (
    params: Record<string, string | string[]>,
    navigation: T,
  ) => void | Promise<void>;
  loading?: boolean;
};

export default function HeaderButton<T>({
  icon = ArrowLeft01Icon,
  onPress = defaultBack(),
  loading,
}: Props<T>) {
  const { isMobile } = useMediaQueries();
  const params = useGlobalSearchParams<Record<string, string | string[]>>();
  const navigation: T = useNavigation();

  return (
    <View>
      <IconButton
        icon={icon}
        onPress={() => {
          void onPress(params, navigation);
        }}
        size={isMobile ? 'small' : 'medium'}
        loading={loading}
      />
    </View>
  );
}
