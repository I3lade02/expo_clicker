import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AchievementList({ achievements }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      {achievements.length === 0 ? (
        <Text style={styles.item}>None yet</Text>
      ) : (
        achievements.map(ach => (
          <Text key={ach.id} style={styles.item}>🏆 {ach.title}</Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, width: '100%' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 16, marginBottom: 5 },
});
