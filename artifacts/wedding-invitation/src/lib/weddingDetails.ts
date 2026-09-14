export const weddingDetails = {
  brideName: "Juhi",
  groomName: "Shubhojit",
  date: "1st March 2027",
  dateISO: "2027-03-01T09:00:00+05:30",
  shloka: "|| वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||",
  events: [
    { name: "Haldi", time: "9:00 AM", date: "Feb 28", day: "Sunday", location: "Hotel Miracle, Ujjain" },
    { name: "Sangeet", time: "7:00 PM", date: "Feb 28", day: "Sunday", location: "Hotel Miracle, Ujjain" },
    { name: "Wedding Ceremony", time: "10:45 AM", date: "Mar 1", day: "Monday", location: "Hotel Miracle, Ujjain" },
    { name: "Reception", time: "7:00 PM", date: "Mar 1", day: "Monday", location: "Hotel Miracle, Ujjain" },
  ],
  venue: "Hotel Miracle",
  venueAddress: "48, Kirti Nagar, Ujjain, Sawara Khedi, Madhya Pradesh 456010",
  mapsLink: "https://maps.app.goo.gl/erat7fh2pZ3hRwf16",
  // Couple's WhatsApp number in international format, digits only (country code + number)
  whatsappNumber: "918269726165",
  // Google Form used as the silent RSVP backend.
  // formId is the long ID from the form's public URL:
  //   https://docs.google.com/forms/d/e/<formId>/viewform
  // entries maps each of our fields to the Google Form's entry.<id> field names.
  //
  // ⚠️ FRAGILE COUPLING: field IDs and option strings below must match the live
  // Google Form EXACTLY, or RSVPs fail silently (guests still see "Thank you").
  // After ANY edit to the Google Form, run `pnpm run check:rsvp-form` in this
  // package and see RSVP_FORM_GUIDE.md for the full end-to-end test.
  rsvpForm: {
    formId: "1FAIpQLScfL4cMGt3PpLXzeGUKTEO-TEkgjEXpd7qtvWhghrzGnl0L8A",
    entries: {
      attending: "entry.877086558",
      name: "entry.1498135098",
      guests: "entry.896143977",
      events: "entry.2068387429",
      contact: "entry.2606285",
    },
    // Values must match the Google Form's options exactly
    attendingOptions: {
      yes: "Yes,  with pleasure",
      no: "Regretfully, no",
    },
    guestOptions: ["1", "2", "3", "4", "5+"],
    eventOptions: ["All events", "Wedding Ceremony only", "Reception Only"],
  },
  // Couple photo gallery. Add image paths (e.g. "images/gallery/photo-1.webp",
  // relative to public/) as the couple supplies photos; empty slots render as
  // tasteful placeholder frames.
  galleryPhotos: [] as { src: string; alt: string }[],
  closingMessage: "Surrounded by family and friends, we can't wait to celebrate this beautiful moment with you.",
  closingRegards: "Mr Sandeep Mehendale & Mrs Kalpana Mehendale",
};
