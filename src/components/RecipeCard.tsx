import { motion } from 'motion/react';
import { Clock, Users, Flame, Heart } from 'lucide-react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onClick: (id: string) => void;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
  key?: string;
}

export default function RecipeCard({ recipe, onClick, onToggleSave, isSaved }: Props) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-premium cursor-pointer group relative"
      onClick={() => onClick(recipe.id)}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {onToggleSave && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(recipe.id);
            }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all backdrop-blur-md border ${isSaved ? 'bg-terracotta text-white border-terracotta' : 'bg-white/20 text-white border-white/30 hover:bg-white/40'}`}
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      {recipe.isPremium && (
        <div className="badge-premium">
          <Flame size={10} fill="currentColor" />
          Premium
        </div>
      )}

      <div className="p-5 bg-white">
        <div className="text-[10px] uppercase font-black text-terracotta tracking-[0.2em] mb-2 font-mono">
          {recipe.tribe} • {recipe.occasion}
        </div>
        <h3 className="text-xl font-serif font-black text-earth-dark mb-3 line-clamp-1 italic">
          {recipe.title}
        </h3>
        
        <div className="flex items-center justify-between text-[10px] text-muted-tan font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-naija-green opacity-50" />
            {recipe.cookingTime} mins
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-naija-green opacity-50" />
            {recipe.difficulty}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
