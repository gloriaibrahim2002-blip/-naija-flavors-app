export type Tribe = 'Yoruba' | 'Igbo' | 'Hausa' | 'General';
export type Occasion = 'Owambe' | 'Casual' | 'Festive';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Recipe {
  id: string;
  title: string;
  tribe: Tribe;
  occasion: Occasion;
  difficulty: Difficulty;
  cookingTime: number;
  isPremium: boolean;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
  premiumStatus: boolean;
  savedRecipes: string[];
  createdAt: string;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  reference: string;
  timestamp: string;
}
