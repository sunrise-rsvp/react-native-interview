import ToggleButtons from '@atoms/ToggleButtons';
import useRelationshipModalData, {
  RelationshipsModalTabs,
} from '@hooks/useRelationshipModalData';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import HeaderButton from '@molecules/HeaderButton';
import ProfileResult from '@molecules/ProfileResult';
import SendMessageButton from '@molecules/SendMessageButton';
import {
  ButtonVariants,
  Header,
  Loader,
  Modal,
  TextReg,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  hideModal: () => void;
  userId: string;
  currentTab: RelationshipsModalTabs;
  setCurrentTab: (value: RelationshipsModalTabs) => void;
};

export default function RelationshipsModal({
  visible,
  hideModal,
  userId,
  currentTab,
  setCurrentTab,
}: Props) {
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);
  const { isLoading, persons } = useRelationshipModalData({
    userId,
    tab: currentTab,
  });

  const headerTitle = (
    <ToggleButtons
      value={currentTab}
      onChange={(value: string) => {
        setCurrentTab(value as RelationshipsModalTabs);
      }}
      style={styles.toggleButtons}
      buttons={[
        { label: 'Connections', value: RelationshipsModalTabs.CONNECTIONS },
        { label: 'Followers', value: RelationshipsModalTabs.FOLLOWERS },
        { label: 'Following', value: RelationshipsModalTabs.FOLLOWING },
      ]}
    />
  );

  const header = (
    <Header
      headerLeft={
        isMobile ? (
          <HeaderButton icon={Cancel01Icon} onPress={hideModal} />
        ) : null
      }
      headerRight={
        isMobile ? null : (
          <HeaderButton icon={Cancel01Icon} onPress={hideModal} />
        )
      }
      headerTitle={isMobile ? null : headerTitle}
    />
  );

  return (
    <Modal
      visible={visible}
      hide={hideModal}
      fullscreenOnBreakpoint={true}
      header={header}
      contentStyle={styles.modalContent}
    >
      {isMobile && headerTitle}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
      >
        {isLoading && <Loader />}
        {persons?.length ? (
          persons.map((person) => (
            <ProfileResult
              key={person.user_id}
              userId={person.user_id}
              shouldNavigateOnClick
            >
              <SendMessageButton
                variant={ButtonVariants.PURPLE}
                userId={person.user_id}
                size={isMobile ? 'small' : 'medium'}
                style={styles.actionButton}
              />
            </ProfileResult>
          ))
        ) : (
          <TextReg>No {currentTab}</TextReg>
        )}
      </ScrollView>
    </Modal>
  );
}

function createStyles({ isMobile }: WithResponsive<Props>) {
  return StyleSheet.create({
    scrollContainer: {
      width: '100%',
      height: '100%',
    },
    container: {
      display: 'flex',
      gap: 20,
    },
    tabText: {
      fontSize: 20,
      borderBottomWidth: 2,
      borderStyle: 'solid',
      borderColor: 'white',
      paddingLeft: 10,
      paddingRight: 10,
    },
    modalContent: {
      paddingTop: isMobile ? 4 : undefined,
    },
    toggleButtons: {
      maxWidth: 450,
      marginBottom: isMobile ? 20 : 0,
    },
    actionButton: {
      marginLeft: 'auto',
    },
  });
}
