import { Recipe } from './types';

export const RECIPIES: Recipe[] = [
  {
    id: 'jollof-rice',
    title: 'Party Jollof Rice',
    tribe: 'General',
    occasion: 'Owambe',
    difficulty: 'Medium',
    cookingTime: 60,
    isPremium: false,
    ingredients: [
      '3 cups Long grain parboiled rice',
      '5 large Red bell peppers (Tatashe)',
      '3 Scotch bonnet peppers (Atarodo)',
      '1.5kg Beef or Chicken',
      '2 cups Beef/Chicken stock',
      '1 cup vegetable oil',
      '2 sachets Tomato paste',
      '3 medium onions',
      'Thyme, Curry powder, Bay leaves',
      'Seasoning cubes and Salt'
    ],
    instructions: [
      'Blend the red bell peppers, scotch bonnets, and 2 onions into a smooth paste. Pour into a pot and boil until the liquid evaporates completely.',
      'In a separate large pot, heat the vegetable oil and fry one sliced onion until translucent and fragrant.',
      'Stir in the tomato paste and fry for 5-10 minutes, stirring constantly to remove the sour taste.',
      'Add the boiled pepper mix to the pot and fry together for another 15 minutes or until oil starts to float to the top.',
      'Pour in the meat stock, add curry powder, thyme, bay leaves, seasoning cubes, and salt. Bring to a rolling boil.',
      'Wash the rice thoroughly to remove excess starch (parboil if necessary) and add it to the simmering sauce.',
      'Ensure the liquid is just enough to cover the rice. Cover the pot with a layer of aluminum foil before placing the lid to trap steam effectively.',
      'Turn the heat to the lowest setting and allow the rice to steam for 30-40 minutes. Do not stir prematurely.',
      'Once the rice is soft, use a wooden spoon to fluff it. Increase the heat for the last 3-5 minutes to allow the bottom to "burn" slightly—this provides the authentic party smoky aroma.',
      'Serve warm with plantains and moin moin.'
    ],
    imageUrl: 'https://picsum.photos/seed/jollof/800/600'
  },
  {
    id: 'fried-rice-nigerian',
    title: 'Heritage Fried Rice',
    tribe: 'General',
    occasion: 'Owambe',
    difficulty: 'Medium',
    cookingTime: 50,
    isPremium: true,
    ingredients: [
      '4 cups Long grain parboiled rice',
      '1 cup Liver, diced and fried',
      '1 cup Shrimps, cleaned',
      '2 cups Mixed vegetables (Carrots, Peas, Green beans)',
      '1 cup Beef/Chicken stock (Concentrated)',
      '1 tbsp Curry powder',
      '1 tsp Turmeric',
      'Ginger and Garlic paste',
      'Green bell peppers, diced',
      'Vegetable oil and Butter'
    ],
    instructions: [
      'Wash the rice thoroughly and parboil with a bit of salt, curry, and turmeric until it is about 70% cooked (firm to the bite).',
      'Rinse the rice in cold water and drain in a colander to stop the cooking process.',
      'In a dry pot, add half of the meat stock and bring to a simmer. Add the parboiled rice and steam on very low heat until the stock is fully absorbed and the rice is tender but grainy.',
      'In a large wok or wide pan, melt a bit of butter into vegetable oil. Sauté the ginger, garlic, and diced onions for 2 minutes.',
      'Add the liver, shrimps, and mixed vegetables. Season with a tiny bit of salt and seasoning cubes. Stir-fry for 3-5 minutes.',
      'Working in batches, add sections of the steamed rice to the pan and stir-fry vigorously over high heat.',
      'Ensure the rice is well coated in the vegetable oil and spices. Toss in the green bell peppers at the very end for crunch.',
      'Repeat the stir-frying process for all the rice until every grain is vibrant and fragrant.',
      'Serve alongside grilled chicken or fish.'
    ],
    imageUrl: 'https://picsum.photos/seed/friedrice/800/600'
  },
  {
    id: 'pounded-yam-trad',
    title: 'Pounded Yam (Iyan)',
    tribe: 'Yoruba',
    occasion: 'Festive',
    difficulty: 'Hard',
    cookingTime: 40,
    isPremium: false,
    ingredients: [
      '2 tubers of Puna Yam (Mature)',
      'Water for boiling',
      'Mortar and Pestle (Traditional) or High-speed pounder'
    ],
    instructions: [
      'Peel the yam tubers, ensuring you remove all the brown skin. Cut into large cubes or rounds.',
      'Wash the yam pieces thoroughly and place them in a pot with enough water to cover them halfway.',
      'Boil the yam without salt until it is extremely soft and a fork passes through with no resistance.',
      'If using a mortar, transfer the hot yam pieces (batch by batch) and begin pounding with rhythmic strokes.',
      'Add a few tablespoons of the yam water (the water used for boiling) periodically to help the yam become smooth and stretchy.',
      'Continue pounding until all lumps are gone and you achieve a dough-like consistency that is supple and elastic.',
      'If using a machine, follow the same "hot yam" principle to ensure the starch gelatinizes correctly.',
      'Wrap in plastic film or serve immediately while warm with Egusi or Efo Riro soup.'
    ],
    imageUrl: 'https://picsum.photos/seed/poundedyam/800/600'
  },
  {
    id: 'egusi-soup',
    title: 'Owambe Lumpy Egusi',
    tribe: 'General',
    occasion: 'Festive',
    difficulty: 'Hard',
    cookingTime: 45,
    isPremium: true,
    ingredients: [
      '2 cups Melon seeds (fine ground)',
      'Assorted meat (Shaki, Beef, Cow leg)',
      'Dry fish and Stock fish',
      'Palm oil',
      '3 tbsp Crayfish (ground)',
      'Ugu or Bitter leaf (shredded)',
      'Iru (Locust beans)',
      'Onions and Pepper'
    ],
    instructions: [
      'Prepare and boil all meats and fish with seasonings until tender. Reserve the rich stock.',
      'Mix the ground egusi with a half-cup of onion water or stock to form thick, paste-like balls.',
      'Heat palm oil in a pot until clear but not bleached. Fry sliced onions and locust beans briefly.',
      'Drop the egusi paste balls into the hot oil. DO NOT STIR. Cover and let them fry/steam for 10 minutes until they become firm lumps.',
      'Gently flip the lumps to fry the other side. Once firm, add the meat stock and assorted meats.',
      'Simmer on medium heat for 15 minutes. The egusi should absorb the stock and the oil should start to rise to the top.',
      'Add the ground crayfish and check for seasoning. If it is too thick, add a bit more water or stock.',
      'Stir in the shredded vegetables (Ugu or Spinach). Cook for exactly 3-5 more minutes to keep the veggies vibrant.',
      'Serve as the centerpiece of an Owambe menu with Pounded Yam.'
    ],
    imageUrl: 'https://picsum.photos/seed/egusi/800/600'
  },
  {
    id: 'efo-riro',
    title: 'Efo Riro (Vegetable Rich)',
    tribe: 'Yoruba',
    occasion: 'Owambe',
    difficulty: 'Medium',
    cookingTime: 35,
    isPremium: true,
    ingredients: [
      'Fresh Spinach (Soko or Tete)',
      'Roughly blended Paprika and Habanero',
      'Palmoil',
      'Iru (Locust beans)',
      'Stockfish, Dry fish, and Smoked Prawns',
      'Boiled Assorted Meats (Ponmo, Beef, Tripe)',
      'Ground Crayfish'
    ],
    instructions: [
      'Wash the vegetables thoroughly and blanch briefly in hot water. Immediately transfer to cold water and squeeze out every drop of moisture.',
      'Boil your pepper mix until it is very thick and almost no water remains.',
      'Heat palm oil and fry some onions and iru. The iru should release a distinct nutty aroma.',
      'Add the pepper mix and fry in the oil for 10-15 minutes until the oil separates from the pepper.',
      'Add all your proteins (stockfish, meats, prawns) and crayfish. Allow them to simmer in the pepper sauce for 5 minutes so they absorb the spice.',
      'Taste and adjust seasoning. Note that dried fish adds salt, so be careful with extra cubes.',
      'Finally, add the squeezed vegetables. Stir vigorously to coat the greens in the thick sauce.',
      'Cook on high heat for no more than 2 minutes and turn off the burner. The residual heat will finish the cooking while keeping the greens fresh.',
      'Serve with a sense of pride alongside Iyan or Amala.'
    ],
    imageUrl: 'https://picsum.photos/seed/efo/800/600'
  }
];
