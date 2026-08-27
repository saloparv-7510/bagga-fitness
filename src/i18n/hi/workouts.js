/* Hindi mirror for src/data/workouts.js. Shape consumed by useWorkouts():
   {
     levels: { [id]: { label, blurb, cardio } },  // beginner/intermediate/experienced
     week: [
       { day, focus, beginner: string[], intermediate: string[], experienced: string[] },
       // by index (Mon..Sun); rest[] uses the same three level arrays.
     ],
   }
   Set/rep tails ("3×10", "4×8") stay in the English arrays; translate the
   movement name around them. accent/icon/rest stay English. */
export default {
  levels: {
    beginner: {
      label: "शुरुआती",
      blurb: "0–6 महीने की ट्रेनिंग। मूवमेंट पैटर्न और ताक़त का बेस बनाएँ, वॉल्यूम आसान रखें।",
      cardio: "15–20 मिनट आसान कार्डियो, हफ़्ते में 3×",
    },
    intermediate: {
      label: "मध्यम",
      blurb: "6–24 महीने की ट्रेनिंग। ज़्यादा वॉल्यूम और इंटेंसिटी, कमज़ोर पॉइंट्स सुधारने के लिए एक्सेसरी वर्क।",
      cardio: "20–25 मिनट कंडीशनिंग, हफ़्ते में 3–4×",
    },
    experienced: {
      label: "अनुभवी",
      blurb: "2+ साल की ट्रेनिंग। हाई वॉल्यूम, हेवी कंपाउंड लिफ्ट्स और एडवांस लिफ्टर्स के लिए इंटेंसिटी टेक्नीक्स।",
      cardio: "टारगेटेड कंडीशनिंग + रोज़ाना 8k स्टेप्स",
    },
  },
  week: [
    { day: "सोमवार", focus: "छाती + ट्राइसेप्स" },
    { day: "मंगलवार", focus: "पीठ + बाइसेप्स" },
    { day: "बुधवार", focus: "पैर + काफ्स" },
    { day: "गुरुवार", focus: "कंधे + एब्स" },
    { day: "शुक्रवार", focus: "छाती + पीठ" },
    { day: "शनिवार", focus: "बाहें + फुल-बॉडी कंडीशनिंग" },
    { day: "रविवार", focus: "आराम + रिकवरी + हल्की स्ट्रेचिंग" },
  ],
}
