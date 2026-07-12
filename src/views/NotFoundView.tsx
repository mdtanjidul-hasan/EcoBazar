import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowLeft, HelpCircle } from 'lucide-react';

interface NotFoundViewProps {
  navigate: (path: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ navigate }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-8 shadow-xl relative overflow-hidden"
      >
        {/* Abstract floating circles for subtle depth */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
          <HelpCircle className="w-10 h-10 animate-bounce" />
        </div>

        <h1 className="font-display text-7xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
          Page Not Found
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          The organic wholesale products or platform sourcing section you are trying to access has been harvested, relocated, or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#008D7F] to-[#00B894] hover:opacity-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-[#008D7F]/10 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-750 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Shop
          </button>
        </div>
      </motion.div>
    </div>
  );
};
