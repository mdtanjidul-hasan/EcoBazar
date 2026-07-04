import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields marked with *');
      return;
    }
    alert(`Thank you, ${name}! Your helpful feedback has been delivered securely to the EcoBazar support queue. We will check it under 12 hours.`);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-16 pb-20 text-left">
      
      {/* Intro block */}
      <section className="bg-[#ebf3f2] dark:bg-zinc-900 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-transparent dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Contact Support & Enquiries
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 font-semibold leading-relaxed">
            Have questions regarding boutique custom jewelry, wholesale earring combos, or custom battery support for mini fans? Reach out now.
          </p>
        </div>
      </section>

      {/* Grid container */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-gray-50 pb-4">
            <h2 className="font-display font-bold text-lg text-gray-900">Send an Enquiry</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">We will respond with full detail within 12 standard business hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  placeholder="e.g. Anika Kabir"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  placeholder="e.g. anika@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject Reference</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                placeholder="e.g. Wholesale custom combo bulk orders"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message details *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                placeholder="Write your comments, order-enquiry, or complaints..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Enquiry Message
            </button>
          </form>

        </div>

        {/* Right column coordinates */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#0b1b1a] text-gray-300 p-6 md:p-8 rounded-3xl space-y-6 shadow">
            <h3 className="font-display font-bold text-lg text-white border-b border-[#1e3432] pb-3">Corporate Coordinates</h3>
            
            <ul className="space-y-5 text-xs font-semibold leading-relaxed">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold mb-0.5">Principal Showroom</p>
                  <span>Sector 11, Uttara, Dhaka-1230, Bangladesh</span>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold mb-0.5">Assistance Hotline</p>
                  <span>+880 1712-345678 (10AM to 8PM BDT)</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold mb-0.5">Inquiry Email</p>
                  <span>strategyconsumer2026@gmail.com</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Clean Map Placeholder - Perfectly aligns with the original's google map embed */}
          <div className="h-64 rounded-3xl border border-gray-100 overflow-hidden shadow-inner grayscale contrast-110 relative bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d14592.571408845013!2d90.3804561!3d23.8828941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c46b1479831f%3A0xe7268d8ef53b2ce2!2sUttara%20Sector%2011%2C%20Dhaka%201230!5e0!3m2!1sen!2sbd!4v1718220000000!5m2!1sen!2sbd"
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </section>

    </div>
  );
};
