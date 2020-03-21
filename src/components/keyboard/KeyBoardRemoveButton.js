import React, { Component } from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { IconOutline } from '@ant-design/icons-react-native';
import * as Font from 'expo-font';
import { View, StyleSheet } from 'react-native';
import { keyButtonStyle } from './commonStyles';

const styles = StyleSheet.create({
    removeKey: {
        fontSize: 40,
        color: 'rgb(90, 200, 250)'
    },
})

export class KeyBoardRemoveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'antoutline': require('../../../node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf')
        });
        this.setState({ fontLoaded: true })
    }

    render() {
        return <ButtonWrapper size={70} renderNormal={this.renderNormal} renderPressed={this.renderPressed} onPress={this.props.onPress} />
    }

    renderNormal = () => {
        return <View style={keyButtonStyle}>
            {
                this.state.fontLoaded && <IconOutline style={styles.removeKey} name='close-circle' />
            }
        </View>;
    }
    renderPressed = () => {
        return <View style={[keyButtonStyle, { backgroundColor: 'rgb(90, 200, 250)' }]}>
            {
                this.state.fontLoaded && <IconOutline style={[styles.removeKey, { color: 'white' }]} name='close-circle' />
            }
        </View>;
    }
}