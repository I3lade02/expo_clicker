// components/Shop.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { tapUpgrades, autoClickerUpgrades } from '../utils/upgrades';

export default function Shop({
  score,
  setScore,
  ownedTapUpgrades,
  setOwnedTapUpgrades,
  ownedAutoClickers,
  setOwnedAutoClickers,
}) {
  const getOwnedCount = (owned, id) => owned[id] || 0;

  const getUpgradeCost = (baseCost, quantityOwned) =>
    Math.floor(baseCost * Math.pow(1.2, quantityOwned));

  const buyUpgrade = (id, baseCost, setOwned, owned, type) => {
    const qty = getOwnedCount(owned, id);
    const cost = getUpgradeCost(baseCost, qty);

    if (score < cost) {
      alert('Not enough points!');
      return;
    }

    setScore(score - cost);
    const updated = { ...owned, [id]: qty + 1 };
    setOwned(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tap Upgrades</Text>
      {tapUpgrades.map(upg => {
        const qty = getOwnedCount(ownedTapUpgrades, upg.id);
        const cost = getUpgradeCost(upg.baseCost, qty);
        return (
          <View key={upg.id} style={styles.item}>
            <Button
              title={`${upg.name} (+${upg.bonus}) - ${cost} pts [${qty}]`}
              onPress={() =>
                buyUpgrade(upg.id, upg.baseCost, setOwnedTapUpgrades, ownedTapUpgrades, 'tap')
              }
              disabled={score < cost}
            />
          </View>
        );
      })}

      <Text style={styles.header}>Auto Clickers</Text>
      {autoClickerUpgrades.map(clicker => {
        const qty = getOwnedCount(ownedAutoClickers, clicker.id);
        const cost = getUpgradeCost(clicker.baseCost, qty);
        return (
          <View key={clicker.id} style={styles.item}>
            <Button
              title={`${clicker.name} (${clicker.cps} cps) - ${cost} pts [${qty}]`}
              onPress={() =>
                buyUpgrade(
                  clicker.id,
                  clicker.baseCost,
                  setOwnedAutoClickers,
                  ownedAutoClickers,
                  'auto'
                )
              }
              disabled={score < cost}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 30, width: '100%' },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  item: { marginVertical: 5 },
});
