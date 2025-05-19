import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { themes } from '../utils/themes';
import { loadGameData, saveGameData } from '../utils/storage';

export default function ThemeShopScreen() {
  const [score, setScore] = useState(0);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [selectedTheme, setSelectedTheme] = useState('default');

  const theme = themes.find((t) => t.id === selectedTheme) || themes[0];

  // Load fresh data on screen focus
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await loadGameData();
        setScore(data.score ?? 0);
        setUnlockedThemes(data.unlockedThemes ?? ['default']);
        setSelectedTheme(data.selectedTheme ?? 'default');
      };
      load();
    }, [])
  );

  const handleBuy = async (themeToBuy) => {
    if (score < themeToBuy.price) {
      Alert.alert('Not enough points!');
      return;
    }

    const newScore = score - themeToBuy.price;
    const updatedUnlocked = [...unlockedThemes, themeToBuy.id];
    const latestData = await loadGameData();

    setScore(newScore);
    setUnlockedThemes(updatedUnlocked);
    setSelectedTheme(themeToBuy.id);

    await saveGameData({
      ...latestData,
      score: newScore,
      unlockedThemes: updatedUnlocked,
      selectedTheme: themeToBuy.id,
    });

    Alert.alert('Theme Unlocked', `You've unlocked '${themeToBuy.name}'`);
  };

  const handleSelect = async (themeToSelect) => {
    setSelectedTheme(themeToSelect.id);
    const latestData = await loadGameData();

    await saveGameData({
      ...latestData,
      selectedTheme: themeToSelect.id,
    });

    Alert.alert('Theme Applied', `'${themeToSelect.name}' is now active!`);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Theme Shop</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Score: {score.toFixed(1)}
      </Text>

      {themes.map((themeOption) => {
        const isUnlocked = unlockedThemes.includes(themeOption.id);
        const isSelected = selectedTheme === themeOption.id;

        return (
          <View
            key={themeOption.id}
            style={[
              styles.themeItem,
              { backgroundColor: themeOption.colors.background },
            ]}
          >
            <Text
              style={[styles.themeName, { color: themeOption.colors.text }]}
            >
              {themeOption.name}
            </Text>
            {!isUnlocked ? (
              <Button
                title={`Buy for ${themeOption.price} pts`}
                onPress={() => handleBuy(themeOption)}
              />
            ) : isSelected ? (
              <Text
                style={[styles.selected, { color: themeOption.colors.text }]}
              >
                Selected
              </Text>
            ) : (
              <Button
                title="Select"
                onPress={() => handleSelect(themeOption)}
              />
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
  themeItem: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  themeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  selected: { fontSize: 16, fontStyle: 'italic' },
});
