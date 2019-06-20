
import React, { Component } from 'react';
import { ButtonWrapper } from './common/ButtonWrapper';
import { IconOutline } from '@ant-design/icons-react-native';
import { Font } from 'expo';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    removeSpendingButton: {
        borderRadius: 50,
        width: 40,
        height: 40,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeSpendingIcon: {
        fontSize: 20,
    }
})

export class RemoveSpendingButton extends Component {
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
        return <ButtonWrapper size={40} renderNormal={this.renderNormal} renderPressed={this.renderPressed} onPress={this.props.onPress} disabled={this.props.disabled} />
    }

    renderNormal = () => {
        return <View style={styles.removeSpendingButton}>
            {
                this.state.fontLoaded && <IconOutline style={[styles.removeSpendingIcon, { color: 'rgb(255, 69, 58)' }]} name='close-circle' />
            }
        </View>;
    }
    renderPressed = () => {
        return <View style={[styles.removeSpendingButton, { backgroundColor: 'rgb(255, 69, 58)' }]}>
            {
                this.state.fontLoaded && <IconOutline style={[styles.removeSpendingIcon, { color: 'white' }]} name='close-circle' />
            }
        </View>;
    }
}