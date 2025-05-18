// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadGameData = async () => {
  try {
    const data = await AsyncStorage.multiGet([
      'score',
      'ppc',
      'auto',
      'upgradeLevel',
      'autoClickerLevel',
      'achievements',
    ]);
    return {
      score: parseInt(data[0][1]) || 0,
      pointsPerClick: parseInt(data[1][1]) || 1,
      autoClickers: parseInt(data[2][1]) || 0,
      upgradeLevel: parseInt(data[3][1]) || 0,
      autoClickerLevel: parseInt(data[4][1]) || 0,
      achievements: JSON.parse(data[5][1] || '[]'),
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
      ['ppc', data.pointsPerClick.toString()],
      ['auto', data.autoClickers.toString()],
      ['upgradeLevel', data.upgradeLevel.toString()],
      ['autoClickerLevel', data.autoClickerLevel.toString()],
      ['achievements', JSON.stringify(data.achievements)],
    ]);
  } catch (err) {
    console.error('Failed to save game data:', err);
  }
};
