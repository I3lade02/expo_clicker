import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ClickButton from '../components/ClickButton';
import Shop from '../components/Shop';
import { achievementList } from '../utils/achievements';
import { tapUpgrades, autoClickerUpgrades } from '../utils/upgrades';
import { themes } from '../utils/themes';
import { loadGameData, saveGameData } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function MainScreen() {
  const [score, setScore] = useState(0);
  const [ownedTapUpgrades, setOwnedTapUpgrades] = useState({});
  const [ownedAutoClickers, setOwnedAutoClickers] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [prestigeCount, setPrestigeCount] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [isInitialized, setIsInitialized] = useState(false);

  const prestigeMultiplier = 1 + prestigeCount * 0.2;
  const theme = themes.find(t => t.id === selectedTheme) || themes[0];

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await loadGameData();
        if (data) {
          setScore(data.score ?? 0);
          setOwnedTapUpgrades(data.ownedTapUpgrades ?? {});
          setOwnedAutoClickers(data.ownedAutoClickers ?? {});
          setAchievements(data.achievements ?? []);
          setPrestigeCount(data.prestigeCount ?? 0);
          setSelectedTheme(data.selectedTheme ?? 'default');
          setUnlockedThemes(data.unlockedThemes ?? ['default']);
        }
        setIsInitialized(true);
      };
      load();
    }, [])
  );

  const totalPointsPerClick = Object.entries(ownedTapUpgrades).reduce((sum, [id, qty]) => {
    const upgrade = tapUpgrades.find(u => u.id === id);
    return sum + (upgrade ? upgrade.bonus * qty : 0);
  }, 1);

  const totalAutoClickers = Object.entries(ownedAutoClickers).reduce((sum, [id, qty]) => {
    const upgrade = autoClickerUpgrades.find(u => u.id === id);
    return sum + (upgrade ? upgrade.cps * qty : 0);
  }, 0);

  useEffect(() => {
    if (!isInitialized) return;
    const interval = setInterval(() => {
      setScore(prev => prev + totalAutoClickers * prestigeMultiplier);
    }, 1000);
    return () => clearInterval(interval);
  }, [totalAutoClickers, prestigeMultiplier, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveGameData({
      score,
      ownedTapUpgrades,
      ownedAutoClickers,
      achievements,
      prestigeCount,
      selectedTheme,
      unlockedThemes,
    });
  }, [
    score,
    ownedTapUpgrades,
    ownedAutoClickers,
    achievements,
    prestigeCount,
    selectedTheme,
    unlockedThemes,
    isInitialized,
  ]);

  useEffect(() => {
    if (!isInitialized) return;

    const unlockedIds = achievements.map(a => a.id);
    const newUnlocks = [];

    achievementList.forEach(ach => {
      const isUnlocked = unlockedIds.includes(ach.id);
      const conditionMet = ach.condition({
        score,
        upgradeLevel: Object.values(ownedTapUpgrades).reduce((a, b) => a + b, 0),
        autoClickers: Object.values(ownedAutoClickers).reduce((a, b) => a + b, 0),
      });

      if (!isUnlocked && conditionMet) {
        newUnlocks.push({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          unlocked: true,
        });
        Alert.alert('Achievement Unlocked!', ach.title);
      }
    });

    if (newUnlocks.length > 0) {
      const updatedAchievements = [...achievements, ...newUnlocks];
      setAchievements(updatedAchievements);

      saveGameData({
        score,
        ownedTapUpgrades,
        ownedAutoClickers,
        achievements: updatedAchievements,
        prestigeCount,
        selectedTheme,
        unlockedThemes,
      });
    }
  }, [score, ownedTapUpgrades, ownedAutoClickers, isInitialized]);

  const handlePrestige = () => {
    Alert.alert(
      'Prestige Reset',
      'Are you sure? You will reset your progress but gain a permanent score boost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Prestige',
          style: 'destructive',
          onPress: () => {
            setScore(0);
            setOwnedTapUpgrades({});
            setOwnedAutoClickers({});
            setAchievements([]);
            const nextPrestige = prestigeCount + 1;
            setPrestigeCount(nextPrestige);

            saveGameData({
              score: 0,
              ownedTapUpgrades: {},
              ownedAutoClickers: {},
              achievements: [],
              prestigeCount: nextPrestige,
              selectedTheme,
              unlockedThemes,
            });

            Alert.alert('Prestiged!', 'You now earn more with every click!');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.score, { color: theme.colors.text }]}>
        Score: {score}
      </Text>

      <ClickButton
        onClick={() => setScore(prev => prev + totalPointsPerClick * prestigeMultiplier)}
        theme={theme}
      />

      <Shop
        score={score}
        setScore={setScore}
        ownedTapUpgrades={ownedTapUpgrades}
        setOwnedTapUpgrades={setOwnedTapUpgrades}
        ownedAutoClickers={ownedAutoClickers}
        setOwnedAutoClickers={setOwnedAutoClickers}
        theme={theme}
      />

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 16, marginBottom: 10, color: theme.colors.text }}>
          Prestige Multiplier: x{prestigeMultiplier.toFixed(1)}
        </Text>
        {score >= 1000000 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.colors.text, marginBottom: 5 }}>
              Ready to Prestige?
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 10 }}>
              Reset for permanent boost!
            </Text>
            <View style={{ backgroundColor: theme.colors.button, borderRadius: 8 }}>
              <Text
                onPress={handlePrestige}
                style={{ textAlign: 'center', padding: 10, color: '#fff', fontWeight: 'bold' }}
              >
                Prestige Now
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  score: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});
