export const initiationPackages = {
  Basic: {
    name: 'Basic',
    description: 'Entry into the Ogboni Fraternity',

    benefits: [
      'Iriláẹ (Right of Passage into the Ogboni Fraternity)',
      'Ikọta (3rd Day Ritual)',
      'Ikojẹ (7th Day Ritual)',
    ],
  },

  Standard: {
    name: 'Standard',
    description: 'Includes Basic Initiation plus Ibori',

    benefits: [
      'Everything in the Basic Package',
      "Ibori (Appeasing of One's Head)",
    ],
  },

  Premium: {
    name: 'Premium',
    description: 'Complete Initiation Package',

    benefits: [
      'Everything in the Standard Package',
      'Eran Oro (Sacrifice of a Lamb/Sheep)',
      'Ikorita (Bestowment of Chieftaincy Title)',
    ],
  },
} as const;

export type InitiationPackage = keyof typeof initiationPackages;
