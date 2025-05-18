// utils/achievements.js
export const achievementList = [
  {
    id: 'score_100',
    title: 'Getting Started',
    description: 'Reach 100 points.',
    condition: ({ score }) => score >= 100,
  },
  {
    id: 'tap_upgrade_3',
    title: 'Tappy Fingers',
    description: 'Buy 3 tap upgrades.',
    condition: ({ upgradeLevel }) => upgradeLevel >= 3,
  },
  {
    id: 'auto_5',
    title: 'Automation Nation',
    description: 'Buy 5 auto-clickers.',
    condition: ({ autoClickers }) => autoClickers >= 5,
  },
];
