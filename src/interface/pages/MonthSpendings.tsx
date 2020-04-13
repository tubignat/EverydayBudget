import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';

import Page from '../components/Page'
import { observer } from 'mobx-react';
import { SpendingId, Spending } from '../../domain/repositories/SpendingsRepository';
import { TableHeader, TableRow } from '../components/MonthSpendingsTable';
import { DaysSpendingsPanel } from '../components/DaySpendingsPanel';
import { ApplicationContext } from '../ApplicationContext';
import { ApplicationState } from '../ApplicationState';
import { ColorScheme } from '../color/ColorScheme';

interface IMonthSpendingsProps {
    onModalOpen: () => void,
    onModalClose: () => void,
}

interface IMonthSpendingsState {
    isForMonth: boolean,
    isModalOpen: boolean,
    openedDay: number
}

@observer
export default class MonthSpendings extends Component<IMonthSpendingsProps, IMonthSpendingsState> {

    static contextType = ApplicationContext;
    context !: ApplicationState;

    constructor(props: IMonthSpendingsProps) {
        super(props);
        this.state = {
            isForMonth: true,
            isModalOpen: false,
            openedDay: 0
        };
    }

    render() {
        const application = this.context;
        const days = Array.from({ length: application.daysInMonth - application.startOfPeriod + 1 }, (_, k) => k + 1 + application.startOfPeriod - 1);
        const budget = this.state.openedDay === application.startOfPeriod
            ? application.budgetPerDay
            : application.saldos[this.state.openedDay - 2] + application.budgetPerDay

        const styles = getStyles(application.colorScheme);

        return <View>
            {
                this.state.isModalOpen &&
                <DaysSpendingsPanel
                    closePanel={this.closeModal}
                    day={this.state.openedDay}
                    month={application.month}
                    budget={budget}
                    saldo={application.saldos[this.state.openedDay - 1]}
                    spendings={application.spendings.filter((s: Spending) => s.day === this.state.openedDay)}
                    remove={(id: SpendingId) => application.removeSpending(id)}
                    edit={(id: SpendingId, amount: number) => application.editSpending(id, amount)}
                    add={(day: number) => application.addSpending(day, 0)}
                />
            }
            <Page scheme={application.colorScheme}>
                <KeyboardAvoidingView behavior='padding'>
                    <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                        <View style={{ paddingBottom: 120 }}>
                            <Text style={styles.header}>{application.locale.statisticsPageTitle}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: 230 }}>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <TableHeader />
                                {
                                    days.map(d => <TableRow
                                        key={d}
                                        day={d}
                                        month={application.month}
                                        year={application.year}
                                        saldo={application.saldos[d - 1]}
                                        onClick={() => this.openModal(d)}
                                        isToday={d === application.day}
                                    />)
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Page>
        </View>
    }

    openModal = (day: number) => {
        this.setState({ isModalOpen: true, openedDay: day });
        this.props.onModalOpen();
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.props.onModalClose();
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40,
        color: scheme.primaryText
    }
});