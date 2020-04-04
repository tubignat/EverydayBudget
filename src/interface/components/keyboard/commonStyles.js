import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const isSmallScreen = width < 350;

export const keyButtonStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    height: isSmallScreen ? 59 : 70,
    width: 70,
    marginBottom: 10,
    borderRadius: 100
};