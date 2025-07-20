import AsyncStorage from '@react-native-async-storage/async-storage';

type StoredInfo = {
  access_token: string;
  refresh_token: string;
  user_id: string;
};

export const storeInfo = async (info: StoredInfo) => {
  try {
    await AsyncStorage.setItem('refreshToken', info.refresh_token);
    await AsyncStorage.setItem('authToken', info.access_token);
    await AsyncStorage.setItem('userId', info.user_id);
  } catch (e) {
    console.error(e);
  }
};

export const getRefreshToken = async () => {
  let token;
  try {
    token = await AsyncStorage.getItem('refreshToken');
  } catch (e) {
    console.error(e);
  }

  return token ?? '';
};

export const deleteStoredInfo = async () => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (e) {
    console.error(e);
  }
};
