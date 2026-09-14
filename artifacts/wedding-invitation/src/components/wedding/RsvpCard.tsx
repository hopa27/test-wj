import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingDetails } from '../../lib/weddingDetails';
import { OrnamentalDivider } from './OrnamentalDivider';
import { Mandala } from './Mandala';

const STORAGE_KEY = 'wedding-rsvp-submitted';

const rsvp = weddingDetails.rsvpForm;
const GUEST_OPTIONS = rsvp.guestOptions;
const EVENT_OPTIONS = rsvp.eventOptions;

type RsvpData = {
  name: string;
  attending: string; // exact Google Form option value
  guests: string;
  event: string;
  contact: string;
};

async function submitToGoogleForm(data: RsvpData) {
  const params = new URLSearchParams();
  params.append(rsvp.entries.name, data.name);
  params.append(rsvp.entries.attending, data.attending);
  params.append(rsvp.entries.guests, data.guests);
  params.append(rsvp.entries.events, data.event);
  params.append(rsvp.entries.contact, data.contact);

  await fetch(`https://docs.google.com/forms/d/e/${rsvp.formId}/formResponse`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
}

const inputClass =
  'w-full rounded-lg border border-[#D4AF37]/40 bg-white/70 px-4 py-3 font-sans text-[#4a0d10] placeholder:text-[#4a0d10]/35 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/60 transition';

export function RsvpCard() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState('');
  const [guests, setGuests] = useState('1');
  const [event, setEvent] = useState(EVENT_OPTIONS[0]);
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubmitted(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please tell us your full name.');
      return;
    }
    if (!attending) {
      setError('Please let us know if you can join us.');
      return;
    }
    if (!contact.trim()) {
      setError('Please share a contact number.');
      return;
    }
    setSubmitting(true);
    try {
      await submitToGoogleForm({
        name: name.trim(),
        attending,
        guests,
        event,
        contact: contact.trim(),
      });
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ name: name.trim(), at: Date.now() }),
        );
      } catch {
        /* ignore */
      }
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
       className="pt-8 pb-24 px-6 relative overflow-hidden bg-[#FBF6EF]"
    >
      {/* Subtle gold wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 45%, transparent 75%)',
        }}
      />
      {/* Continuation of the Timeline section's bottom-left mandala across the seam */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-20" aria-hidden>
        <Mandala variant="full" className="w-[420px]" />
      </div>
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 pointer-events-none opacity-20">
        <Mandala variant="full" className="w-[420px]" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative text-center border border-accent/30 px-4 py-8 md:px-6 md:py-12 rounded-2xl bg-card/60 backdrop-blur-sm shadow-xl"
        >
          {/* Corner flourishes matching the venue card */}
          {[
            'top-3 left-3',
            'top-3 right-3 rotate-90',
            'bottom-3 right-3 rotate-180',
            'bottom-3 left-3 -rotate-90',
          ].map((pos) => (
            <svg
              key={pos}
              viewBox="0 0 60 60"
              className={`absolute ${pos} w-12 h-12 text-accent/60 pointer-events-none`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M2 30 C2 14 14 2 30 2" />
              <path d="M8 30 C8 17.8 17.8 8 30 8" opacity="0.55" />
              <path d="M14 30 C14 21.2 21.2 14 30 14" opacity="0.35" />
              <circle cx="2" cy="30" r="1.8" fill="currentColor" stroke="none" />
              <circle cx="30" cy="2" r="1.8" fill="currentColor" stroke="none" />
              <path d="M17 17 l3.2 3.2 M17 17 l4.5 -1 M17 17 l-1 4.5" opacity="0.6" />
              <circle cx="17" cy="17" r="2.4" opacity="0.8" />
              <circle cx="17" cy="17" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          ))}

          <p className="font-serif tracking-[0.25em] text-[#B31217] text-xs uppercase mb-3">
            Kindly Respond
          </p>
          <h2 className="font-display text-4xl text-[#4a0d10] mb-4">RSVP</h2>

          <OrnamentalDivider className="w-[160px] mx-auto text-[#D4AF37]/70 mb-6" />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#B31217]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <h3 className="font-display text-2xl text-[#4a0d10] mb-3">
                   Thank you!
                </h3>
                <p className="font-sans text-[#4a0d10]/75 leading-relaxed max-w-sm mx-auto">
                  Your response has been received. We can't wait to celebrate
                  with you in Ujjain!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.removeItem(STORAGE_KEY);
                    } catch {
                      /* ignore */
                    }
                    setName('');
                    setAttending('');
                    setGuests('1');
                    setEvent(EVENT_OPTIONS[0]);
                    setContact('');
                    setSubmitted(false);
                  }}
                  className="mt-6 font-sans text-sm text-[#4a0d10]/50 underline underline-offset-4 hover:text-[#B31217] transition-colors"
                >
                  RSVP for someone else
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -10 }}
                className="text-left space-y-5"
              >
                <p className="font-sans text-[#4a0d10]/75 leading-relaxed text-center mb-6">
                  Your presence would mean the world to us. Kindly fill in the
                  details below — we'd love to save you a seat.
                </p>

                <div>
                  <label className="block font-serif text-sm text-[#4a0d10]/80 mb-1.5">
                    Your Full name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className={inputClass}
                    maxLength={80}
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm text-[#4a0d10]/80 mb-1.5">
                    Will you be able to grace the occasion?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: rsvp.attendingOptions.yes, label: 'Yes, with pleasure' },
                      { value: rsvp.attendingOptions.no, label: 'Regretfully, no' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAttending(opt.value)}
                        className={`rounded-lg border px-3 py-3 font-sans text-sm transition motion-safe:active:scale-[0.97] ${
                          attending === opt.value
                            ? 'border-[#B31217] bg-[#B31217]/10 text-[#B31217] font-semibold'
                            : 'border-[#D4AF37]/40 bg-white/70 text-[#4a0d10]/70 hover:border-[#D4AF37]/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-serif text-sm text-[#4a0d10]/80 mb-1.5">
                    Contact Number:
                  </label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Contact number"
                    className={inputClass}
                    maxLength={20}
                  />
                </div>

                <div>
                      <label className="block font-serif text-sm text-[#4a0d10]/80 mb-1.5">
                        Number of guests from your side
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className={inputClass}
                      >
                        {GUEST_OPTIONS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                </div>

                <div>
                      <label className="block font-serif text-sm text-[#4a0d10]/80 mb-1.5">
                        Which समारोह will you be attending?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {EVENT_OPTIONS.map((ev) => {
                          const active = event === ev;
                          return (
                            <button
                              key={ev}
                              type="button"
                              onClick={() => setEvent(ev)}
                              className={`rounded-full border px-4 py-2 font-sans text-sm transition motion-safe:active:scale-[0.96] ${
                                active
                                  ? 'border-[#B31217] bg-[#B31217]/10 text-[#B31217] font-medium'
                                  : 'border-[#D4AF37]/40 bg-white/60 text-[#4a0d10]/60 hover:border-[#D4AF37]/70'
                              }`}
                            >
                              {ev}
                            </button>
                          );
                        })}
                      </div>
                </div>

                {error && (
                  <p className="font-sans text-sm text-[#B31217] text-center">{error}</p>
                )}

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-[#B31217] px-10 py-4 font-sans font-semibold text-white shadow-[0_6px_20px_rgba(179,18,23,0.35)] transition-transform motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {submitting ? 'Sending…' : 'Send RSVP'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
