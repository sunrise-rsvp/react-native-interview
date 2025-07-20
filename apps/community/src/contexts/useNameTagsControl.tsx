import { useSafeContext } from '@sunrise-ui/primitives';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

type NameTagsControlContextType = {
  showNameTags: boolean;
  setShowNameTags: (value: boolean) => void;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const NameTagsControlContext = createContext<NameTagsControlContextType>();
NameTagsControlContext.displayName = 'NameTagsControlContext';

export const NameTagsControlProvider = ({ children }: PropsWithChildren) => {
  const [showNameTags, setShowNameTags] = useState(true);

  useEffect(() => {
    if (showNameTags) {
      const timeout = setTimeout(() => {
        setShowNameTags(false);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showNameTags]);

  return (
    <NameTagsControlContext.Provider
      value={{
        showNameTags,
        setShowNameTags,
      }}
    >
      {children}
    </NameTagsControlContext.Provider>
  );
};

export default function useNameTagsControl() {
  return useSafeContext(NameTagsControlContext);
}
