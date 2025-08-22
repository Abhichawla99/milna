
const animals = [
  'Wolf', 'Dragon', 'Phoenix', 'Tiger', 'Eagle', 'Raven', 'Fox', 'Lion', 'Bear', 'Falcon',
  'Panther', 'Shark', 'Owl', 'Leopard', 'Hawk', 'Viper', 'Cobra', 'Lynx', 'Jaguar', 'Orca'
];

const paranormalCharacters = [
  'Shadow', 'Spirit', 'Phantom', 'Wraith', 'Mystic', 'Oracle', 'Wizard', 'Sage', 'Seer', 'Guardian',
  'Enchanter', 'Sorceress', 'Necromancer', 'Shaman', 'Druid', 'Warlock', 'Witch', 'Mage', 'Templar', 'Paladin'
];

const adjectives = [
  'Crimson', 'Golden', 'Silver', 'Midnight', 'Thunder', 'Lightning', 'Frost', 'Fire', 'Storm', 'Steel',
  'Ancient', 'Eternal', 'Swift', 'Silent', 'Fierce', 'Noble', 'Wild', 'Dark', 'Bright', 'Celestial'
];

export const generateUniqueAgentId = (): string => {
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomCharacter = paranormalCharacters[Math.floor(Math.random() * paranormalCharacters.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  // Create combinations like "CrimsonDragonWizard" or "MidnightWolfShaman"
  const combinations = [
    `${randomAdjective}${randomAnimal}${randomCharacter}`,
    `${randomAdjective}${randomCharacter}${randomAnimal}`,
    `${randomAnimal}${randomAdjective}${randomCharacter}`,
  ];
  
  const selectedCombination = combinations[Math.floor(Math.random() * combinations.length)];
  
  // Add a random number suffix to ensure uniqueness
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${selectedCombination}${randomSuffix}`;
};
