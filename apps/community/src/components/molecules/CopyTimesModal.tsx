import { Copy01Icon } from '@hugeicons/core-free-icons';
import {
  Button,
  ButtonVariants,
  IconButton,
  TextReg,
  useDynamicStyles,
} from '@sunrise-ui/primitives';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Modal as PaperModal, Portal } from 'react-native-paper';

const longDaysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

type Props = {
  copyTimeSchedule: (daysToCopy: boolean[]) => void;
};

export default function CopyTimesModal({ copyTimeSchedule }: Props) {
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [checkedArray, setCheckedArray] = useState<boolean[]>(
    new Array(7).fill(false),
  );
  const styles = useDynamicStyles(createStyles);

  const showModal = () => {
    setShowCopyModal(true);
  };

  const hideModal = () => {
    setCheckedArray(new Array(7).fill(false));
    setShowCopyModal(false);
  };

  return (
    <>
      <IconButton icon={Copy01Icon} onPress={showModal} />
      <Portal>
        <PaperModal
          visible={showCopyModal}
          onDismiss={hideModal}
          contentContainerStyle={styles.card}
          style={styles.modal}
        >
          <TextReg style={styles.copyText}>Copy times to:</TextReg>
          {longDaysOfWeek.map((label, index) => (
            <View key={label} style={styles.copyRow}>
              <Checkbox
                status={checkedArray[index] ? 'checked' : 'unchecked'}
                onPress={() => {
                  const newCheckedArray = [...checkedArray];
                  newCheckedArray[index] = !newCheckedArray[index];
                  setCheckedArray(newCheckedArray);
                }}
              />
              <TextReg style={styles.copyText}>{label}</TextReg>
            </View>
          ))}
          <Button
            onPress={() => {
              copyTimeSchedule(checkedArray);
              hideModal();
            }}
            variant={ButtonVariants.PURPLE}
            disabled={checkedArray.every((value) => !value)}
            style={styles.saveButton}
          >
            <TextReg>Save</TextReg>
          </Button>
        </PaperModal>
      </Portal>
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    copyRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      marginLeft: -8, // For alignment of checkboxes
    },
    card: {
      backgroundColor: '#200A3E',
      borderRadius: 30,
      display: 'flex',
      alignItems: 'flex-start',
      padding: 25,
      gap: 8,
      width: 225,
      shadowColor: '#841EB4',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.35,
      shadowRadius: 15,
    },
    copyText: {
      fontSize: 14,
    },
    clickCatcher: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'grey',
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
    },
    saveButton: {
      alignSelf: 'center',
      marginTop: 10,
    },
  });
