// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ClickButton from './components/ClickButton';
import Shop from './components/Shop';
import AchievementList from './components/AchievementList';
import { achievementList } from './utils/achievements';
import { loadGameData, saveGameData } from './utils/storage';

export default function App() {
  const [score, setScore] = useState(0);
  const [pointsPerClick, setPointsPerClick] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [upgradeLevel, setUpgradeLevel] = useState(0);
  const [autoClickerLevel, setAutoClickerLevel] = useState(0);
  const [achievements, setAchievements] = useState([]);

  // Load saved data
  useEffect(() => {
    (async () => {
      const data = await loadGameData();
      if (data) {
        setScore(data.score);
        setPointsPerClick(data.pointsPerClick);
        setAutoClickers(data.autoClickers);
        setUpgradeLevel(data.upgradeLevel);
        setAutoClickerLevel(data.autoClickerLevel);
        setAchievements(data.achievements || []);
      }
    })();
  }, []);

  // Save data on change
  useEffect(() => {
    saveGameData({
      score,
      pointsPerClick,
      autoClickers,
      upgradeLevel,
      autoClickerLevel,
      achievements,
    });
  }, [score, pointsPerClick, autoClickers, upgradeLevel, autoClickerLevel, achievements]);

  // Passive income from auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => prev + autoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  // Achievement check
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = [...achievements];
      achievementList.forEach(ach => {
        const alreadyUnlocked = newAchievements.find(a => a.id === ach.id);
        if (!alreadyUnlocked && ach.condition({ score, upgradeLevel, autoClickers })) {
          newAchievements.push({ ...ach, unlocked: true });
          Alert.alert('Achievement Unlocked!', ach.title);
        }
      });
      if (newAchievements.length > achievements.length) {
        setAchievements(newAchievements);
      }
    };
    checkAchievements();
  }, [score, upgradeLevel, autoClickers]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <ClickButton onClick={() => setScore(prev => prev + pointsPerClick)} />
      <Shop
        score={score}
        setScore={setScore}
        pointsPerClick={pointsPerClick}
        setPointsPerClick={setPointsPerClick}
        autoClickers={autoClickers}
        setAutoClickers={setAutoClickers}
        upgradeLevel={upgradeLevel}
        setUpgradeLevel={setUpgradeLevel}
        autoClickerLevel={autoClickerLevel}
        setAutoClickerLevel={setAutoClickerLevel}
      />
      <AchievementList achievements={achievements} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  score: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});
