import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChefHat, Utensils, Info, CheckCircle2, Heart } from 'lucide-react';
import { Recipe, UserProfile } from '../types';
import PaystackIntegration from './PaystackIntegration';

interface Props {
  recipe: Recipe;
  user: UserProfile | null;
  onBack: () => void;
  onRefreshUser: () => void;
  onToggleSave?: (id: string) => void;
  key?: string; // Add optional key for React internal consumption context if needed
}

export default function RecipeDetail({ recipe, user, onBack, onRefreshUser, onToggleSave }: Props) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const isLocked = recipe.isPremium && !user?.premiumStatus;
  const isSaved = user?.savedRecipes.includes(recipe.id);

  return (
    <div className="min-h-screen bg-natural-bg">
      {/* Hero Header */}
      <div className="relative h-[45vh] md:h-[55vh]">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-natural-bg via-transparent to-black/20" />
        
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-2xl"
          >
            <ArrowLeft />
          </button>
          
          {onToggleSave && (
            <button 
              onClick={() => onToggleSave(recipe.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all backdrop-blur-xl border ${isSaved ? 'bg-terracotta text-white border-terracotta' : 'bg-white/20 text-white border-white/30 hover:bg-white/40'}`}
            >
              <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="bg-white rounded-[48px] p-10 md:p-16 shadow-2xl border border-beige-line">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-12 border-b border-beige-line pb-12">
            <div className="space-y-4">
              <div className="text-[11px] uppercase font-black text-terracotta tracking-[0.3em] font-mono">
                {recipe.tribe} Heritage • {recipe.occasion}
              </div>
              <h1 className="text-4xl md:text-7xl font-serif font-black text-earth-dark italic leading-[0.85]">
                {recipe.title}
              </h1>
            </div>
            
            <div className="flex gap-8">
              <div className="text-right">
                <div className="text-[10px] text-muted-tan font-black uppercase tracking-widest mb-2">Prep Time</div>
                <div className="text-lg font-serif font-black italic text-terracotta">{recipe.cookingTime} mins</div>
              </div>
              <div className="text-right border-l border-beige-line pl-8">
                <div className="text-[10px] text-muted-tan font-black uppercase tracking-widest mb-2">Complexity</div>
                <div className="text-lg font-serif font-black italic text-terracotta">{recipe.difficulty}</div>
              </div>
            </div>
          </div>

          {!isLocked ? (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-10">
                <button 
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${activeTab === 'ingredients' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'bg-natural-bg text-muted-tan hover:text-earth-dark'}`}
                >
                  <Utensils size={16} />
                  Ingredients
                </button>
                <button 
                  onClick={() => setActiveTab('instructions')}
                  className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${activeTab === 'instructions' ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' : 'bg-natural-bg text-muted-tan hover:text-earth-dark'}`}
                >
                  <ChefHat size={16} />
                  Process
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'ingredients' ? (
                  <motion.div 
                    key="ingredients"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {recipe.ingredients.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-natural-bg/50 border border-beige-line rounded-[24px] group hover:bg-white hover:shadow-md transition-all">
                        <div className="w-6 h-6 rounded-full bg-white border border-beige-line flex items-center justify-center text-naija-green group-hover:bg-naija-green group-hover:text-white transition-colors">
                          <CheckCircle2 size={12} />
                        </div>
                        <span className="text-sm font-bold text-earth-dark/80">{item}</span>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="instructions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    {recipe.instructions.map((step, i) => (
                      <div key={i} className="flex gap-10 group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-beige-line bg-white flex items-center justify-center text-terracotta font-serif font-black text-xl italic group-hover:bg-terracotta group-hover:text-white group-hover:border-terracotta transition-all">
                          {i + 1}
                        </div>
                        <p className="text-earth-dark/70 leading-[1.8] pt-2 text-lg font-medium italic">
                          {step}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <PaystackIntegration user={user!} onSuccess={onRefreshUser} />
          )}

          <div className="mt-20 p-10 bg-gold/5 rounded-[32px] flex gap-6 items-center border border-gold/10">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold-muted shrink-0">
               <Info size={24} />
            </div>
            <p className="text-sm text-gold-muted italic leading-relaxed font-medium">
              Chef's Heritage Note: Nigerian food is all about patience. For {recipe.title}, ensure you don't rush the frying stage of the pepper base to avoid a slap-dash taste. The secret is in the simmer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
