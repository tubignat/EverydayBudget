import React, { Component } from 'react';
import { IconButton } from '../../common/IconButton';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import AmountInput from '../../common/AmountInput';
import { TextButton } from '../../common/TextButton';
import { ApplicationContext } from '../../../ApplicationContext';
import { ApplicationState } from '../../../ApplicationState';
import { ColorScheme } from '../../../color/ColorScheme';
import { Expense, ExpenseId } from '../../../../domain/repositories/ExpensesRepository';
import { Income, IncomeId } from '../../../../domain/repositories/IncomesRepository';

interface IIncomesListProps {
    incomes: (Income | Expense)[]
    thereAreNoValuesYetText: string
    onRemove: (id: IncomeId | ExpenseId) => void
    onAmountChanged: (id: IncomeId | ExpenseId, amount: number) => void
    onDescriptionChanged: (id: IncomeId | ExpenseId, description: string) => void
    onAdd: () => void
}

interface IIncomesListState {
    moveAnim: Animated.Value
    fontSizeAnim: Animated.Value
    fadeAnim: Animated.Value
}

export class IncomesList extends Component<IIncomesListProps, IIncomesListState> {

    static contextType = ApplicationContext;

    context!: ApplicationState;
    addButtonRef: View | null = null;
    addButtonRef2: View | null = null;

    constructor(props: IIncomesListProps) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0),
            fontSizeAnim: new Animated.Value(1),
            fadeAnim: new Animated.Value(this.props.incomes.length === 0 ? 1 : 0)
        };
    }

    render() {
        const { locale, colorScheme } = this.context;
        const styles = getStyles(colorScheme);

        return <View style={styles.incomesList}>
            {
                <Animated.View style={{
                    ...styles.emptyListTextContainer,
                    zIndex: this.props.incomes.length === 0 ? 100 : 0
                }}>
                    <Animated.Text style={{
                        ...styles.emptyListText,
                        opacity: this.state.fadeAnim
                    }}>
                        {this.props.thereAreNoValuesYetText}
                    </Animated.Text>
                    <View style={{ opacity: this.props.incomes.length === 0 ? 1 : 0 }}>
                        <TextButton
                            forwardedRef={ref => this.addButtonRef = ref}
                            text={locale.add}
                            height={50}
                            fontSize={15}
                            onPress={this.onAdd}
                            scheme={colorScheme}
                            disabled={false}
                        />
                    </View>
                </Animated.View>
            }
            <View style={{ minHeight: 70 }}>
                {
                    this.props.incomes.map((i) =>
                        <IncomeView
                            key={i.id}
                            income={i}
                            onRemoveButtonPressed={() => this.props.onRemove(i.id)}
                            onAmountChanged={(amount) => this.props.onAmountChanged(i.id, amount)}
                            onDescriptionChanged={(description) => this.props.onDescriptionChanged(i.id, description)}
                            onRemoveAnimationStart={this.onRemoveAnimationStart}
                        />
                    )
                }
                {
                    this.props.incomes.length > 0 &&
                    <Animated.View style={{
                        ...styles.addButton,
                        transform: [
                            { translateX: this.state.moveAnim },
                            { scaleX: this.state.fontSizeAnim },
                            { scaleY: this.state.fontSizeAnim }]
                    }}>
                        <TextButton
                            forwardedRef={ref => this.addButtonRef2 = ref}
                            text={locale.add}
                            height={48}
                            fontSize={18}
                            onPress={this.props.onAdd}
                            scheme={colorScheme}
                            disabled={false}
                        />
                    </Animated.View>
                }
            </View>
        </View>
    }

    onAdd = () => {

        this.addButtonRef?.measure((fx, fy, width, height, px) => {
            this.state.moveAnim.setValue(px - 40 - 24);
            this.state.fontSizeAnim.setValue(0.85);
            this.state.fadeAnim.setValue(1);
            Animated
                .parallel([
                    Animated.timing(this.state.moveAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
                    Animated.timing(this.state.fontSizeAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
                    Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 75, useNativeDriver: false })
                ])
                .start();

            this.props.onAdd();
        });
    }

    onRemoveAnimationStart = () => {
        if (this.props.incomes.length === 1) {
            this.addButtonRef?.measure((fx, fy, width, height, px) => {

                this.addButtonRef2?.measure((fx, fy, width, height, px2) => {

                    const toValue = this.context.language === 'ru' ? px - px2 - 4 : px - px2;
                    Animated
                        .parallel([
                            Animated.timing(this.state.moveAnim, { toValue: toValue, duration: 150, useNativeDriver: false }),
                            Animated.timing(this.state.fontSizeAnim, { toValue: 0.85, duration: 150, useNativeDriver: false }),
                        ])
                        .start();
                    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
                })
            })
        }
    }
}

interface IIncomeViewProps {
    income: Income | Expense
    onAmountChanged: (newAmount: number) => void
    onDescriptionChanged: (newDescription: string) => void
    onRemoveAnimationStart: () => void
    onRemoveButtonPressed: () => void
}

interface IIncomeViewState {
    fadeAnim: Animated.Value
    expandAnim: Animated.Value
}

class IncomeView extends Component<IIncomeViewProps, IIncomeViewState> {

    static contextType = ApplicationContext;

    context !: ApplicationState;

    constructor(props: IIncomeViewProps) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),
            expandAnim: new Animated.Value(0)
        };

        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
        Animated.timing(this.state.expandAnim, { toValue: 52, duration: 150, useNativeDriver: false }).start();
    }

    render() {
        const { locale, currency, colorScheme } = this.context;
        const styles = getStyles(colorScheme);

        return <Animated.View style={{
            ...styles.incomeView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <View style={{ marginRight: 16 }}>
                <AmountInput
                    color={colorScheme.primaryText}
                    value={this.props.income.amount}
                    maxValue={999999}
                    onChange={(newAmount) => this.props.onAmountChanged(newAmount)}
                    placeholder={''}
                    currency={currency}
                    fontSize={20}
                    width={96}
                    height='100%'
                />
            </View>
            <TextInput
                style={styles.incomeViewText}
                onChangeText={this.props.onDescriptionChanged}
                value={this.props.income.description}
                selectTextOnFocus
                placeholder={locale.description}
                placeholderTextColor={colorScheme.secondaryText}
            />
            <Animated.View style={{
                ...styles.removeButtonContainer,
                opacity: this.state.fadeAnim,
                transform: [{ scaleX: this.state.fadeAnim }, { scaleY: this.state.fadeAnim }]
            }}>
                <IconButton size={52} innerSize={20} icon='close-circle' color={colorScheme.danger}
                    onPress={this.onRemove} disabled={false} />
            </Animated.View>
        </Animated.View>
    }

    onRemove = () => {
        this.props.onRemoveAnimationStart();
        Animated.parallel([
            Animated.timing(this.state.expandAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
            Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
        ])
            .start(this.props.onRemoveButtonPressed)
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    incomesList: {
        position: 'relative',
        width: '100%',
        marginBottom: 43
    },
    addButton: {
        marginTop: 16,
        flexDirection: 'row',
        width: 96,
        justifyContent: 'flex-end',
    },
    incomeView: {
        flexDirection: 'row',
        height: 52,
    },
    emptyListTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        marginTop: 16
    },
    emptyListText: {
        color: scheme.secondaryText,
        fontSize: 15,
    },
    removeButtonContainer: {
    },
    incomeViewText: {
        fontSize: 20,
        flexGrow: 2,
        flexShrink: 1,
        color: scheme.primaryText
    },
});
