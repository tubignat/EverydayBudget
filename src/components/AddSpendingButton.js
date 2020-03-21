import React, { Component } from 'react';
import { ButtonWrapper } from './common/ButtonWrapper';
import { IconOutline } from '@ant-design/icons-react-native';
import * as Font from 'expo-font';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    AddSpendingButton: {
        borderRadius: 50,
        width: 60,
        height: 60,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -5
    },
    addSpendingIcon: {
        fontSize: 45,
    }
})

export class AddSpendingButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        await Font.loadAsync({
            'antoutline': require('../../node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf')
        });
        this.setState({ fontLoaded: true })
    }

    render() {
        return <ButtonWrapper
            width={60}
            height={60}
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
        />
    }

    renderNormal = () => {
        return <View style={styles.AddSpendingButton}>
            {
                this.state.fontLoaded && <IconOutline style={[styles.addSpendingIcon, { color: this.props.disabled ? 'lightgray' : 'rgb(48, 209, 88)' }]} name='plus-circle' />
            }
        </View>;
    }
    renderPressed = () => {
        return <View style={[styles.AddSpendingButton, { backgroundColor: 'rgb(48, 209, 88)' }]}>
            {
                this.state.fontLoaded && <IconOutline style={[styles.addSpendingIcon, { color: 'white' }]} name='plus-circle' />
            }
        </View>;
    }
}