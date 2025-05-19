import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { tapUpgrades, autoClickerUpgrades } from '../utils/upgrades';

export default function Shop({
  score,
  setScore,
  ownedTapUpgrades,
  setOwnedTapUpgrades,
  ownedAutoClickers,
  setOwnedAutoClickers,
  theme,
}) {
  const getOwnedCount = (owned, id) => owned[id] || 0;
  const getUpgradeCost = (baseCost, quantityOwned) =>
    Math.floor(baseCost * Math.pow(1.2, quantityOwned));

  const buyUpgrade = (id, baseCost, setOwned, owned) => {
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

  const renderUpgrade = (item, owned, setOwned, isAuto) => {
    const qty = getOwnedCount(owned, item.id);
    const cost = getUpgradeCost(item.baseCost, qty);
    const label = isAuto
      ? `${item.name} (${item.cps} cps) - ${cost} pts [${qty}]`
      : `${item.name} (+${item.bonus}) - ${cost} pts [${qty}]`;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.item, { backgroundColor: theme.colors.button }]}
        onPress={() => buyUpgrade(item.id, item.baseCost, setOwned, owned)}
        disabled={score < cost}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Tap Upgrades</Text>
      {tapUpgrades.map(upg =>
        renderUpgrade(upg, ownedTapUpgrades, setOwnedTapUpgrades, false)
      )}

      <Text style={[styles.header, { color: theme.colors.text }]}>Auto Clickers</Text>
      {autoClickerUpgrades.map(upg =>
        renderUpgrade(upg, ownedAutoClickers, setOwnedAutoClickers, true)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 30, width: '100%' },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  item: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
