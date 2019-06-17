import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyBoardDigitButton } from './KeyBoardDigitButton';
import { KeyBoardRemoveButton } from './KeyBoardRemoveButton';

const styles = StyleSheet.create({
    keyBoard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export class KeyBoard extends Component {

    render() {
        return <View style={styles.keyBoard}>
            <View style={styles.row}>
                <KeyBoardDigitButton digit={1} onPress={() => this.props.onKeyPressed(1)} />
                <KeyBoardDigitButton digit={2} onPress={() => this.props.onKeyPressed(2)} />
                <KeyBoardDigitButton digit={3} onPress={() => this.props.onKeyPressed(3)} />
            </View>
            <View style={styles.row}>
                <KeyBoardDigitButton digit={4} onPress={() => this.props.onKeyPressed(4)} />
                <KeyBoardDigitButton digit={5} onPress={() => this.props.onKeyPressed(5)} />
                <KeyBoardDigitButton digit={6} onPress={() => this.props.onKeyPressed(6)} />
            </View>
            <View style={styles.row}>
                <KeyBoardDigitButton digit={7} onPress={() => this.props.onKeyPressed(7)} />
                <KeyBoardDigitButton digit={8} onPress={() => this.props.onKeyPressed(8)} />
                <KeyBoardDigitButton digit={9} onPress={() => this.props.onKeyPressed(9)} />
            </View>
            <View style={styles.row}>
                <KeyBoardDigitButton digit={'.'} onPress={() => this.props.onKeyPressed('.')} />
                <KeyBoardDigitButton digit={0} onPress={() => this.props.onKeyPressed(0)} />
                <KeyBoardRemoveButton onPress={this.props.onRemoveKeyPressed} />
            </View>
        </View>
    }
}