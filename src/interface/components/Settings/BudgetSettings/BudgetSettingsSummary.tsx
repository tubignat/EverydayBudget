import {ColorScheme} from "../../../color/ColorScheme";
import React, {useContext} from "react";
import {StyleSheet, View, Text} from "react-native";
import {ApplicationContext} from "../../../ApplicationContext";
import {observer} from "mobx-react";
import {TextButton} from "../../common/TextButton";
import {ApplicationState} from "../../../ApplicationState";
import {formatMoney} from "../../../NumberFormat";
import {CategoriesSettingsPanel} from "../CategoriesSettings/CategoriesSettingsPanel";
import {ModalStackState} from "../../../ModalStackState";
import {FinancesSettingsPanel} from "./FinancesSettingsPanel";

export const BudgetSettingsSummary = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const renderModal = (onClose: () => void) => <FinancesSettingsPanel key='categoriesPanel' onClose={onClose}/>

    const styles = getStyles(application.colorScheme)

    return <View style={styles.summaryContainer}>

        <Text style={styles.summaryHeader}>{application.locale.financesHeader}</Text>

        <View style={{flexDirection: 'row'}}>
            <SummaryCell
                label={application.locale.incomes}
                amount={application.incomesSum}
                application={application}
            />
            <View style={{width: 16}}/>
            <SummaryCell
                label={application.locale.expenses}
                amount={application.expensesSum}
                application={application}
            />
        </View>

        <View style={{flexDirection: 'row', marginBottom: 8, marginTop: 32}}>
            <SummaryCell
                label={application.locale.budgetForMonth}
                amount={application.monthBudget}
                application={application}
            />
            <View style={{width: 16}}/>
            <SummaryCell
                label={application.locale.budgetPerDay}
                amount={application.budgetPerDay}
                application={application}
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

function SummaryCell(props: { label: string, amount: number, application: ApplicationState }) {
    const styles = getStyles(props.application.colorScheme)

    return <View style={styles.summaryCellContainer}>
        <Text style={styles.summaryCellLabel}>{props.label}</Text>
        <Text style={styles.summaryCellAmount}>{formatMoney(props.amount)} {props.application.currency}</Text>
    </View>
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    summaryContainer: {
        borderRadius: 30,
        backgroundColor: scheme.plateBackground,
        paddingTop: 32,
        paddingHorizontal: 24,
        marginHorizontal: -24,
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
