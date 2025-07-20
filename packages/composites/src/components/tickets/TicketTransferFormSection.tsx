import { Delete02Icon } from '@hugeicons/core-free-icons';
import {
  IconButton,
  InputError,
  TextBold,
  TextInput,
} from '@sunrise-ui/primitives';
import React from 'react';
import type { Control } from 'react-hook-form';
import { Controller, useFormState } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import type { TicketTransferFormValues } from './TicketTransferForm';

type Props = {
  control: Control<TicketTransferFormValues>;
  index: number;
  handleEmailChange: () => Promise<void>;
  handleDelete: () => void;
};

export function TicketTransferFormSection({
  control,
  index,
  handleEmailChange,
  handleDelete,
}: Props) {
  const { errors } = useFormState({ control });

  return (
    <View style={styles.formSection}>
      <View style={styles.formSectionHeader}>
        <TextBold style={styles.formSectionHeading}>
          Ticket {index + 1}
        </TextBold>
        {index !== 0 && (
          <IconButton icon={Delete02Icon} onPress={handleDelete} />
        )}
      </View>
      <View style={styles.formRow}>
        <View style={styles.formInput}>
          <Controller
            control={control}
            render={({ field }) => <TextInput label="First Name*" {...field} />}
            name={`people.${index}.firstName`}
          />
          <InputError fieldError={errors.people?.[index]?.firstName} />
        </View>
        <View style={styles.formInput}>
          <Controller
            control={control}
            render={({ field }) => <TextInput label="Last Name*" {...field} />}
            name={`people.${index}.lastName`}
          />
          <InputError fieldError={errors.people?.[index]?.lastName} />
        </View>
      </View>
      <View>
        <Controller
          control={control}
          render={({ field: { onChange, ...otherProps } }) => (
            <TextInput
              label="Email*"
              onChange={async (value) => {
                onChange(value);
                await handleEmailChange();
              }}
              {...otherProps}
            />
          )}
          name={`people.${index}.email`}
        />
        <InputError fieldError={errors.people?.[index]?.email} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: {
    width: '100%',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formInput: {
    flex: 1,
  },
  formSectionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    alignItems: 'center',
    height: 30,
  },
  formSectionHeading: {
    fontSize: 16,
  },
});
