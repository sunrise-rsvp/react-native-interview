import type React from 'react';
import { useContext } from 'react';

export function useSafeContext<ContextType>(
  context: React.Context<ContextType>,
) {
  const _context = useContext<ContextType>(context);

  if (!_context)
    console.error(
      `Component used outside of a ${context.displayName} Provider`,
    );

  return _context;
}
