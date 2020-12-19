import {ColorScheme} from "../../../color/ColorScheme";
import React, {useContext} from "react";
import {StyleSheet, View, Text} from "react-native";
import {ApplicationContext} from "../../../Contexts";
import {observer} from "mobx-react";
import {TextButton} from "../../common/TextButton";
import {formatMoney} from "../../../NumbersFormats";
import {ModalStackState} from "../../../ModalStackState";
import {FinancesSettingsPanel} from "./FinancesSettingsPanel";
import {Currency} from "../../../../domain/repositories/UserPreferencesRepository";
import {DeviceState} from "../../../DeviceState";
import {useContextUnsafe} from "../../../Hooks";

export const BudgetSettingsSummary = observer(() => {
    const application = useContextUnsafe(ApplicationContext);

    const renderModal = (onClose: () => void) => <FinancesSettingsPanel key='categoriesPanel' onClose={onClose}/>

    const styles = getStyles(application.colorScheme)

    return <View style={styles.summaryContainer}>

        <Text style={styles.summaryHeader}>{application.locale.financesHeader}</Text>

        <View style={{flexDirection: 'row'}}>
            <SummaryCell
                label={application.locale.incomes}
                amount={application.incomesSum}
                colorScheme={application.colorScheme}
                currency={application.currency}
            />
            <View style={{width: 16}}/>
            <SummaryCell
                label={application.locale.expenses}
                amount={application.expensesSum}
                colorScheme={application.colorScheme}
                currency={application.currency}
            />
        </View>

        <View style={{flexDirection: 'row', marginBottom: 8, marginTop: 32}}>
            <SummaryCell
                label={application.locale.budgetForMonth}
                amount={application.monthBudget}
                colorScheme={application.colorScheme}
                currency={application.currency}
            />
            <View style={{width: 16}}/>
            <SummaryCell
                label={application.locale.budgetPerDay}
                amount={application.budgetPerDay}
                colorScheme={application.colorScheme}
                currency={application.currency}
            />
        </View>

        <TextButton
            height={84}
            disabled={false}
            fontSize={20}
            scheme={application.colorScheme}
            text={application.locale.configureFinances}
            onPress={() => ModalStackState.open(renderModal)}
        />
    </View>
})

function SummaryCell(props: { label: string, amount: number, colorScheme: ColorScheme, currency: Currency }) {
    const styles = getStyles(props.colorScheme)

    return <View style={styles.summaryCellContainer}>
        <Text style={styles.summaryCellLabel}>{props.label}</Text>
        <Text style={styles.summaryCellAmount}>{formatMoney(props.amount)} {props.currency}</Text>
    </View>
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    summaryContainer: {
        borderRadius: 30,
        backgroundColor: scheme.plateBackground,
        paddingTop: 32,
        paddingHorizontal: 24,
        marginHorizontal: DeviceState.screenSize === 'L' ? -24 : 0,
        marginBottom: 72
    },
    summaryHeader: {
        fontSize: 28,
        color: scheme.primaryText,
        fontWeight: 'bold',
        marginBottom: 24
    },
    summaryCellContainer: {
        width: '50%',
    },
    summaryCellLabel: {
        fontSize: 12,
        color: scheme.secondaryText,
        marginBottom: 12
    },
    summaryCellAmount: {
        fontSize: 22,
        color: scheme.primaryText,
    }
})
