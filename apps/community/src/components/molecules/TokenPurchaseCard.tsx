import Card from '@atoms/Card';
import TokenPill from '@atoms/TokenPill';
import Colors from '@constants/Colors';
import { type TokenPackageType } from '@constants/TokenPackage';
import { useHandlePurchase } from '@hooks/useHandlePurchase/useHandlePurchase';
import {
  Button,
  ButtonVariants,
  TextBold,
  TextReg,
} from '@sunrise-ui/primitives';
import React, { useState } from 'react';

export default function TokenPurchaseCard({
  tokenPackage,
}: {
  tokenPackage: TokenPackageType;
}) {
  const { handlePurchase, isStoreLoading } = useHandlePurchase();
  const [isLoading, setIsLoading] = useState(false);
  const handleBuy = async () => {
    setIsLoading(true);
    await handlePurchase(tokenPackage.sku);
    setIsLoading(false);
  };

  return (
    <Card shadowColor={Colors.dark.purple1}>
      <TextBold>{tokenPackage.name}</TextBold>
      <TokenPill amount={tokenPackage.amount} />
      <TextReg>${tokenPackage.price}</TextReg>
      <Button
        variant={ButtonVariants.PURPLE}
        size="small"
        onPress={handleBuy}
        loading={isLoading}
        disabled={isLoading || isStoreLoading}
      >
        Buy Now
      </Button>
    </Card>
  );
}
