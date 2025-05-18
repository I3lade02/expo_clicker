// components/Shop.js
import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';

export default function Shop({
  score,
  setScore,
  pointsPerClick,
  setPointsPerClick,
  autoClickers,
  setAutoClickers,
  upgradeLevel,
  setUpgradeLevel,
  autoClickerLevel,
  setAutoClickerLevel,
}) {
  const getUpgradeCost = () => Math.floor(50 * Math.pow(1.15, upgradeLevel));
  const getAutoClickerCost = () => Math.floor(100 * Math.pow(1.2, autoClickerLevel));

  const buyUpgrade = () => {
    const cost = getUpgradeCost();
    if (score >= cost) {
      setScore(score - cost);
      setPointsPerClick(pointsPerClick + 1);
      setUpgradeLevel(upgradeLevel + 1);
    } else {
      Alert.alert('Not enough points!');
    }
  };

  const buyAutoClicker = () => {
    const cost = getAutoClickerCost();
    if (score >= cost) {
      setScore(score - cost);
      setAutoClickers(autoClickers + 1);
      setAutoClickerLevel(autoClickerLevel + 1);
    } else {
      Alert.alert('Not enough points!');
    }
  };

  return (
    <View style={styles.shop}>
      <Button
        title={`Upgrade Tap (+1) - ${getUpgradeCost()} pts`}
        onPress={buyUpgrade}
        disabled={score < getUpgradeCost()}
      />
      <Button
        title={`Buy AutoClicker - ${getAutoClickerCost()} pts`}
        onPress={buyAutoClicker}
        disabled={score < getAutoClickerCost()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shop: {
    marginTop: 30,
    gap: 20,
    width: '100%',
  },
});
