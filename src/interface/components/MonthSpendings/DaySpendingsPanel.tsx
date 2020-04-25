import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native';

import SlidingUpPanel from '../common/SlidingUpPanel';
import { TextButton } from '../common/TextButton';
import { ApplicationContext } from '../../ApplicationContext';
import { ColorScheme } from '../../color/ColorScheme';
import { observer } from 'mobx-react';
import { SpendingsList } from '../common/SpendingsList';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface IDaysSpendingsPanel {
    onClose: () => void
    openedDay: number
}

export const DaysSpendingsPanel = observer((props: IDaysSpendingsPanel) => {
    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => setIsFirstRender(false), []);

    const { onClose: closePanel, openedDay } = props;
    const { locale, currency, colorScheme } = application;
    const dayOfWeek = new Date(application.year, application.month, openedDay).getDay();
    const spendings = application.spendings.filter(s => s.day === openedDay);
    const remove = application.removeSpending;
    const edit = application.editSpending;
    const add = () => application.addSpending(openedDay, 0, null, null);

    const [isAddButtonVisible, setIsAddButtonVisible] = useState(spendings.length > 0);
    const [isEmptyListTextVisible, setIsEmptyListTextVisible] = useState(spendings.length === 0);
    const [isTransitionInProcess, setIsTransitionInProcess] = useState(false);
    const [addButtonRef, setAddButtonRef] = useState<View | null>(null);
    const [addFirstSpendingButtonRef, setAddFirstSpendingButtonRef] = useState<View | null>(null);
    const [anim] = useState({ x: new Animated.Value(0), y: new Animated.Value(0), scale: new Animated.Value(1) });
    const [emptyListTextAnim] = useState(new Animated.Value(0));

    const styles = getStyles(colorScheme);

    const translateX = emptyListTextAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -150]
    })
    const opacity = emptyListTextAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    })

    return <SlidingUpPanel onClose={closePanel} offsetTop={isBigScreen ? 75 : 50} colorScheme={application.colorScheme}>
        <View style={{ position: 'relative' }}>
            <View style={{
                ...styles.emptyListTextContainer,
                opacity: isEmptyListTextVisible ? 1 : 0,
                zIndex: isEmptyListTextVisible ? 1 : 0
            }}>
                <Animated.Text style={{
                    ...styles.emptyListText,
                    transform: [{ translateX: translateX }],
                    opacity: opacity
                }}>
                    {locale.noSpendingForThisDay}
                </Animated.Text>
                <Animated.View style={{ transform: [{ translateX: anim.x }, { translateY: anim.y }, { scale: anim.scale }] }}>
                    <TextButton
                        forwardedTextRef={ref => setAddFirstSpendingButtonRef(ref)}
                        text={locale.add}
                        height={50}
                        fontSize={16}
                        onPress={onAddFirstSpendingClick}
                        scheme={colorScheme}
                        disabled={isTransitionInProcess}
                    />
                </Animated.View>
            </View>
            <View style={{ width: '100%', paddingBottom: 200 }}>
                <View style={styles.daySpendingHeader}>
                    <Text style={styles.daySpendingDateText}>{locale.getDateText(openedDay, application.month)}</Text>
                    <Text style={styles.dayOfWeekText}>{locale.getDayOfWeek(dayOfWeek)}</Text>
                </View>
                {
                    spendings.length > 0 &&
                    <SpendingsList
                        spendings={spendings}
                        remove={onRemove}
                        edit={edit}
                        scheme={colorScheme}
                        currency={currency}
                        shouldPlayEnterAnimation={!isFirstRender}
                        onRemoveAnimationStart={onRemoveAnimationStart}
                    />
                }

                <View style={{ ...styles.addButtonContainer, opacity: isAddButtonVisible ? 1 : 0 }}>
                    <TextButton
                        forwardedTextRef={ref => setAddButtonRef(ref)}
                        text={locale.add}
                        height={40}
                        width={'100%'}
                        fontSize={locale.add.length > 5 ? 20 : 24}
                        onPress={add}
                        scheme={colorScheme}
                        disabled={false}
                    />
                </View>

            </View>
        </View>
    </SlidingUpPanel>

    function onAddFirstSpendingClick() {
        addButtonRef?.measure((fx1, fy1, width1, height1, px1, py1) => {
            addFirstSpendingButtonRef?.measure((fx2, fy2, width2, height2, px2, py2) => {

                const spendingBlockSize = isSmallScreen ? 107 : 111;
                const translateX = px1 - px2 + (width1 - width2) / 2;
                const translateY = py1 - py2 + spendingBlockSize + (height1 - height2) / 2;
                const scale = height1 / height2;

                setIsTransitionInProcess(true);

                Animated
                    .parallel([
                        Animated.spring(anim.x, { toValue: translateX, restSpeedThreshold: 10, restDisplacementThreshold: 1 }),
                        Animated.spring(anim.y, { toValue: translateY, restSpeedThreshold: 10, restDisplacementThreshold: 1 }),
                        Animated.spring(anim.scale, { toValue: scale, restSpeedThreshold: 10, restDisplacementThreshold: 1 }),
                        Animated.spring(emptyListTextAnim, { toValue: 1, bounciness: 0 })
                    ])
                    .start(() => {
                        setIsAddButtonVisible(true);
                        setIsEmptyListTextVisible(false);
                    });

                add();
            })
        })
    }

    function onRemove(id: number) {
        // Hack. Due to poor performance of mobx observable array after deletion animation stutters
        const timeout = spendings.length === 1 ? 250 : 0;
        setTimeout(() => remove(id), timeout);
    }

    function onRemoveAnimationStart() {
        if (spendings.length > 1) {
            return;
        }

        addButtonRef?.measure((fx1, fy1, width1, height1, px1, py1) => {
            addFirstSpendingButtonRef?.measure((fx2, fy2, width2, height2, px2, py2) => {
                setIsAddButtonVisible(false);
                setIsEmptyListTextVisible(true);

                const errorWindow = 3;
                if (Math.abs(px1 - px2) > errorWindow) {
                    const translateX = px1 - px2 + (width1 - width2) / 2;
                    const translateY = py1 - py2 + (height1 - height2) / 2;
                    const scale = height1 / height2;

                    anim.x.setValue(translateX);
                    anim.y.setValue(translateY);
                    anim.scale.setValue(scale);
                }
                emptyListTextAnim.setValue(1);

                Animated
                    .parallel([
                        Animated.spring(anim.x, { toValue: 0, bounciness: 0 }),
                        Animated.spring(anim.y, { toValue: 0, bounciness: 0 }),
                        Animated.spring(anim.scale, { toValue: 1, bounciness: 0 }),
                        Animated.spring(emptyListTextAnim, { toValue: 0, bounciness: 0 })
                    ])
                    .start(() => setIsTransitionInProcess(false));
            })
        })
    }
});

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    emptyListTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: isSmallScreen ? 320 : 350,
        width: '100%',
    },
    emptyListText: {
        color: 'gray',
        fontSize: 16
    },
    daySpendingHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: isSmallScreen ? 8 : 24,
        marginBottom: 48,
    },
    daySpendingDateText: {
        fontSize: isSmallScreen ? 32 : 36,
        fontWeight: 'bold',
        color: scheme.primaryText
    },
    dayOfWeekText: {
        fontSize: isSmallScreen ? 16 : 20,
        color: scheme.alternativeSecondaryText,
        fontWeight: 'bold',
        marginTop: 8
    },
    daySpendingBudgetContainer: {
        flexDirection: 'row',
        marginLeft: 30,
        marginTop: 10
    },
    daySpendingBudgetText: {
        fontSize: 16,
        color: scheme.primaryText
    },
    daySpendingBudgetLabel: {
        fontSize: 16,
        width: 80,
        color: scheme.primaryText
    },
    addButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});