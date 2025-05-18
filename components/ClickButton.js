import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ClickButton({ onClick }) {
    return (
        <TouchableOpacity onPress={onClick} style={styles.clickButton}>
            <Text style={styles.clickText}>Compile Code</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    clickButton: {
        backgroundColor: '#007AFF',
        padding: 30,
        borderRadius: 100,
    },
    clickText: {
        color: 'white',
        fontSize: 24,
    },
});