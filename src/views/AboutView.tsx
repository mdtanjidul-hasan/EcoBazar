import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

interface AboutViewProps {
  navigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate }) => {
  return (
    <div className="space-y-20 pb-20 text-left">
      
      {/* Short introduction header */}
      <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Our Brand, Our Mission
          </h1>
          <p className="text-sm text-gray-500 font-semibold leading-relaxed">
            Curating high-class lifestyle crafts, elegant hypoallergenic jewelry drop-sets, and portable cooling fans with absolute devotion.
          </p>
        </div>
      </section>

      {/* Narrative grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-display font-black text-2xl text-gray-900 leading-tight">
            The Story Behind EcoBazar Luxury Crafts
          </h2>
          <div className="space-y-4 font-semibold text-sm text-gray-600 leading-relaxed">
            <p>
              EcoBazar was established under a singular vision: to bridge the gap between high-level traditional art and modern utility design. Working hand-in-hand with local rural goldsmiths and certified material engineer consultants in Uttara, Dhaka, we create exquisite jhumkas, neckdrops, and matching jewelry combos that look premium without weight fatigue.
            </p>
            <p>
              Our operations extend to high-efficiency custom tech gadgets, primarily our summer cooling mini fans. We believe in crafting accessories that are not just elegant but durable, reducing e-waste and offering eco-sensible solutions.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3.5 bg-[#008D7F] text-white font-bold rounded-xl text-xs shadow hover:bg-[#9c1343] transition"
          >
            Sights Our Masterpieces
          </button>
        </div>

        <div className="relative flex justify-center">
          <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 rotate-1">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500"
              alt="Story banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="space-y-10">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="font-display font-black text-2xl text-gray-900">Our Core Principles</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Quality trust is our currency</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-[#008D7F]" />, title: 'Skin Safe Alloys', desc: '100% lead-free, nickel-free skin friendly alloys with long-term luster preservation.' },
            { icon: <Heart className="w-6 h-6 text-[#008D7F]" />, title: 'Artisanal Empowerment', desc: 'We return fair profits back to traditional workshop designers and workers.' },
            { icon: <Sparkles className="w-6 h-6 text-[#008D7F]" />, title: 'Aesthetic Originality', desc: 'Every model has a story. Custom designs created internally or selected by hands.' },
            { icon: <Award className="w-6 h-6 text-[#008D7F]" />, title: 'Premium Support', desc: 'No-hassle inspections on delivery. Fully guaranteed refunds within 7 calendar days.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="p-2.5 bg-teal-50/50 rounded-xl w-fit">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-sm text-gray-800">{item.title}</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
