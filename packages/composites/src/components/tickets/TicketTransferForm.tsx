import { yupResolver } from '@hookform/resolvers/yup';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { useTransferTicket } from '@sunrise-ui/api-client';
import type { Ticket } from '@sunrise-ui/api/events';
import { Button, Colors, IconButton, TextReg } from '@sunrise-ui/primitives';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ValidationError,
  array,
  object,
  ref,
  string,
  type InferType,
} from 'yup';
import { TicketTransferFormSection } from './TicketTransferFormSection';

const schema = object({
  people: array()
    .of(
      object({
        firstName: string().required('First name is required'),
        lastName: string().required('Last name is required'),
        email: string()
          .email('Must be a valid email address')
          .required('Email is required'),
      }),
    )
    .min(1, 'You must transfer at least 1 ticket')
    .max(
      ref('$ticketQuantity'),
      ({ max }) =>
        `You can only transfer up to ${max} ticket${max > 1 ? 's' : ''}`,
    )
    .test('unique-emails', 'Email addresses must be unique', function (people) {
      if (!people) return true;

      const errors = [];
      const emailSet = new Set();
      const overlappingEmails = new Set();
      for (let i = 0; i < people.length; i++) {
        const email = people[i].email?.toLowerCase();
        if (email) {
          if (emailSet.has(email)) {
            overlappingEmails.add(email);
          }
          emailSet.add(email);
        }
      }
      for (let i = 0; i < people.length; i++) {
        const email = people[i].email?.toLowerCase();
        if (email && overlappingEmails.has(email)) {
          errors.push(
            this.createError({
              path: `people.${i}.email`,
              message: 'Email addresses must be unique',
            }),
          );
        }
      }

      if (!errors.length) return true;

      return new ValidationError(errors);
    }),
});

export type TicketTransferFormValues = InferType<typeof schema>;

type Props = {
  ticket: Ticket;
};

export function TicketTransferForm({ ticket }: Props) {
  const ticketQuantity = ticket.quantity ?? 1;
  const { mutateAsync: transferTicket } = useTransferTicket(ticket);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
    trigger,
  } = useForm<TicketTransferFormValues>({
    defaultValues: {
      people: [{ firstName: '', lastName: '', email: '' }],
    },
    resolver: yupResolver(schema),
    context: {
      ticketQuantity,
    },
  });

  const onSubmit = async (data: TicketTransferFormValues) => {
    const promises = data.people?.map(({ firstName, lastName, email }) =>
      transferTicket({
        first_name: firstName,
        last_name: lastName,
        email,
      }),
    );
    if (promises) await Promise.allSettled(promises);
  };

  const {
    fields: people,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'people',
  });

  const emailPaths = people.map(
    (_, i) => `people.${i}.email`,
  ) as `people.${number}.email`[];

  return (
    <>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.form}>
        {people.map((field, index) => (
          <TicketTransferFormSection
            key={field.id}
            index={index}
            control={control}
            handleDelete={() => {
              remove(index);
              if (isSubmitted) void trigger(emailPaths);
            }}
            handleEmailChange={async () => {
              if (isSubmitted) await trigger(emailPaths);
            }}
          />
        ))}
        <IconButton
          icon={PlusSignIcon}
          onPress={() => {
            append({ firstName: '', lastName: '', email: '' });
          }}
          disabled={people.length >= ticketQuantity}
        />
      </ScrollView>
      <View style={styles.transferButtonContainer}>
        {errors?.people?.root?.message && (
          <TextReg style={styles.hiddenErrorMessageText}>
            *{errors?.people?.root?.message}
          </TextReg>
        )}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Transfer
        </Button>
        {errors?.people?.root?.message && (
          <TextReg>*{errors?.people?.root?.message}</TextReg>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    paddingHorizontal: 12,
  },
  form: {
    gap: 12,
    alignItems: 'center',
  },
  transferButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hiddenErrorMessageText: {
    color: Colors.purple0,
  },
});
