import type { CreateRoomInput } from '@sunrise-ui/api/events';
import { useSnackbar } from '@sunrise-ui/primitives';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../constants/QueryKeys';
import { roomsApi } from '../utils/api';

const { roomsKey } = QueryKeys.rooms;

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn(createRoomInput: CreateRoomInput) {
      const response = await roomsApi.createRoomRoomsPost({
        createRoomInput,
      });
      return response.data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [roomsKey] });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to create room. Please try again.',
        type: 'error',
      });
    },
  });
};
