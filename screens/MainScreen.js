import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import ClickButton from '../components/ClickButton';
import Shop from '../components/Shop';
import { achievementList } from '../utils/achievements';
import { tapUpgrades, autoClickerUpgrades } from '../utils/upgrades';
import { loadGameData, saveGameData } from '../utils/storage';

export default function MainScreen() {
  const [score, setScore] = useState(0);
  const [ownedTapUpgrades, setOwnedTapUpgrades] = useState({});
  const [ownedAutoClickers, setOwnedAutoClickers] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [prestigeCount, setPrestigeCount] = useState(0);

  const prestigeMultiplier = 1 + prestigeCount * 0.2;

  // Load saved game data
  useEffect(() => {
    (async () => {
      const data = await loadGameData();
      if (data) {
        setScore(data.score);
        setOwnedTapUpgrades(data.ownedTapUpgrades || {});
        setOwnedAutoClickers(data.ownedAutoClickers || {});
        setAchievements(data.achievements || []);
        setPrestigeCount(data.prestigeCount || 0);
      }
    })();
  }, []);

  // Calculate total points per click
  const totalPointsPerClick = Object.entries(ownedTapUpgrades).reduce((sum, [id, qty]) => {
    const upgrade = tapUpgrades.find(u => u.id === id);
    return sum + (upgrade ? upgrade.bonus * qty : 0);
  }, 1); // base click = 1

  // Calculate total auto clickers (CPS)
  const totalAutoClickers = Object.entries(ownedAutoClickers).reduce((sum, [id, qty]) => {
    const upgrade = autoClickerUpgrades.find(u => u.id === id);
    return sum + (upgrade ? upgrade.cps * qty : 0);
  }, 0);

  // Passive income from auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => prev + totalAutoClickers * prestigeMultiplier);
    }, 1000);
    return () => clearInterval(interval);
  }, [totalAutoClickers]);

  // Save on any change
  useEffect(() => {
    saveGameData({
      score,
      ownedTapUpgrades,
      ownedAutoClickers,
      achievements,
    });
  }, [score, ownedTapUpgrades, ownedAutoClickers, achievements]);

  // Check and unlock achievements
  useEffect(() => {
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
      });
    }
  }, [score, ownedTapUpgrades, ownedAutoClickers]);

  const handlePrestige = () => {
    Alert.alert(
        'Prestige reset',
        'Are you sure? You will reset your progress but gain a premanent score boost.',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Prestige',
                style: 'destructive',
                onPress: () => {
                    setScore(0);
                    setOwnedTapUpgrades({});
                    setOwnedAutoClickers({});
                    setPrestigeCount(prev => {
                        const next = prev + 1;

                        saveGameData({
                            score: 0,
                            ownedTapUpgrades: {},
                            ownedAutoClickers: {},
                            prestigeCount: next,
                        });
                        return next;
                    });
                    Alert.alert('Prestiged', 'You now earn more with every click!');
                },
            },
        ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score.toFixed(1)}</Text>
      <ClickButton onClick={() => setScore(prev => prev + totalPointsPerClick * prestigeMultiplier)} />
      <Shop
        score={score}
        setScore={setScore}
        ownedTapUpgrades={ownedTapUpgrades}
        setOwnedTapUpgrades={setOwnedTapUpgrades}
        ownedAutoClickers={ownedAutoClickers}
        setOwnedAutoClickers={setOwnedAutoClickers}
      />
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
            Prestige Multiplier: x{prestigeMultiplier.toFixed(1)}
        </Text>
        {score >= 1000000 && (
            <Button title='Prestige & Restart (1M+)' color='#d35400' onPress={handlePrestige} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  score: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});
