import React from 'react';
import { ExternalLink } from './ExternalLink';
import { TextReg } from './StyledText';

export function TermsOfService() {
  return (
    <TextReg>
      I agree to the{' '}
      <ExternalLink href="https://www.joincommuniful.com/terms">
        Terms
      </ExternalLink>{' '}
      and{' '}
      <ExternalLink href="https://www.joincommuniful.com/privacy-policy">
        Privacy Policy
      </ExternalLink>
    </TextReg>
  );
}
