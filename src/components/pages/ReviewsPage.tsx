import React, { useState } from 'react';
import { Star, CheckCircle, Plus, Sparkles, MessageSquareQuote } from 'lucide-react';
import { Review } from '../../types';
import { DatabaseService } from '../../lib/database';

interface ReviewsPageProps {
  reviews: Review[];
  onOpenBooking: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ reviews, onOpenBooking }) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceName, setServiceName] = useState('Signature Precision Haircut & Styling');
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const approvedReviews = reviews.filter(r => r.is_approved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    DatabaseService.addReview({
      customer_name: name,
      customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating,
      comment,
      service_name: serviceName,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      setName('');
      setComment('');
    }, 1500);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
            Client Experiences
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#16281E]">
            Stories of Style & Solace
          </h1>
          <p className="text-sm sm:text-base text-[#657367] font-light leading-relaxed">
            Read authentic reviews from guests who trust us with their crowning glory.
          </p>
        </div>

        {/* Rating Hero Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DECf] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-5">
            <div className="font-serif text-5xl font-bold text-[#1E3527]">
              4.98
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#C6A364]">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#788C71] mt-1 font-medium">
                Based on 520+ verified Google, Yelp & Concierge reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-2.5 rounded-full border border-[#1E3527] text-[#1E3527] hover:bg-[#1E3527] hover:text-white text-xs font-semibold tracking-wide transition"
            >
              + Write a Review
            </button>
            <button
              onClick={onOpenBooking}
              className="bg-[#1E3527] hover:bg-[#14241A] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition shadow-xs"
            >
              Book an Appointment
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#E5DECf] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C6A364]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#788C71]">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#465348] font-light leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center font-bold text-xs">
                    {rev.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-[#16281E]">{rev.customer_name}</h4>
                    <span className="text-[10px] text-[#788C71]">{rev.service_name}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#E8E1D2] shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#788C71]">Share Your Voice</span>
                <h3 className="font-serif text-xl font-semibold text-[#16281E]">Write a Review</h3>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-[#6F7D71] hover:text-[#16281E]">✕</button>
            </div>

            {submittedSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-semibold text-[#16281E]">Thank You!</h4>
                <p className="text-xs text-[#6F7D71]">Your testimonial has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Your Name *</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Charlotte DuPont"
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg text-lg ${rating >= star ? 'text-[#C6A364]' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-[#788C71] font-semibold">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Service Received</label>
                  <input
                    value={serviceName}
                    onChange={e => setServiceName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Your Feedback *</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe your haircut, color, or spa experience..."
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#D5CDC0] text-[#4A574C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#1E3527] text-white font-semibold shadow-xs"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
