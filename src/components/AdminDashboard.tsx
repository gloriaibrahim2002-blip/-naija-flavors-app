import { useState, useEffect, FormEvent } from 'react';
import { collection, query, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, Recipe, Tribe, Occasion, Difficulty } from '../types';
import { motion } from 'motion/react';
import { BarChart3, PlusCircle, ShoppingBag, TrendingUp, Users, ChefHat, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'manage'>('analytics');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    title: '',
    tribe: 'General',
    occasion: 'Casual',
    difficulty: 'Medium',
    cookingTime: 30,
    isPremium: false,
    ingredients: [],
    instructions: [],
    imageUrl: 'https://picsum.photos/seed/naija/800/600'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = async (e: FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'recipes'), {
        ...newRecipe,
        createdAt: serverTimestamp()
      });
      alert("Heritage recipe secured in the vault!");
      setNewRecipe({
        title: '',
        tribe: 'General',
        occasion: 'Casual',
        difficulty: 'Medium',
        cookingTime: 30,
        isPremium: false,
        ingredients: [],
        instructions: [],
        imageUrl: 'https://picsum.photos/seed/naija' + Math.random() + '/800/600'
      });
    } catch (err) {
      console.error("Error adding recipe:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const successfulCount = transactions.filter(tx => tx.status === 'success').length;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1 h-8 bg-terracotta rounded-full" />
        <h2 className="text-4xl font-serif font-black italic text-earth-dark">Administrative Sanctuary</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-beige-line shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-[10px] font-black uppercase text-muted-tan tracking-widest mb-1">Total Revenue</p>
          <p className="text-3xl font-serif font-black italic text-earth-dark">₦{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-beige-line shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta mb-4">
            <ShoppingBag size={24} />
          </div>
          <p className="text-[10px] font-black uppercase text-muted-tan tracking-widest mb-1">Total Sales</p>
          <p className="text-3xl font-serif font-black italic text-earth-dark">{successfulCount}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-beige-line shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-naija-green/10 flex items-center justify-center text-naija-green mb-4">
            <Users size={24} />
          </div>
          <p className="text-[10px] font-black uppercase text-muted-tan tracking-widest mb-1">System Health</p>
          <p className="text-3xl font-serif font-black italic text-earth-dark">OPTIMAL</p>
        </div>
      </div>

      <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-beige-line w-fit">
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 transition-all ${activeTab === 'analytics' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'text-muted-tan hover:text-earth-dark'}`}
        >
          <BarChart3 size={16} />
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 transition-all ${activeTab === 'manage' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'text-muted-tan hover:text-earth-dark'}`}
        >
          <PlusCircle size={16} />
          Add Recipe
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[40px] border border-beige-line overflow-hidden shadow-sm"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-natural-bg border-b border-beige-line">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-tan">Reference</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-tan">User ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-tan">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-tan">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-tan text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-line">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-natural-bg/30 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-earth-dark font-mono uppercase">{tx.reference.slice(-8)}</td>
                    <td className="px-8 py-6 text-xs text-muted-tan font-medium">{tx.userId.slice(0, 12)}...</td>
                    <td className="px-8 py-6 text-sm font-black text-earth-dark">₦{tx.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-[10px] font-bold text-muted-tan">{new Date((tx.timestamp as any)?.seconds * 1000).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                       <span className="bg-naija-green/10 text-naija-green text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                         {tx.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="p-20 text-center text-muted-tan font-serif italic">No data records found in the vault.</div>
            )}
          </motion.div>
        )}

        {activeTab === 'manage' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] border border-beige-line p-10 md:p-16 max-w-4xl mx-auto shadow-2xl"
          >
            <h3 className="text-4xl font-serif font-black italic mb-8 border-b border-beige-line pb-8 leading-tight">Enshrine New Recipe</h3>
            
            <form onSubmit={handleAddRecipe} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-tan">Recipe Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-natural-bg border border-beige-line rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                    value={newRecipe.title}
                    onChange={e => setNewRecipe({...newRecipe, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-tan">Tribe</label>
                  <select 
                    className="w-full bg-natural-bg border border-beige-line rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                    value={newRecipe.tribe}
                    onChange={e => setNewRecipe({...newRecipe, tribe: e.target.value as Tribe})}
                  >
                    <option value="General">General</option>
                    <option value="Yoruba">Yoruba</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Hausa">Hausa</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-tan">Time (Mins)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-natural-bg border border-beige-line rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                    value={newRecipe.cookingTime}
                    onChange={e => setNewRecipe({...newRecipe, cookingTime: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-tan">Recipe Tier</label>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setNewRecipe({...newRecipe, isPremium: false})}
                      className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${!newRecipe.isPremium ? 'bg-earth-dark text-white border-earth-dark' : 'bg-transparent text-muted-tan border-beige-line'}`}
                    >
                      Casual
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNewRecipe({...newRecipe, isPremium: true})}
                      className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${newRecipe.isPremium ? 'bg-gold text-naija-green border-gold' : 'bg-transparent text-muted-tan border-beige-line'}`}
                    >
                      Premium
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-tan">Image URL</label>
                <input 
                  type="text" 
                  className="w-full bg-natural-bg border border-beige-line rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                  value={newRecipe.imageUrl}
                  onChange={e => setNewRecipe({...newRecipe, imageUrl: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={isAdding}
                className="btn-primary w-full justify-center !rounded-2xl py-5 !text-sm group"
              >
                {isAdding ? 'Securing Heritage...' : (
                  <>
                    Enshrine Recipe
                    <Check size={20} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
