export const CameraType = {
  FRONT: 'front',
  BACK: 'back',
} as const;

export type NativeCameraTypes = (typeof CameraType)[keyof typeof CameraType];
