import { type Introduction } from '@sunrise-ui/api/network';

export const findIntro = (
  intros: Introduction[] | undefined,
  introId: string | undefined,
) => {
  if (!intros || !introId) return undefined;
  return intros.find((i) =>
    i.introduction.find((iHalf) => iHalf.introduced_to.id === introId),
  );
};
