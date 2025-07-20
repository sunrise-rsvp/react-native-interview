import { manipulateAsync } from 'expo-image-manipulator';
import { type ImagePickerAsset } from 'expo-image-picker';
import { isIos } from './responsivity';

const MAX_PHOTO_SIZE = 2097152;

export enum MediaDeviceType {
  CAMERA = 'camera',
  MICROPHONE = 'microphone',
}

export enum MediaDeviceError {
  DENIED_ACCESS = 1,
  NONE_DETECTED = 2,
  CANNOT_REQUEST_PERMISSION_AGAIN = 3,
}

export const getMimeTypeFromExtension = (extension: string) => {
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.mp4':
      return 'video/mp4';
    case '.mov':
      return 'video/quicktime';
    case '.webm':
      return 'video/webm';
    case '.pdf':
      return 'application/pdf';
    default:
      return '';
  }
};

export const getFileFromUri = async (uri: string, userId: string) => {
  const blob = await getBlob(uri);
  const filename = `${userId}.webm`;
  return new File([blob], filename, { type: 'video/webm' });
};

const getBlob = async (uri: string) => {
  const response = await fetch(uri);
  return response.blob();
};

export const getFileFromImage = async (
  image: ImagePickerAsset,
  currentUserId: string,
) => {
  let { uri } = image;
  let blob = await getBlob(uri);
  const originalFileSize = blob.size;

  // Compress if the file size exceeds the max limit
  if (originalFileSize > MAX_PHOTO_SIZE) {
    const compressionFactor = MAX_PHOTO_SIZE / originalFileSize;
    const newImage = await manipulateAsync(uri, [], {
      compress: compressionFactor,
    });
    uri = newImage.uri;
    blob = await getBlob(uri);
  }

  // Extract the file extension from the URI
  const uriParts = uri.split('.');
  const fileExtension =
    uriParts.length > 1 ? `.${uriParts[uriParts.length - 1]}` : '.jpeg';

  const filename = `${currentUserId}${fileExtension}`;
  const type =
    getMimeTypeFromExtension(fileExtension) || blob.type || 'image/jpeg';

  const iosFile = {
    name: filename,
    type,
    uri,
  };

  return isIos ? iosFile : new File([blob], filename, { type });
};

export const getErrorMessage = (
  type: MediaDeviceType,
  error?: MediaDeviceError,
): string | undefined => {
  if (!error) return;
  switch (error) {
    case MediaDeviceError.DENIED_ACCESS:
      return `Please grant access to your ${type}`;
    case MediaDeviceError.NONE_DETECTED:
      return `No ${type}s detected`;
    case MediaDeviceError.CANNOT_REQUEST_PERMISSION_AGAIN:
      return `Cannot request ${type} permissions again. Please go to settings to enable access.`;
    default:
      return `There was an issue with your ${type}. Please make sure it is connected and access is granted in settings.`;
  }
};
