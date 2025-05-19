import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { loadGameData } from '../utils/storage';
import { achievementList } from '../utils/achievements';

export default function AchievementsScreen() {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const loadAchievements = async () => {
            const data = await loadGameData();
            const unlocked = data.achievements || [];
            const unlockedIds = unlocked.map(a => a.id);

            const allAchievements = achievementList.map(ach => ({
                ...ach,
                unlocked: unlockedIds.includes(ach.id),
            }));
            setAchievements(allAchievements);
        };
        loadAchievements();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Achievements</Text>
            {achievements.map(ach => (
                <View key={ach.id} style={styles.item}>
                    <Text style={[styles.achTitle, ach.unlocked ? styles.unlocked : styles.locked]}>
                        {ach.unlocked ? 'Unlocked' : 'Locked'} {ach.title}
                    </Text>
                    <Text style={styles.desc}>{ach.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20, 
        paddingBottom: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBttom: 10,
    },
    achTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    desc: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    unlocked: {
        color: '#28a745',
    },
    locked: {
        color: '#888',
    },
});