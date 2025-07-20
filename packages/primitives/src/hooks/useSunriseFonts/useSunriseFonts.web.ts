import { useFonts } from 'expo-font';

export function useSunriseFonts() {
  return useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
    Poppins: require('../../assets/fonts/PoppinsLatin-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
    PoppinsLight: require('../../assets/fonts/PoppinsLatin-Light.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
    PoppinsBold: require('../../assets/fonts/PoppinsLatin-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
    CourierPrime: require('../../assets/fonts/CourierPrime-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
    CourierPrimeBold: require('../../assets/fonts/CourierPrime-Bold.ttf'),
  });
}
