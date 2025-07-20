import { isNative } from '@sunrise-ui/primitives';

// Import CustomerIO conditionally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _CustomerIO: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _CioRegion: any = null;

if (isNative) {
  try {
    // Static import with require for native platforms only
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const customerioModule = require('customerio-reactnative');
    _CustomerIO = customerioModule.CustomerIO;
    _CioRegion = customerioModule.CioRegion;
  } catch (error) {
    console.error('Error importing CustomerIO:', error);
  }
}

export const CustomerIO = _CustomerIO;
export const CioRegion = _CioRegion;
