import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import SlidingUpPanel from './SlidingUpPanel';
import { TextButton } from './TextButton';
import { ApplicationContext } from '../ApplicationContext';
import { ColorScheme } from '../color/ColorScheme';
import { observer } from 'mobx-react';
import { SpendingsList } from './SpendingsList/SpendingsList';

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

    const styles = getStyles(colorScheme);

    return <SlidingUpPanel onClose={closePanel} offsetTop={isBigScreen ? 75 : 50} colorScheme={application.colorScheme}>
        <View style={{ paddingBottom: 200 }}>
            <View style={styles.daySpendingHeader}>
                <Text style={styles.daySpendingDateText}>{locale.getDateText(openedDay, application.month)}</Text>
                <Text style={styles.dayOfWeekText}>{locale.getDayOfWeek(dayOfWeek)}</Text>
            </View>
            {
                spendings.length > 0 &&
                <SpendingsList
                    spendings={spendings}
                    remove={remove}
                    scheme={colorScheme}
                    currency={currency}
                    shouldPlayEnterAnimation={!isFirstRender}
                />
            }
            {
                spendings.length > 0 && <View style={styles.addButtonContainer}>
                    <TextButton
                        text={locale.add}
                        height={40}
                        width={'100%'}
                        fontSize={locale.add.length > 5 ? 20 : 24}
                        onPress={add}
                        scheme={colorScheme}
                        disabled={false}
                    />
                </View>
            }
            {
                spendings.length === 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>{locale.noSpendingForThisDay}</Text>
                    <TextButton text={locale.add} height={50} fontSize={15} onPress={add} scheme={colorScheme} disabled={false} />
                </View>
            }
        </View>
    </SlidingUpPanel>
});

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    emptyListTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginTop: 40
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15
    },
    daySpendingHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 48,
    },
    daySpendingDateText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: scheme.primaryText
    },
    dayOfWeekText: {
        fontSize: 20,
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