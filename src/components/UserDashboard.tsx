import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, Transaction, Recipe } from '../types';
import { RECIPIES } from '../data';
import { motion } from 'motion/react';
import { Heart, History, Calendar, ChefHat, ExternalLink, Clock } from 'lucide-react';
import RecipeCard from './RecipeCard';

interface Props {
  user: UserProfile;
  onSelectRecipe: (id: string) => void;
}

export default function UserDashboard({ user, onSelectRecipe }: Props) {
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'mealPlan'>('saved');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const savedRecipes = RECIPIES.filter(r => user.savedRecipes.includes(r.id));

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-beige-line shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-terracotta flex items-center justify-center text-white shadow-xl shadow-terracotta/20 border-4 border-white">
            <ChefHat size={40} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-serif font-black italic text-earth-dark mb-2">
              {user.displayName.split(' ')[0]}'s Kitchen
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.premiumStatus ? 'bg-gold text-naija-green' : 'bg-muted-tan/10 text-muted-tan'}`}>
                {user.premiumStatus ? '👑 Master Chef Tier' : 'Casual Cook Tier'}
              </span>
              <span className="text-xs text-muted-tan font-bold italic">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-beige-line w-fit mx-auto lg:mx-0">
        <button 
          onClick={() => setActiveTab('saved')}
          className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 transition-all ${activeTab === 'saved' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'text-muted-tan hover:text-earth-dark'}`}
        >
          <Heart size={16} />
          Saved
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'text-muted-tan hover:text-earth-dark'}`}
        >
          <History size={16} />
          History
        </button>
        <button 
          onClick={() => setActiveTab('mealPlan')}
          className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 transition-all ${activeTab === 'mealPlan' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'text-muted-tan hover:text-earth-dark'}`}
        >
          <Calendar size={16} />
          Meal Plan
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'saved' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {savedRecipes.length > 0 ? (
              savedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={onSelectRecipe} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white border border-beige-line rounded-[40px]">
                <Heart size={48} className="mx-auto text-muted-tan/20 mb-4" />
                <p className="font-serif italic text-muted-tan">No favorites yet? Your palette is waiting.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="text-center py-10 text-muted-tan font-black uppercase tracking-widest text-xs">Loading records...</div>
            ) : transactions.length > 0 ? (
              transactions.map((tx, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-beige-line flex items-center justify-between group hover:border-terracotta/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-naija-green/10 flex items-center justify-center text-naija-green">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-earth-dark uppercase text-xs tracking-wider">Premium Access Activation</p>
                      <p className="text-[10px] text-muted-tan font-medium">{new Date((tx.timestamp as any)?.seconds * 1000).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-serif font-black italic text-earth-dark">₦{tx.amount.toLocaleString()}</p>
                    <p className="text-[9px] font-black text-naija-green uppercase tracking-widest">Successful</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white border border-beige-line rounded-[40px]">
                <History size={48} className="mx-auto text-muted-tan/20 mb-4" />
                <p className="font-serif italic text-muted-tan">No payment history found.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'mealPlan' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 text-center bg-white border border-beige-line rounded-[40px]"
          >
            <div className="max-w-md mx-auto">
              <Calendar size={64} className="mx-auto text-gold/30 mb-6" />
              <h3 className="text-3xl font-serif font-black italic mb-4">Personalized Meal Plans</h3>
              <p className="text-muted-tan text-sm leading-relaxed mb-8 italic">
                Our AI-powered meal architect is preparing a rotation of authentic flavors for your household.
              </p>
              <button className="btn-primary mx-auto">
                Notify Me when Ready
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
