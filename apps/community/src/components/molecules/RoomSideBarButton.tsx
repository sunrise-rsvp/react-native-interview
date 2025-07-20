import Colors from '@constants/Colors';
import useRoomTab, { type RoomTab } from '@contexts/useRoomTab';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Button, ButtonVariants } from '@sunrise-ui/primitives';
import { getTabsIcon } from '@utils/icons';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  tab: RoomTab;
};
export default function RoomSideBarButton({ tab }: Props) {
  const { currentRoomTab, setCurrentRoomTab } = useRoomTab();
  const Icon = getTabsIcon(tab);
  const isOpenTab = currentRoomTab === tab;
  return (
    <Button
      onPress={() => {
        setCurrentRoomTab(isOpenTab ? undefined : tab);
      }}
      size="medium"
      variant={isOpenTab ? ButtonVariants.DARK : ButtonVariants.DARK_50}
      style={styles.button}
      labelStyle={styles.buttonLabel}
    >
      <HugeiconsIcon
        icon={Icon}
        color={currentRoomTab === tab ? Colors.dark.yellow0 : Colors.dark.text}
        size={20}
      />
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    minWidth: 44,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  buttonLabel: {
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 0,
    display: 'flex',
  },
});
