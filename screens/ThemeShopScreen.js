import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { themes } from '../utils/themes';
import { loadGameData, saveGameData } from '../utils/storage';

export default function ThemeShopScreen() {
    const [score, setScore] = useState(0);
    const [unlockedThemes, setUnlockedThemes] = useState(['default']);
    const [selectedTheme, setSelectedTheme] = useState('default');

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const data = await loadGameData();
                setScore(data.score);
                setUnlockedThemes(data.unlockedThemes || ['default']);
                setSelectedTheme(data.selectedTheme || 'default');
            };
            load();
        }, [])
    );

    const handleBuy = async (theme) => {
        if (score < theme.price) {
            Alert.alert('Not enough points!');
            return;
        }

        const newScore = score - theme.price;
        const updatedUnlocked = [...unlockedThemes, theme.id];

        setScore(newScore);
        setUnlockedThemes(updatedUnlocked);
        setSelectedTheme(theme.id);

        await saveGameData({
            score: newScore,
            unlockedThemes: updatedUnlocked,
            selectedTheme: theme.id,
        });

        Alert.alert('Theme unlocked', `You've unlocked '${theme.name}'`);
    };

    const handleSelect = async (theme) => {
        setSelectedTheme(theme.id);
        await saveGameData({
            score,unlockedThemes,
            selectedTheme: theme.id,
        });

        Alert.alert('Theme applied', `'${theme.name}' is now active!`);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Theme Shop</Text>
            <Text style={styles.subtitle}>Score: {score.toFixed(1)}</Text>

            {themes.map((theme) => {
                const isUnlocked = unlockedThemes.includes(theme.id);
                const isSelected = selectedTheme === theme.id;

                return (
                    <View key={theme.id} style={[styles.themeItem, {backgroundColor: theme.colors.background}]}>
                        <Text style={[styles.themeName, { color: theme.colors.text }]}>{theme.name}</Text>
                        {!isUnlocked ? (
                            <Button title={`Buy for ${theme.price} pts`} onPress={() => handleBuy(theme)} />
                        ): isSelected ? (
                            <Text style={[styles.selected, { color: theme.colors.text }]}>Selected</Text>
                        ) : (
                            <Button title='Select' onPress={() => handleSelect(theme)} />
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 80 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 20 },
    themeItem: { padding: 20, borderRadius: 10, marginBottom: 15, elevation: 2 },
    themeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    selected: { fontSize: 16, fontStyle: 'italic' },
});