import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  TextBold,
  TextReg,
  useDynamicStyles,
} from '@sunrise-ui/primitives';

type Props = {
  name?: string;
  topic: string;
  onEdit?: () => void;
};

export default function TopicCard({ name, topic, onEdit }: Props) {
  const styles = useDynamicStyles(createStyles);
  const preText = name ? 'Topic suggestion from ' : 'Example Topic Suggestion';

  return (
    <View style={styles.container}>
      <View style={styles.topicCard}>
        <TextReg style={styles.preText}>
          {preText}
          {name && <TextBold>{name}</TextBold>}
        </TextReg>
        <TextReg style={styles.topicText}>{topic}</TextReg>
        {onEdit && (
          <Button onPress={onEdit} size="small" style={styles.editButton}>
            Edit
          </Button>
        )}
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
    },
    topicCard: {
      backgroundColor: '#200A3E',
      borderRadius: 30,
      display: 'flex',
      alignItems: 'flex-start',
      padding: 16,
      gap: 8,
      maxWidth: 360,
      flex: 1,
      shadowColor: '#841EB4',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.35,
      shadowRadius: 15,
    },
    topicText: {
      fontSize: 24,
    },
    preText: {
      fontSize: 12,
    },
    editButton: {
      alignSelf: 'center',
    },
  });
