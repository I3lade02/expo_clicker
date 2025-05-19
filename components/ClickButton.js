import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ClickButton({ onClick, theme }) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.clickButton, { backgroundColor: theme.colors.button }]}
    >
      <Text style={[styles.clickText, { color: '#fff' }]}>Compile Code</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  clickButton: {
    padding: 30,
    borderRadius: 100,
  },
  clickText: {
    fontSize: 24,
  },
});
