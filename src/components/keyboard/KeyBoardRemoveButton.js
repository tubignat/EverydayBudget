import React, { Component } from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { IconFill } from '@ant-design/icons-react-native';
import { Font } from 'expo';
import { View, StyleSheet } from 'react-native';
import { keyButtonStyle } from './commonStyles';

const styles = StyleSheet.create({
    removeKey: {
        fontSize: 40,
        color: 'rgb(230, 69, 58)'
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
            'antfill': require('../../../node_modules/@ant-design/icons-react-native/fonts/antfill.ttf')
        });
        this.setState({ fontLoaded: true })
    }

    render() {
        return <ButtonWrapper renderNormal={this.renderNormal} renderPressed={this.renderPressed} onPress={this.props.onPress} />
    }

    renderNormal = () => {
        return <View style={keyButtonStyle}>
            {
                this.state.fontLoaded && <IconFill style={styles.removeKey} name='close-circle' />
            }
        </View>;
    }
    renderPressed = () => {
        return <View style={keyButtonStyle}>
            {
                this.state.fontLoaded && <IconFill style={[styles.removeKey, { fontSize: 65 }]} name='close-circle' />
            }
        </View>;
    }
}