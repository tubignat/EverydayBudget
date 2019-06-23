import React, { Component } from 'react';
import { ButtonWrapper } from './common/ButtonWrapper';
import { IconOutline } from '@ant-design/icons-react-native';
import { Font } from 'expo';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export class IconButton extends Component {
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
            style={{ width: this.props.size, height: this.props.size }}
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
        />
    }

    renderNormal = () => {
        return <View style={styles.button}>
            {
                this.state.fontLoaded &&
                <IconOutline style={{ fontSize: this.props.innerSize, color: 'rgb(255, 69, 58)' }} name={this.props.icon} />
            }
        </View>;
    }
    renderPressed = () => {
        return <View style={[styles.button, { backgroundColor: 'rgb(255, 69, 58)' }]}>
            {
                this.state.fontLoaded &&
                <IconOutline style={{ fontSize: this.props.innerSize, color: 'white' }} name={this.props.icon} />
            }
        </View>;
    }
}