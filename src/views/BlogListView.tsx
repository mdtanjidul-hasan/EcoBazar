import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Blog } from '../types';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';

interface BlogListViewProps {
  navigate: (path: string) => void;
}

export const BlogListView: React.FC<BlogListViewProps> = ({ navigate }) => {
  const { blogs } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Gadget', 'Jewellery'];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          b.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Editorial space head banner */}
      <section className="bg-[#ebf3f2] p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] bg-[#008d7f1c] text-[#008D7F] px-3 py-1 font-extrabold uppercase rounded-full">
            EcoBazar Editorials
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900">
            Handcrafted Journals & Tech Guides
          </h1>
          <p className="text-sm text-gray-500 font-semibold leading-relaxed">
            Discover tips to clean silver jewelry, style earrings for festive gatherings, or maintain rechargeable battery-powered fans during intense summers.
          </p>
        </div>
      </section>

      {/* Filter toolbar */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category filters */}
        <div className="flex gap-2.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition duration-150 ${
                  isSel 
                    ? 'bg-[#008D7F] text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
          />
        </div>

      </section>

      {/* Stories list */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 max-w-sm mx-auto">
            <span className="text-4xl">💭</span>
            <h3 className="font-display font-bold text-lg text-gray-900">No Stories Found</h3>
            <p className="text-sm text-gray-400 font-semibold">We couldn't locate editorial match for "{search}".</p>
          </div>
        ) : (
          filteredBlogs.map((b) => (
            <div
              key={b._id}
              onClick={() => navigate(`/single-blog/${b._id}`)}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col cursor-pointer group"
            >
              <div className="h-52 overflow-hidden bg-slate-50 relative">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#008D7F] bg-teal-50 px-2 py-0.5 rounded uppercase">
                    {b.category}
                  </span>
                  <h3 className="font-display font-black text-base text-gray-900 line-clamp-2 group-hover:text-[#008D7F] transition">
                    {b.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 font-semibold leading-relaxed flex-1">
                  {b.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50 font-bold mt-auto">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#008D7F]" />
                    {b.authorname || b.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {b.date}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

    </div>
  );
};
