/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from './lib/firebase';
import { RECIPIES } from './data';
import { UserProfile, Recipe as RecipeType } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LogIn, User as UserIcon, ChefHat, LayoutGrid, Heart, History, Calendar, Settings, LogOut as LogOutIcon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [currentView, setCurrentView] = useState<'explore' | 'dashboard' | 'admin'>('explore');

  // Sync Auth and Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else {
          // Create new profile
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Guest Chef',
            email: firebaseUser.email || '',
            role: 'user',
            premiumStatus: false,
            savedRecipes: [],
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, { ...newProfile, createdAt: serverTimestamp() });
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setProfile(userSnap.data() as UserProfile);
    }
  };

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => {
    signOut(auth);
    setCurrentView('explore');
  };

  const toggleSaveRecipe = async (recipeId: string) => {
    if (!user || !profile) {
      login();
      return;
    }

    const isSaved = profile.savedRecipes.includes(recipeId);
    const newSaved = isSaved 
      ? profile.savedRecipes.filter(id => id !== recipeId)
      : [...profile.savedRecipes, recipeId];

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { savedRecipes: newSaved }, { merge: true });
      setProfile({ ...profile, savedRecipes: newSaved });
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  const filteredRecipes = RECIPIES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.tribe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || r.tribe === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const selectedRecipe = RECIPIES.find(r => r.id === selectedRecipeId);

  return (
    <div className="flex h-screen bg-natural-bg overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedRecipe ? (
          <div className="flex-1 overflow-y-auto">
            <RecipeDetail 
              key="detail"
              recipe={selectedRecipe} 
              user={profile} 
              onBack={() => setSelectedRecipeId(null)}
              onRefreshUser={refreshProfile}
              onToggleSave={toggleSaveRecipe}
            />
          </div>
        ) : (
          <>
            {/* Sidebar Navigation */}
            <aside className="hidden lg:flex w-72 bg-white border-r border-beige-line flex-col overflow-y-auto">
              <div className="p-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
                    <ChefHat className="text-white w-5 h-5" />
                  </div>
                  <h1 className="text-2xl font-serif font-black text-terracotta italic leading-none">
                    NaijaFlavors
                  </h1>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-naija-green font-black ml-11">
                  Authentic Cuisine
                </p>
              </div>

              <nav className="flex-1 px-6 space-y-10">
                <div>
                  <h3 className="px-4 text-[11px] font-black uppercase text-muted-tan tracking-widest mb-4">
                    Main Menu
                  </h3>
                  <ul className="space-y-1">
                    <li 
                      onClick={() => setCurrentView('explore')}
                      className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-3 ${currentView === 'explore' ? 'bg-natural-bg text-naija-green shadow-sm' : 'text-muted-tan hover:text-earth-dark hover:bg-natural-bg/50'}`}
                    >
                      <LayoutGrid size={18} />
                      Explore
                    </li>
                    {user && (
                      <li 
                        onClick={() => setCurrentView('dashboard')}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-3 ${currentView === 'dashboard' ? 'bg-natural-bg text-naija-green shadow-sm' : 'text-muted-tan hover:text-earth-dark hover:bg-natural-bg/50'}`}
                      >
                        <UserIcon size={18} />
                        My Kitchen
                      </li>
                    )}
                    {profile?.role === 'admin' && (
                      <li 
                        onClick={() => setCurrentView('admin')}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-3 ${currentView === 'admin' ? 'bg-terracotta/10 text-terracotta shadow-sm' : 'text-muted-tan hover:text-terracotta hover:bg-terracotta/5'}`}
                      >
                        <Settings size={18} />
                        Admin Panel
                      </li>
                    )}
                  </ul>
                </div>

                {currentView === 'explore' && (
                  <div>
                    <h3 className="px-4 text-[11px] font-black uppercase text-muted-tan tracking-widest mb-4">
                      Browse by Tribe
                    </h3>
                    <ul className="space-y-1">
                      {['All', 'Yoruba', 'Igbo', 'Hausa'].map((f) => (
                        <li 
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex justify-between items-center group ${activeFilter === f ? 'bg-natural-bg text-naija-green shadow-sm' : 'hover:bg-natural-bg/50 text-muted-tan hover:text-earth-dark'}`}
                        >
                          {f}
                          <span className={`text-[10px] bg-white px-2 py-0.5 rounded-full border border-beige-line opacity-0 transition-opacity group-hover:opacity-100 ${activeFilter === f ? 'opacity-100' : ''}`}>
                            {f === 'All' ? RECIPIES.length : RECIPIES.filter(r => r.tribe === f).length}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="px-4 text-[11px] font-black uppercase text-muted-tan tracking-widest mb-4">
                    Occasions
                  </h3>
                  <ul className="space-y-1">
                    {['Owambe Specials', 'Casual Dinners', 'Festive Hits'].map((o) => (
                      <li key={o} className="px-5 py-3 hover:bg-natural-bg/50 rounded-2xl transition-all cursor-pointer text-sm font-bold text-muted-tan hover:text-earth-dark">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              <div className="p-8">
                {!profile?.premiumStatus ? (
                  <div className="bg-naija-green rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-2">Premium Access</p>
                    <p className="text-xs leading-relaxed mb-5 font-medium opacity-90 italic">
                      Unlock 500+ secret family recipes from across the continent.
                    </p>
                    <button 
                      onClick={() => setSelectedRecipeId(RECIPIES.find(r => r.isPremium)?.id || null)}
                      className="w-full bg-gold text-naija-green font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      Upgrade Now
                    </button>
                  </div>
                ) : (
                  <div className="bg-gold/10 rounded-3xl p-6 border border-gold/20">
                    <p className="text-[10px] text-gold-muted font-black uppercase tracking-widest mb-1">Premium Member</p>
                    <p className="text-sm font-serif italic text-earth-dark">Welcome, Master Chef {profile.displayName.split(' ')[0]}</p>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Top Header / Search */}
              <header className="h-20 flex-shrink-0 flex items-center justify-between px-10 bg-white/50 backdrop-blur-md border-b border-beige-line">
                <div className="relative w-full max-w-md group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-tan group-focus-within:text-terracotta transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search Jollof, Egusi, Suya..." 
                    className="w-full bg-white border border-beige-line rounded-full py-3 pl-12 pr-6 text-sm font-bold text-earth-dark focus:outline-none focus:ring-4 focus:ring-terracotta/10 transition-all placeholder:text-muted-tan/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-6">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-earth-dark leading-none">{user.displayName}</p>
                        <p className="text-[10px] text-muted-tan uppercase font-black tracking-tighter mt-1">
                          {profile?.premiumStatus ? '👑 Level 10 Chef' : 'Home Cook • Level 4'}
                        </p>
                      </div>
                      <div className="w-11 h-11 rounded-2xl bg-terracotta flex items-center justify-center text-white shadow-lg border-2 border-white cursor-pointer hover:rotate-6 transition-transform group relative">
                        <UserIcon size={20} />
                        <button 
                          onClick={(e) => { e.stopPropagation(); logout(); }}
                          className="absolute -bottom-12 right-0 bg-white border border-beige-line px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-terracotta opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all shadow-xl whitespace-nowrap flex items-center gap-2"
                        >
                          <LogOutIcon size={12} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={login} className="btn-primary">
                      <LogIn size={16} />
                      Sign In
                    </button>
                  )}
                </div>
              </header>

              {/* Scrollable Content */}
              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {currentView === 'explore' ? (
                    <motion.div 
                      key="explore"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-12"
                    >
                      {/* Hero Section */}
                      <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-72 rounded-[40px] overflow-hidden shadow-2xl group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                        <img 
                          src={RECIPIES[0].imageUrl} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          alt="Hero"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[15vw] font-serif font-black italic select-none z-0 pointer-events-none">
                          Naija
                        </div>
                        
                        <div className="relative z-20 h-full flex flex-col justify-center p-12 text-white max-w-2xl">
                          <span className="bg-gold text-naija-green text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-fit mb-5 shadow-lg">
                            Heritage Series
                          </span>
                          <h2 className="text-5xl md:text-6xl font-serif font-black mb-3 italic leading-tight">
                            {RECIPIES[0].title}
                          </h2>
                          <p className="text-sm text-white/80 font-medium leading-relaxed mb-8 max-w-md italic">
                            The smoked, savory centerpiece of every celebration. Master the art of the perfect burn.
                          </p>
                          <div className="flex items-center space-x-10 text-xs font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> {RECIPIES[0].cookingTime} mins</div>
                            <div className="flex items-center gap-2 text-gold"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> ★ 4.9 Mastery</div>
                          </div>
                        </div>
                      </motion.section>

                      {/* Recipe Grid */}
                      <section>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-1 h-8 bg-terracotta rounded-full" />
                            <h3 className="text-2xl font-serif font-black italic">Featured Delicacies</h3>
                          </div>
                          <div className="flex gap-2 lg:hidden">
                             {['Yoruba', 'Igbo', 'Hausa'].map(f => (
                               <button key={f} onClick={() => setActiveFilter(f)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl ${activeFilter === f ? 'bg-terracotta text-white' : 'bg-white border border-beige-line text-muted-tan'}`}>{f}</button>
                             ))}
                          </div>
                        </div>

                        {filteredRecipes.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredRecipes.map((recipe) => (
                              <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onClick={(id) => setSelectedRecipeId(id)} 
                                onToggleSave={toggleSaveRecipe}
                                isSaved={profile?.savedRecipes.includes(recipe.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-24 bg-white border border-beige-line rounded-[40px]">
                            <ChefHat size={48} className="mx-auto text-muted-tan/20 mb-4" />
                            <p className="font-serif italic text-muted-tan">No secret recipes found for this selection...</p>
                          </div>
                        )}
                      </section>
                    </motion.div>
                  ) : currentView === 'dashboard' && profile ? (
                    <motion.div 
                      key="dashboard"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserDashboard user={profile} onSelectRecipe={setSelectedRecipeId} />
                    </motion.div>
                  ) : currentView === 'admin' ? (
                    <motion.div 
                      key="admin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AdminDashboard />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Bottom Stats Bar */}
              <footer className="h-16 flex-shrink-0 bg-white border-t border-beige-line flex items-center px-10 justify-between">
                <div className="flex items-center space-x-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-naija-green shadow-[0_0_8px_rgba(45,79,30,0.5)]"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-tan">Saved: {profile?.savedRecipes.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_8px_rgba(194,90,60,0.5)]"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-tan">Premium: {profile?.premiumStatus ? 'Active' : 'Basic'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-tan/50">Secured by</span>
                  <div className="flex items-center gap-2 opacity-30 grayscale saturate-0">
                     <span className="font-black text-lg tracking-tighter italic">PAYSTACK</span>
                  </div>
                </div>
              </footer>
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
