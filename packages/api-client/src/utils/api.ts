import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TokensApiFactory as AdminTokensApiFactory,
  type TokenOutput, Configuration
} from '@sunrise-ui/api/cerebro';
import {
  EventsApiFactory,
  TicketsApiFactory,
} from '@sunrise-ui/api/events';
import { ProfilesApiFactory } from '@sunrise-ui/api/profile';
import {
  deleteStoredInfo,
  getRefreshToken,
  storeInfo,
} from '@sunrise-ui/primitives';
import type { QueryClient } from '@tanstack/react-query';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { router } from 'expo-router';
import {
  CEREBRO_BASE_URL,
  EVENTS_BASE_URL,
  PROFILE_BASE_URL,
} from './env';

let isRefreshing = false;
let refreshPromise: Promise<TokenOutput> | undefined;
let queryClient: QueryClient;

/**
 * Register the query client for access in api layer
 * Used at logout to clear the cache
 */
export function registerQueryClient(client: QueryClient) {
  queryClient = client;
}

export const refreshToken = async () => {
  const refreshAccessTokenInput = {
    refresh_token: await getRefreshToken(),
  };
  const response = await tokensApi.refreshAccessTokenTokensRefreshPost({
    refreshAccessTokenInput,
  });
  const { data } = response;
  await storeInfo(data);
  return data;
};

const responseErrorHandler =
  (axiosInstance: AxiosInstance) => async (error: AxiosError) => {
    if (
      error.config?.url?.includes('/tokens/refresh') ||
      error.response?.status === 403
    ) {
      router.navigate('/login');
      queryClient?.clear();
      await deleteStoredInfo();
    } else if (error.response?.status === 401) {
      // attempt to refresh token
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
          refreshPromise = undefined;
        });
      }

      // Wait for the refresh token to be resolved
      await refreshPromise;
      // if successful retry request
      return axiosInstance.request(error.config ?? {});
    }

    return Promise.reject(error);
  };

const requestFulfilledHandler = async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

function createAxiosApi<T>(
  factory: (
    configuration?: Configuration,
    basePath?: string,
    axios?: AxiosInstance,
  ) => T,
  baseURL?: string,
) {
  const configuration = new Configuration();

  const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use(
    requestFulfilledHandler,
    async (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    responseErrorHandler(axiosInstance),
  );

  return factory(configuration, baseURL, axiosInstance);
}

export const profilesApi = createAxiosApi(ProfilesApiFactory, PROFILE_BASE_URL);

export const eventsApi = createAxiosApi(EventsApiFactory, EVENTS_BASE_URL);
export const ticketsApi = createAxiosApi(TicketsApiFactory, EVENTS_BASE_URL);
export const tokensApi = createAxiosApi(
  AdminTokensApiFactory,
  CEREBRO_BASE_URL,
);

