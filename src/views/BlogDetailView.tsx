import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, User, Calendar, Send } from 'lucide-react';

interface BlogDetailViewProps {
  blogId: string;
  navigate: (path: string) => void;
}

export const BlogDetailView: React.FC<BlogDetailViewProps> = ({ blogId, navigate }) => {
  const { blogs, addComment, user } = useStore();

  const blog = blogs.find(b => b._id === blogId);

  if (!blog) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-red-600">Article Not Found</h2>
        <p className="text-sm text-gray-500">The blog post you're trying to view does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-2.5 bg-[#008D7F] text-white font-bold rounded-xl text-sm"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [commentText, setCommentText] = useState('');

  const blogComments = blog.comments || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commentText) {
      alert('Please fill out Name and Comment fields.');
      return;
    }

    addComment(blog._id, name, email || 'anonymous@gmail.com', commentText);
    
    // Clear comment box
    setCommentText('');
    alert('Thank you! Comment added successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 text-left">
      
      {/* Hand back button */}
      <div>
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#008D7F] transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </button>
      </div>

      {/* Main post layout */}
      <article className="space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-[#008D7F] bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            {blog.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-bold border-b border-gray-100 pb-4 pt-1">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-[#008D7F]" />
              Created by {blog.authorname || blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Published on {blog.date}
            </span>
          </div>
        </div>

        {/* Hero image banner */}
        <div className="h-64 sm:h-96 rounded-3xl overflow-hidden bg-slate-50 border border-gray-100 shadow-sm">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Post text details */}
        <div className="space-y-6 font-semibold text-sm text-gray-600 leading-relaxed pt-3">
          <p>{blog.description}</p>
          
          <div className="border-l-4 border-[#008D7F] pl-4 py-1.5 bg-teal-50/30 dark:bg-teal-950/20 rounded-r-xl">
            <p className="italic text-gray-700 dark:text-gray-300 text-sm">
              "Fine craftsmanship is an investment in durability. We design each earring and mini fan using skin-safe materials that endure seasonal aesthetics flawlessly."
            </p>
          </div>
          
          <p>
            Whether preparing for Eid al-Fitr, Puja gatherings, birthday anniversaries, or packing accessories for intense summer travel runs, ensuring your items are safe and maintained properly extends their shine and performance. Use standard lint-free microfiber wipes and airtight dry slider bags to avoid silver oxidation or motor corrosion.
          </p>
        </div>
      </article>

      {/* Comments Segment */}
      <section className="border-t border-gray-100 pt-10 space-y-8">
        <h2 className="font-display font-black text-xl text-gray-900">
          Reader Discussions ({blogComments.length})
        </h2>

        {/* Write comment card */}
        <div className="bg-slate-50 border border-gray-100 p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Add your thoughts</h3>
          
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-250/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-700"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-250/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <textarea
                required
                rows={4}
                placeholder="Write your constructive thoughts here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white border border-gray-250/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              Comment Comment
            </button>
          </form>
        </div>

        {/* Comments Board list */}
        <div className="space-y-4">
          {blogComments.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 p-8 rounded-2xl text-center text-xs text-gray-400 font-semibold select-none">
              ✨ No active comments. Share your helpful thoughts above!
            </div>
          ) : (
            blogComments.map((com, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-sm font-bold text-[#008D7F] uppercase shrink-0 select-none">
                  {com.name.charAt(0)}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800">{com.name}</p>
                    <span className="text-[10px] text-gray-400">({com.date})</span>
                  </div>
                  <p className="text-gray-500 font-semibold leading-relaxed">
                    {com.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </section>

    </div>
  );
};
