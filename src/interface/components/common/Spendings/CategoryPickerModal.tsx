import React, { useContext, useState } from 'react';
import { View, Dimensions, Animated, StyleSheet, ScrollView } from 'react-native';
import { PickerModal } from '../PickerModal';
import { ApplicationContext } from '../../../ApplicationContext';
import { Spending } from '../../../../domain/entities/Spending';
import { CategoriesList } from '../CategoriesList';

const window = Dimensions.get('window');
const isSmallScreen = window.width < 350;
const isBigScreen = window.height > 800;

interface ICategoryPickerModalProps {
    expansionPoint: { x: number, y: number }
    spending: Spending
    onClose: () => void
}

export function CategoryPickerModal(props: ICategoryPickerModalProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [anim] = useState(new Animated.Value(0));

    return <PickerModal
        scheme={application.colorScheme}
        width={isSmallScreen ? window.width - 16 : window.width - 48}
        expansionPoint={props.expansionPoint}
        renderContent={renderContent}
        onClose={props.onClose}
        onOpenAnimationStart={() => Animated.spring(anim, { toValue: 1 }).start()}
        onCloseAnimationStart={() => Animated.timing(anim, { toValue: 0, duration: 300 }).start()}
    />

    function renderContent(close: () => void) {
        if (!application) {
            throw new Error('Application was not set');
        }
        const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [2.25, 1]
        });

        const opacity = anim.interpolate({
            inputRange: [0, .25, 1],
            outputRange: [0, 1, 1]
        })

        const animatedStyle = {
            transform: [{ scale: scale }],
            opacity: opacity,
            position: 'relative',
            top: 0
        }

        return <Animated.View style={animatedStyle}>
            <ScrollView style={styles.modalContent}>
                <View style={{ paddingBottom: 24 }}>
                    <CategoriesList
                        categories={[null, ...application.categories]}
                        scheme={application.colorScheme}
                        locale={application.locale}
                        onPress={(category) => {
                            application.editSpending(props.spending.id, props.spending.amount, category);
                            close();
                        }}
                    />
                </View>
            </ScrollView>
        </Animated.View>
    }
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 12,
        paddingTop: 24,
        minHeight: 200,
        maxHeight: 320,
    }
})