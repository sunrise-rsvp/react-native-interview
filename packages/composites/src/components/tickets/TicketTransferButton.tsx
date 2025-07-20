import {
  ArrowReloadHorizontalIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import type { Ticket } from '@sunrise-ui/api/events';
import { Colors, IconButton, Modal, PageHeader } from '@sunrise-ui/primitives';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TicketTransferForm } from './TicketTransferForm';

type Props = {
  ticket: Ticket;
};

export function TicketTransferButton({ ticket }: Props) {
  const [showModal, setShowModal] = useState(false);
  const ticketQuantity = ticket.quantity ?? 1;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <IconButton onPress={toggleModal} icon={ArrowReloadHorizontalIcon} />
      <Modal
        visible={showModal}
        hide={toggleModal}
        contentStyle={styles.modalContent}
      >
        <PageHeader
          header={`There are ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''} to transfer`}
        />
        <TicketTransferForm ticket={ticket} />
        <IconButton
          icon={Cancel01Icon}
          onPress={toggleModal}
          backgroundColor={Colors.purple0opacity50}
          style={styles.closeButton}
          size="medium"
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 32,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
