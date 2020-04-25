import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const isSmallScreen = width < 350;

export type Key = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.';

export const keyButtonStyle: any = {
    alignItems: 'center',
    justifyContent: 'center',
    height: isSmallScreen ? 59 : 70,
    width: 70,
    marginBottom: 10,
    borderRadius: 100
};