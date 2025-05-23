import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadGameData = async () => {
  try {
    const data = await AsyncStorage.multiGet([
      'score',
      'ownedTapUpgrades',
      'ownedAutoClickers',
      'achievements',
      'prestigeCount',
      'selectedTheme',
      'unlockedThemes',
    ]);

    return {
      score: parseInt(data[0][1]) || 0,
      ownedTapUpgrades: JSON.parse(data[1][1] || '{}'),
      ownedAutoClickers: JSON.parse(data[2][1] || '{}'),
      achievements: JSON.parse(data[3][1] || '[]'),
      prestigeCount: parseInt(data[4][1]) || 0,
      selectedTheme: data[5][1] || 'default',
      unlockedThemes: JSON.parse(data[6][1] || '["default"]'),
    };
  } catch (err) {
    console.error('Failed to load game data:', err);
    return null;
  }
};


export const saveGameData = async (data) => {
  try {
    await AsyncStorage.multiSet([
      ['score', data.score.toString()],
      ['ownedTapUpgrades', JSON.stringify(data.ownedTapUpgrades || {})],
      ['ownedAutoClickers', JSON.stringify(data.ownedAutoClickers || {})],
      ['achievements', JSON.stringify(data.achievements || [])],
      ['prestigeCount', (data.prestigeCount || 0).toString()],
      ['selectedTheme', data.selectedTheme || 'default'],
      ['unlockedThemes', JSON.stringify(data.unlockedThemes || ['default'])],
    ]);
  } catch (err) {
    console.error('Failed to save game data:', err);
  }
};

