/* Hindi translations for hardcoded chrome strings — headings, buttons, labels,
   form text, loading/error copy, aria-labels — keyed by the EXACT English source
   string passed to t() at the call site.

   Missing keys fall back to English (see LanguageProvider), so this map can be
   filled incrementally and a missing entry degrades to English rather than
   breaking anything. English is the key, so the English literal always stays
   visible in the component and can never silently drift.

   Interpolation tokens ({year}, {area}, …) must be preserved verbatim in the
   Hindi value; they are substituted after lookup.

   Some keys are deliberately sentence FRAGMENTS: the call site interleaves a
   bold number or a link between them (BMI out-of-range, the protein per-meal
   line, the footer "Built with ♥ for …", the Feedback email fallback). Those
   values are written so the assembled Hindi sentence still reads correctly —
   do not "fix" them in isolation.

   Values kept identical to the key on purpose: brand and platform names
   (BAGGA FITNESS, WhatsApp, Instagram, YouTube) and the unit "cm".

   A value may be an OBJECT when one English word needs two Hindi words
   depending on where it is used: `default` is the normal sense and the other
   keys are matched against t()'s third `ctx` argument. */
export default {
  /* ------------------------------------------------------------------
     Chrome literals, in the order the extractor reports them.
     ------------------------------------------------------------------ */
  " (today)": " (आज)",
  "(about 3 ft 11 in – 7 ft 7 in) and a weight of": "(करीब 3 ft 11 in – 7 ft 7 in) के बीच रखें, और वज़न",
  "A Serious Floor Built For": "एक सीरियस फ़्लोर, जो देता है",
  // The Gym tab's screen label (default) vs the BMI "About 4 kg to lose" prefix.
  "About": { default: "परिचय", bmi: "करीब" },
  "About The Gym": "जिम के बारे में",
  "About: {area}": "किस बारे में: {area}",
  "Actually Coaches": "सचमुच कोचिंग करती है",
  "Actually Help": "सचमुच काम करते हैं",
  "Aim For": "लक्ष्य",
  "An honest breakdown — what each one does, who it is for and how to use it. Food first, always.":
    "ईमानदार जानकारी — कौन क्या करता है, किसके लिए है और कैसे लेना है। खाना हमेशा पहले।",
  "Ask On WhatsApp": "WhatsApp पर पूछें",
  "Ask Today's Timings": "आज का समय पूछें",
  "Ask about the {plan} plan on WhatsApp": "WhatsApp पर {plan} प्लान के बारे में पूछें",
  "Ask on WhatsApp about training with the {role}": "WhatsApp पर {role} के साथ ट्रेनिंग के बारे में पूछें",
  "Ask on WhatsApp about training with {name}": "WhatsApp पर {name} के साथ ट्रेनिंग के बारे में पूछें",
  "BAGGA FITNESS is a strength-first gym in Prahladpur. No gimmicks — proper equipment, hands-on coaching and a plan matched to your level, whether it is day one or year ten.":
    "BAGGA FITNESS प्रह्लादपुर का एक स्ट्रेंथ-फ़र्स्ट जिम है। कोई दिखावा नहीं — सही इक्विपमेंट, साथ खड़े होकर कोचिंग, और आपके लेवल के हिसाब से बना प्लान — चाहे यह आपका पहला दिन हो या दसवाँ साल।",
  "BAGGA FITNESS location map": "BAGGA FITNESS का लोकेशन मैप",
  "BAGGA FITNESS on Instagram — @{handle}": "Instagram पर BAGGA FITNESS — @{handle}",
  "BAGGA FITNESS on YouTube — @{handle}": "YouTube पर BAGGA FITNESS — @{handle}",
  "BMI & Ideal": "BMI और आदर्श",
  "Be as specific as you like — details make it fixable.":
    "जितना खुलकर लिखना चाहें लिखें — ब्यौरे से ही चीज़ें ठीक हो पाती हैं।",
  "Best Body": "बेस्ट बॉडी",
  "Best Value": "सबसे फ़ायदेमंद",
  "Best for: ": "किसके लिए: ",
  "Bodyweight": "बॉडीवेट",
  "Bodyweight in kilograms": "किलोग्राम में बॉडीवेट",
  "Bodyweight in kilograms, exact value": "किलोग्राम में बॉडीवेट, सही मान",
  "Breathing: ": "साँस: ",
  "Build Muscle": "मसल बनाना",
  "Build Your": "बनाइए अपनी",
  "Built with": "बनाया गया",
  "Calculator": "कैलकुलेटर",
  "Calendar": "कैलेंडर",
  "Call BAGGA FITNESS on {phone}": "{phone} पर BAGGA FITNESS को कॉल करें",
  "Call us, message us, or come and see the place for yourself. Your first session is the hardest — after that, it's momentum.":
    "हमें कॉल करें, मैसेज करें, या खुद आकर जगह देख लें। सबसे मुश्किल आपका पहला सेशन होता है — उसके बाद रफ़्तार अपने आप बनती है।",
  "Close gallery viewer": "गैलरी व्यूअर बंद करें",
  "Close menu": "मेन्यू बंद करें",
  "Close {name}": "{name} बंद करें",
  "Coach tip: ": "कोच की सलाह: ",
  "Coaches": "कोच",
  "Coaching That": "कोचिंग जो",
  "Come Train At": "आकर ट्रेनिंग कीजिए",
  "Common": "आम",
  "Common mistakes to avoid": "जो आम गलतियाँ नहीं करनी हैं",
  "Conditioning: {cardio}": "कंडीशनिंग: {cardio}",
  "Contact": "संपर्क",
  "Contact Us": "हमसे संपर्क करें",
  "Contact: {phone}": "संपर्क: {phone}",
  "Copied": "कॉपी हो गया",
  "Copy Text": "टेक्स्ट कॉपी करें",
  "Current Weight (kg)": "मौजूदा वज़न (kg)",
  "Current weight in kilograms": "किलोग्राम में मौजूदा वज़न",
  "Daily Protein": "रोज़ का प्रोटीन",
  "Dismiss the {day} closure notice": "{day} की छुट्टी की सूचना हटाएँ",
  "Eat For Strength": "ताक़त के लिए खाइए",
  "Email": "ईमेल",
  "Email and YouTube are not set up yet — call or message us on WhatsApp instead.":
    "ईमेल और YouTube अभी सेट नहीं हैं — इसकी जगह हमें कॉल करें या WhatsApp पर मैसेज करें।",
  "Enter a realistic bodyweight ({min}–{max} kg) to see your target.":
    "अपना टारगेट देखने के लिए सही बॉडीवेट ({min}–{max} kg) डालें।",
  "Enter your details to see your BMI, a healthy weight range and an ideal-weight estimate for your height and gender.":
    "अपनी जानकारी भरें और देखें अपना BMI, हेल्दी वज़न की रेंज, और अपनी ऊँचाई और जेंडर के हिसाब से आदर्श वज़न का अंदाज़ा।",
  "Estimates only. Ideal weight ranges vary with muscle mass and frame and do not replace professional medical advice.":
    "ये सिर्फ़ अंदाज़े हैं। आदर्श वज़न की रेंज मसल मास और शरीर की बनावट के साथ बदलती है, और यह डॉक्टरी सलाह की जगह नहीं लेती।",
  "Every member gets form checks and a plan — not just a keycard and a treadmill.":
    "हर मेंबर को फॉर्म चेक और एक प्लान मिलता है — सिर्फ़ एक कीकार्ड और ट्रेडमिल नहीं।",
  "Exactly what gets sent": "जो भेजा जाएगा, हूबहू यही",
  "Exercise Guide": "एक्सरसाइज़ गाइड",
  "Explore": "देखें",
  "Explore Workout Plans": "वर्कआउट प्लान देखें",
  "Fat Loss": "फैट लॉस",
  "Feedback, Complaints &": "फीडबैक, शिकायतें और",
  "Fill in your gender, height and a realistic weight to see your BMI and healthy range.":
    "अपना BMI और हेल्दी रेंज देखने के लिए जेंडर, ऊँचाई और सही वज़न भरें।",
  "Filter exercises by body part": "बॉडी पार्ट से एक्सरसाइज़ छाँटें",
  "Filter foods by category": "कैटेगरी से फूड्स छाँटें",
  "Follow": "फ़ॉलो करें",
  "Foods": "फूड्स",
  "Forge strength like thunder and power like a titan. Real coaching and a plan built for your level — from your first rep to your heaviest lift.":
    "बिजली जैसी ताक़त और टाइटन जैसी पावर बनाइए। असली कोचिंग और आपके लेवल के लिए बना प्लान — आपके पहले रेप से आपकी सबसे भारी लिफ्ट तक।",
  "Forge strength like thunder and power like a titan. Real coaching, a serious iron floor and a plan built for your level — from your very first rep to your heaviest lift.":
    "बिजली जैसी ताक़त और टाइटन जैसी पावर बनाइए। असली कोचिंग, एक सीरियस आयरन फ़्लोर और आपके लेवल के लिए बना प्लान — आपके सबसे पहले रेप से आपकी सबसे भारी लिफ्ट तक।",
  "From: {name}": "भेजने वाला: {name}",
  "Fuel The Machine": "मशीन को ईंधन दीजिए",
  "Gallery": "गैलरी",
  "Gender": "जेंडर",
  "General Fitness": "जनरल फ़िटनेस",
  "General technique guidance for healthy adults — it does not replace coaching or medical advice. If a movement hurts, stop and ask a coach on the floor.":
    "सेहतमंद बड़ों के लिए आम टेक्नीक गाइडेंस — यह कोचिंग या डॉक्टरी सलाह की जगह नहीं लेती। अगर किसी मूवमेंट में दर्द हो तो रुक जाएँ और फ़्लोर पर कोच से पूछें।",
  "Get Directions": "रास्ता देखें",
  "Goal: {goal}.": "गोल: {goal}।",
  "Greats": "दिग्गज",
  "Healthy Range": "हेल्दी रेंज",
  "Height": "ऊँचाई",
  "Height feet": "ऊँचाई — फ़ीट",
  "Height in centimetres": "सेंटीमीटर में ऊँचाई",
  "Height inches": "ऊँचाई — इंच",
  "Height unit": "ऊँचाई की यूनिट",
  "Hello BAGGA FITNESS, I am interested in joining the {duration} plan. Please provide more information.":
    "नमस्ते BAGGA FITNESS, मुझे {duration} वाला प्लान लेने में दिलचस्पी है। कृपया इसके बारे में और जानकारी दें।",
  "Hello BAGGA FITNESS, I am {name} ({phone}).": "नमस्ते BAGGA FITNESS, मैं {name} ({phone})।",
  "Hello BAGGA FITNESS, I would like to know more about the {duration} plan ({price}) — timings, facilities and current offers.":
    "नमस्ते BAGGA FITNESS, मुझे {duration} वाले प्लान ({price}) के बारे में और जानना है — समय, सुविधाएँ और मौजूदा ऑफ़र।",
  "Hello BAGGA FITNESS, I would like to know more about your gym memberships and timings. Please provide more information.":
    "नमस्ते BAGGA FITNESS, मुझे आपकी जिम मेंबरशिप और समय के बारे में और जानना है। कृपया और जानकारी दें।",
  "Hello BAGGA FITNESS, I would like to train with your {role} — the coach listed on your site as \"{name}\". Please tell me about availability and how to start.":
    "नमस्ते BAGGA FITNESS, मुझे आपके {role} के साथ ट्रेनिंग करनी है — जिन्हें आपकी साइट पर \"{name}\" लिखा गया है। कृपया बताएँ कि वे कब उपलब्ध हैं और शुरू कैसे करना है।",
  "Hello BAGGA FITNESS, I would like to train with {name} ({role}). Please tell me about availability and how to start.":
    "नमस्ते BAGGA FITNESS, मुझे {name} ({role}) के साथ ट्रेनिंग करनी है। कृपया बताएँ कि वे कब उपलब्ध हैं और शुरू कैसे करना है।",
  "Hello BAGGA FITNESS, part of your website did not load for me. Could you send me the details directly?":
    "नमस्ते BAGGA FITNESS, आपकी वेबसाइट का एक हिस्सा मेरे यहाँ लोड नहीं हुआ। क्या आप मुझे जानकारी सीधे भेज सकते हैं?",
  "High-Protein": "हाई-प्रोटीन",
  "How It Works": "यह कैसे चलता है",
  "How each coach runs a session, and who it suits. The portraits are illustrations, not photographs.":
    "हर कोच सेशन कैसे चलाता है, और किसे सूट करता है। ये तस्वीरें इलस्ट्रेशन हैं, फ़ोटो नहीं।",
  "How to perform": "कैसे करें",
  "How: ": "कैसे: ",
  "Ideal Estimate": "आदर्श अंदाज़ा",
  "Illustrated persona": "इलस्ट्रेटेड पर्सोना",
  "Important: ": "ज़रूरी: ",
  "Inside The Gym": "जिम के अंदर",
  "Instagram": "Instagram",
  "It is sent from your own WhatsApp account, so the gym sees your number and profile name. If you would rather not be identified, call {phone} instead and say so.":
    "यह आपके ही WhatsApp अकाउंट से जाता है, तो जिम को आपका नंबर और प्रोफ़ाइल नाम दिखेगा। अगर आप अपनी पहचान नहीं बताना चाहते, तो इसकी जगह {phone} पर कॉल करके यह बात कह दें।",
  "Join BAGGA FITNESS": "BAGGA FITNESS जॉइन करें",
  "Join Now": "अभी जॉइन करें",
  "Join the {plan} plan on WhatsApp": "WhatsApp पर {plan} प्लान जॉइन करें",
  "Know Your Numbers": "अपने नंबर जानिए",
  "Language": "भाषा",
  "Legend Protocols": "लेजेंड प्रोटोकॉल",
  "Light stretching and sleep. Recovery is training.": "हल्की स्ट्रेचिंग और नींद। रिकवरी भी ट्रेनिंग है।",
  "Main": "मुख्य",
  "Meet Your": "मिलिए अपने",
  "Meet them in the Trainers section.": "उनसे ट्रेनर सेक्शन में मिलिए।",
  "Membership": "मेंबरशिप",
  "Message": "मैसेज",
  "Message BAGGA FITNESS on WhatsApp": "WhatsApp पर BAGGA FITNESS को मैसेज करें",
  "Message BAGGA FITNESS on WhatsApp about {day} and the week ahead":
    "WhatsApp पर BAGGA FITNESS को {day} और आने वाले हफ़्ते के बारे में मैसेज करें",
  "Mobile number": "मोबाइल नंबर",
  "Move With": "मूव कीजिए",
  "Muscles worked": "कौन-सी मसल पर असर",
  "Muscles worked by the {name}: {primary} as the primary movers":
    "{name} में काम करने वाली मसल: प्राइमरी — {primary}",
  "Muscles worked by the {name}: {primary} as the primary movers, assisted by {secondary}":
    "{name} में काम करने वाली मसल: प्राइमरी — {primary}, साथ में {secondary}",
  "Name": "नाम",
  "Name to be confirmed": "नाम बाद में बताया जाएगा",
  "Next image": "अगली तस्वीर",
  "Next month": "अगला महीना",
  "No WhatsApp on this device? Use": "इस डिवाइस पर WhatsApp नहीं है? तो",
  "No YouTube channel yet — follow us on Instagram for updates.":
    "अभी कोई YouTube चैनल नहीं है — अपडेट के लिए हमें Instagram पर फ़ॉलो करें।",
  "No email address yet — call or message us on WhatsApp instead.":
    "अभी कोई ईमेल पता नहीं है — इसकी जगह हमें कॉल करें या WhatsApp पर मैसेज करें।",
  "No fluff. Real coaching and a plan for your level.": "कोई बकवास नहीं। असली कोचिंग और आपके लेवल का प्लान।",
  "No fluff. Real coaching, honest guidance, and a plan for your level.":
    "कोई बकवास नहीं। असली कोचिंग, ईमानदार सलाह, और आपके लेवल का प्लान।",
  "No muscle groups highlighted.": "कोई मसल ग्रुप हाइलाइट नहीं है।",
  "Nothing is added to this and nothing is stored on the way — the site simply opens WhatsApp with the text below.":
    "इसमें कुछ जोड़ा नहीं जाता और रास्ते में कुछ सेव नहीं होता — साइट सिर्फ़ नीचे लिखे टेक्स्ट के साथ WhatsApp खोल देती है।",
  "Open menu": "मेन्यू खोलें",
  "Opening WhatsApp…": "WhatsApp खुल रहा है…",
  "Original illustrations of the training that happens here — squat work, free weights, conditioning and the rest. Tap any tile to view it larger.":
    "यहाँ होने वाली ट्रेनिंग के ओरिजिनल इलस्ट्रेशन — स्क्वाट वर्क, फ्री वेट्स, कंडीशनिंग और बाकी सब। बड़ा देखने के लिए किसी भी टाइल पर टैप करें।",
  "Our Trainers": "हमारे ट्रेनर",
  "Perfect Form": "सही फॉर्म के साथ",
  "Phone": "फ़ोन",
  "Pick a duration — the longer you commit, the lower your monthly rate. Tap any plan to message us on WhatsApp about it.":
    "अवधि चुनें — जितने लंबे समय के लिए कमिट करेंगे, महीने का रेट उतना कम। किसी भी प्लान पर टैप करके हमें WhatsApp पर उसके बारे में मैसेज करें।",
  "Previous image": "पिछली तस्वीर",
  "Previous month": "पिछला महीना",
  "Primary": "प्राइमरी",
  "Primary Goal": "मुख्य गोल",
  "Primary muscles: {list}.": "प्राइमरी मसल: {list}।",
  "Protein drives recovery and muscle. Set your weight and goal to get a daily target — and what it looks like on a plate.":
    "रिकवरी और मसल प्रोटीन से बनते हैं। अपना वज़न और गोल सेट करें और रोज़ का टारगेट देखें — साथ में यह भी कि थाली में वो कितना होता है।",
  "Protein per 100 g of the common edible portion — typical rounded values for guidance.":
    "आम खाने लायक हिस्से के प्रति 100 g में प्रोटीन — गाइडेंस के लिए मोटे-मोटे आम आँकड़े।",
  "Questions": "सवाल",
  "Quick Access": "क्विक एक्सेस",
  "Rate us": "हमें रेटिंग दें",
  "Rating: {stars} ({rating}/5)": "रेटिंग: {stars} ({rating}/5)",
  "Real Results": "असली नतीजे",
  "Reality check — ": "हक़ीक़त — ",
  "Requirements": "ज़रूरतें",
  "Rest": "आराम",
  "Rest & Recovery": "आराम और रिकवरी",
  "Safety": "सेफ़्टी",
  "Scroll to about": "परिचय तक स्क्रोल करें",
  "Scroll to top": "सबसे ऊपर जाएँ",
  "Secondary": "सेकंडरी",
  "Secondary muscles: {list}.": "सेकंडरी मसल: {list}।",
  "Sections": "सेक्शन",
  "See High-Protein Foods": "हाई-प्रोटीन फूड्स देखें",
  "Send To The Owner": "मालिक तक भेजें",
  "Send an Enquiry": "पूछताछ भेजें",
  "Send via WhatsApp": "WhatsApp से भेजें",
  "Simple": "आसान",
  "Skip to content": "सीधे कंटेंट पर जाएँ",
  "Smart Support": "समझदार सपोर्ट",
  "Spread protein across 3–4 meals. Ranges are general guidance for healthy adults, not medical or renal advice.":
    "प्रोटीन को 3–4 मील में बाँटें। ये रेंज सेहतमंद बड़ों के लिए आम गाइडेंस हैं, कोई मेडिकल या किडनी से जुड़ी सलाह नहीं।",
  "Start & end position": "शुरू और आख़िर की पोज़िशन",
  "Start This With A Coach": "इसे कोच के साथ शुरू करें",
  "Start Your Fitness Journey": "अपना फ़िटनेस सफ़र शुरू करें",
  "Stay Consistent": "नियम से चलते रहिए",
  "Strength / Powerlifting": "स्ट्रेंथ / पावरलिफ्टिंग",
  "Strength-first coaching, an honest iron floor and plans that scale with you. Forge your best body.":
    "स्ट्रेंथ-फ़र्स्ट कोचिंग, एक ईमानदार आयरन फ़्लोर और ऐसे प्लान जो आपके साथ बढ़ते हैं। अपनी बेस्ट बॉडी बनाइए।",
  "Supplements That": "सप्लीमेंट जो",
  "Tap any exercise for the start and end position, the muscles it works, step-by-step technique, breathing, the mistakes to avoid and the safety notes. Filter by body part to build your session.":
    "किसी भी एक्सरसाइज़ पर टैप करें और देखें शुरू और आख़िर की पोज़िशन, कौन-सी मसल पर असर पड़ता है, कदम-दर-कदम टेक्नीक, साँस, बचने वाली गलतियाँ और सेफ़्टी नोट्स। अपना सेशन बनाने के लिए बॉडी पार्ट से छाँटें।",
  "Tap to open the full session": "पूरा सेशन खोलने के लिए टैप करें",
  "Tell us a little about where you're starting from.": "थोड़ा बता दें कि आप कहाँ से शुरू कर रहे हैं।",
  "Tell us what is working, what is not, and what you need on the floor. This goes straight to the gym owner's WhatsApp — no ticket queue, no inbox nobody reads.":
    "बताइए क्या ठीक चल रहा है, क्या नहीं, और फ़्लोर पर आपको क्या चाहिए। यह सीधे जिम के मालिक के WhatsApp पर जाता है — कोई टिकट लाइन नहीं, कोई ऐसा इनबॉक्स नहीं जिसे कोई पढ़ता ही न हो।",
  "The": "हमारी",
  "The rest of the page still works. If you need {target} right now, message or call us and we will help you directly.":
    "बाकी पेज ठीक काम कर रहा है। अगर आपको अभी {target} चाहिए, तो हमें मैसेज या कॉल करें और हम सीधे आपकी मदद कर देंगे।",
  "The same battle-tested split at three levels. Pick yours — the days stay the same, the volume and intensity scale with you.":
    "वही आज़माया हुआ स्प्लिट, तीन लेवल पर। अपना चुनें — दिन वही रहते हैं, वॉल्यूम और तीव्रता आपके साथ बदलती है।",
  "There is no server behind this form and no database — the message exists only in your WhatsApp chat.":
    "इस फ़ॉर्म के पीछे कोई सर्वर नहीं है और कोई डेटाबेस नहीं — मैसेज सिर्फ़ आपकी WhatsApp चैट में रहता है।",
  "This is not anonymous.": "यह गुमनाम नहीं है।",
  "This section could not be displayed": "यह सेक्शन दिखाया नहीं जा सका",
  "Those numbers are outside the range this calculator covers. Use a height of":
    "ये नंबर इस कैलकुलेटर की रेंज से बाहर हैं। ऊँचाई",
  "Today": "आज",
  "Today — {day}": "आज — {day}",
  "Tools & More": "टूल्स और बाकी",
  "Train Like The": "ट्रेनिंग कीजिए जैसे करते हैं",
  "Training": "ट्रेनिंग",
  "Training goal": "ट्रेनिंग का गोल",
  "Training level": "ट्रेनिंग लेवल",
  "Two templates built on how the strongest people in the sport actually train — brutal volume on one side, strength-first women’s programming on the other. Pick the one that matches your goal, then earn it.":
    "दो टेम्पलेट, इस खेल के सबसे मज़बूत लोगों की असली ट्रेनिंग पर बने — एक तरफ़ कड़ा वॉल्यूम, दूसरी तरफ़ महिलाओं के लिए स्ट्रेंथ-फ़र्स्ट प्रोग्रामिंग। जो आपके गोल से मेल खाए वही चुनें, और फिर उसे कमाएँ।",
  "Veg and non-veg sources with protein per 100 g and a real-world serving. Build your plate around these.":
    "शाकाहारी और नॉन-वेज सोर्स, हर 100 g में प्रोटीन और एक असली सर्विंग के साथ। अपनी थाली इन्हीं के आसपास बनाएँ।",
  "Visit Our Gym": "हमारा जिम देखने आइए",
  "Warm up 5–10 min before every session and stretch after. Progress the weight when you hit the top of the rep range with clean form.":
    "हर सेशन से पहले 5–10 min वॉर्म-अप करें और बाद में स्ट्रेच करें। जब साफ़ फॉर्म के साथ रेप रेंज के ऊपरी सिरे तक पहुँच जाएँ, तब वज़न बढ़ाएँ।",
  "We'll open WhatsApp with your details ready to send.":
    "हम WhatsApp खोल देंगे, आपकी जानकारी भेजने के लिए तैयार होगी।",
  "Weekly Split": "हफ़्ते का स्प्लिट",
  "Weight Calculator": "वज़न कैलकुलेटर",
  "What happened, when, and which machine or area was involved?":
    "क्या हुआ, कब हुआ, और कौन-सी मशीन या कौन-सा हिस्सा शामिल था?",
  "What is this about?": "यह किस बारे में है?",
  "WhatsApp": "WhatsApp",
  "WhatsApp Us": "WhatsApp पर मैसेज करें",
  "WhatsApp should have opened in a new tab with your message ready to send — press send there to deliver it.":
    "WhatsApp एक नए टैब में खुल जाना चाहिए था, आपका मैसेज भेजने के लिए तैयार — भेजने के लिए वहाँ सेंड दबाएँ।",
  "WhatsApp us": "हमें WhatsApp करें",
  "Which part of the gym?": "जिम का कौन-सा हिस्सा?",
  "With": "—",
  "Workout Plan": "वर्कआउट प्लान",
  "Write another": "एक और लिखें",
  "Write your message first — we do not want to send an empty one.":
    "पहले अपना मैसेज लिखें — हम खाली मैसेज नहीं भेजना चाहते।",
  "You are within your healthy weight range — nice work. Train for strength and maintain.":
    "आप अपने हेल्दी वज़न की रेंज में हैं — बढ़िया। अब ताक़त के लिए ट्रेनिंग करें और इसे बनाए रखें।",
  "YouTube": "YouTube",
  "Your 7-Day": "आपका 7-दिन का",
  "Your BMI": "आपका BMI",
  "Your Daily Target": "आपका रोज़ का टारगेट",
  "Your Details": "आपकी जानकारी",
  "Your Goal": "आपका गोल",
  "Your Results": "आपके नतीजे",
  "Your Voice": "आपकी बात",
  "Your message": "आपका मैसेज",
  "Your name": "आपका नाम",
  "Your weekly split mapped across the month. Every day has a target — show up and tick it off.":
    "आपका हफ़्ते का स्प्लिट, पूरे महीने पर बिछा हुआ। हर दिन का एक टारगेट है — आइए और उस पर टिक लगाइए।",
  "about": "करीब",
  "across 4 meals": "हर मील में, 4 मील के हिसाब से",
  "and paste it into an email to": "दबाएँ और उसे ईमेल में पेस्ट करके भेजें —",
  "app navigation": "ऐप नेविगेशन",
  "e.g. 175": "जैसे 175",
  "e.g. 72": "जैसे 72",
  "end": "आख़िर की",
  "feet": "फ़ीट",
  "for people who train hard.": "से — उनके लिए जो मेहनत से ट्रेनिंग करते हैं।",
  "inches": "इंच",
  "is outside the range this calculator covers. Enter a bodyweight between {min} and {max} kg.":
    "इस कैलकुलेटर की रेंज से बाहर है। {min} और {max} kg के बीच का बॉडीवेट डालें।",
  "name not given": "नाम नहीं बताया",
  "no phone given": "फ़ोन नंबर नहीं दिया",
  "none listed": "कोई नहीं",
  "optional": "ज़रूरी नहीं",
  "rest day": "आराम का दिन",
  "start": "शुरू की",
  "the {name}": "{name}",
  "this": "यह हिस्सा",
  "to gain to reach the healthy range.": "बढ़ाकर आप हेल्दी रेंज तक पहुँच जाएँगे।",
  "to lose to reach the healthy range.": "घटाकर आप हेल्दी रेंज तक पहुँच जाएँगे।",
  "us": "हमारे पास",
  "{caption} view muscle chart for {name}. {sentence}": "{name} के लिए मसल चार्ट, {caption} व्यू। {sentence}",
  "{caption} view muscle chart. {sentence}": "मसल चार्ट, {caption} व्यू। {sentence}",
  "{day} {month}, {split}: {focus}": "{day} {month}, {split}: {focus}",
  "{locality} • Strength & Conditioning": "{locality} • स्ट्रेंथ और कंडीशनिंग",
  "{male} male and {female} female.": "{male} पुरुष और {female} महिला।",
  "{month} {year} training calendar": "{month} {year} का ट्रेनिंग कैलेंडर",
  "{name} — areas of focus": "{name} — फ़ोकस के क्षेत्र",
  "{name} — {phase} position": "{name} — {phase} पोज़िशन",
  "{name} — {phase} position: {cue}": "{name} — {phase} पोज़िशन: {cue}",
  "{n} out of 5": "5 में से {n}",
  "{total} coaches on the floor": "फ़्लोर पर {total} कोच",
  "© {year} {brand}. All rights reserved.": "© {year} {brand}। सर्वाधिकार सुरक्षित।",
  "≈ {mid} g looks like any of these": "≈ {mid} g इनमें से किसी एक जैसा दिखता है",

  /* ------------------------------------------------------------------
     Strings reached through t(variable) — module constants and data —
     so the extractor above cannot see them.
     ------------------------------------------------------------------ */

  /* App-shell tab labels (src/shell/tabs.js) */
  "Home": "होम",
  "Train": "ट्रेनिंग",
  "Tools": "टूल्स",
  "Food": "खाना",
  "Gym": "जिम",

  /* App-shell screen labels (segmented rail) */
  "Plans": "प्लान",
  "Exercises": "एक्सरसाइज़",
  "Legends": "लेजेंड्स",
  "BMI": "BMI",
  "Protein": "प्रोटीन",
  "Supplements": "सप्लीमेंट",
  "Trainers": "ट्रेनर",
  "Visit": "विज़िट",
  "Feedback": "फीडबैक",

  /* App-shell screen titles */
  "Workout Plans": "वर्कआउट प्लान",
  "Training Calendar": "ट्रेनिंग कैलेंडर",
  "BMI & Ideal Weight": "BMI और आदर्श वज़न",
  "Protein Calculator": "प्रोटीन कैलकुलेटर",
  "Protein Foods": "प्रोटीन फूड्स",
  "About the Gym": "जिम के बारे में",
  "Visit Us": "हमारे पास आइए",

  /* Section descriptors — rendered inside the ErrorBoundary sentence
     "If you need {the …} right now, message or call us…" */
  "intro": "परिचय",
  "gym and membership details": "जिम और मेंबरशिप की जानकारी",
  "trainer profiles": "ट्रेनर प्रोफ़ाइल",
  "BMI calculator": "BMI कैलकुलेटर",
  "workout plans": "वर्कआउट प्लान",
  "legend training protocols": "लेजेंड ट्रेनिंग प्रोटोकॉल",
  "exercise guide": "एक्सरसाइज़ गाइड",
  "protein calculator": "प्रोटीन कैलकुलेटर",
  "protein foods list": "प्रोटीन फूड्स की लिस्ट",
  "supplement guide": "सप्लीमेंट गाइड",
  "training calendar": "ट्रेनिंग कैलेंडर",
  "gallery": "गैलरी",
  "feedback form": "फीडबैक फ़ॉर्म",
  "contact details": "संपर्क की जानकारी",

  /* MuscleMap legend labels — same wording as hi/exercises.js `labels` */
  "Chest": "छाती",
  "Upper Chest": "अपर चेस्ट",
  "Lats": "लैट्स",
  "Upper Back": "अपर बैक",
  "Traps": "ट्रैप्स",
  "Lower Back": "लोअर बैक",
  "Front Delts": "फ्रंट डेल्ट्स",
  "Side Delts": "साइड डेल्ट्स",
  "Rear Delts": "रियर डेल्ट्स",
  "Biceps": "बाइसेप्स",
  "Triceps": "ट्राइसेप्स",
  "Forearms": "फोरआर्म्स",
  "Abs": "एब्स",
  "Obliques": "ओब्लिक्स",
  "Glutes": "ग्लूट्स",
  "Quads": "क्वाड्स",
  "Hamstrings": "हैमस्ट्रिंग्स",
  "Adductors": "एडक्टर्स",
  "Calves": "काफ्स",

  /* MuscleMap view captions */
  "Front": "सामने",
  "Back": "पीछे",

  /* Calendar months */
  "January": "जनवरी",
  "February": "फ़रवरी",
  "March": "मार्च",
  "April": "अप्रैल",
  "May": "मई",
  "June": "जून",
  "July": "जुलाई",
  "August": "अगस्त",
  "September": "सितंबर",
  "October": "अक्तूबर",
  "November": "नवंबर",
  "December": "दिसंबर",

  /* Calendar short weekdays — full words, not sliced, so Devanagari
     glyphs are never cut mid-character */
  "Mon": "सोम",
  "Tue": "मंगल",
  "Wed": "बुध",
  "Thu": "गुरु",
  "Fri": "शुक्र",
  "Sat": "शनि",
  "Sun": "रवि",

  /* Full weekdays — useClosedDay dayName / nextOpenLabel */
  "Sunday": "रविवार",
  "Monday": "सोमवार",
  "Tuesday": "मंगलवार",
  "Wednesday": "बुधवार",
  "Thursday": "गुरुवार",
  "Friday": "शुक्रवार",
  "Saturday": "शनिवार",

  /* Exercise levels — the English value stays the data key; this is display only */
  "Beginner": "शुरुआती",
  "Intermediate": "मध्यम",
  "Experienced": "अनुभवी",

  /* BMI gender + height unit */
  "male": "पुरुष",
  "female": "महिला",
  "cm": "cm",
  "ft / in": "फ़ीट / इंच",

  /* BMI category labels (full + short badge forms) */
  "Underweight": "कम वज़न",
  "Normal": "सामान्य",
  "Overweight": "ज़्यादा वज़न",
  "Obese": "मोटापा",
  "Under": "कम",
  "Over": "ज़्यादा",

  /* BMI recommendations */
  "Focus on a calorie surplus with strength training. Add protein-dense meals and progressive overload to build lean mass.":
    "स्ट्रेंथ ट्रेनिंग के साथ कैलोरी सरप्लस पर ध्यान दें। लीन मास बनाने के लिए प्रोटीन से भरपूर मील और प्रोग्रेसिव ओवरलोड जोड़ें।",
  "Great range. Train for strength and body composition, keep protein high and stay consistent to maintain and sculpt.":
    "बढ़िया रेंज। ताक़त और बॉडी कंपोज़िशन के लिए ट्रेनिंग करें, प्रोटीन ऊँचा रखें और नियम से चलते रहें — इसी से यह बना रहेगा और शेप भी आएगा।",
  "Combine resistance training with a modest calorie deficit and daily steps. Small, steady changes beat crash diets.":
    "रेज़िस्टेंस ट्रेनिंग के साथ थोड़ी कैलोरी की कमी और रोज़ का चलना जोड़ें। छोटे-छोटे लगातार बदलाव क्रैश डाइट से बेहतर हैं।",
  "Prioritise sustainable fat loss: resistance training, a controlled deficit and more movement. Consider medical guidance for a tailored plan.":
    "टिकाऊ फैट लॉस को पहले रखें: रेज़िस्टेंस ट्रेनिंग, नपी-तुली कैलोरी की कमी और ज़्यादा चलना-फिरना। अपने हिसाब का प्लान बनाने के लिए डॉक्टरी सलाह लेने पर विचार करें।",

  /* Protein goal notes + serving units */
  "Stay healthy and hold your muscle.": "सेहत बनी रहे और मसल टिकी रहे।",
  "Maximise lean mass in a surplus.": "सरप्लस में ज़्यादा से ज़्यादा लीन मास बनाएँ।",
  "Preserve muscle in a deficit.": "कमी वाली डाइट में मसल बचाएँ।",
  "whey scoops": "व्हे स्कूप",
  "eggs": "अंडे",
  "chicken": "चिकन",

  /* Feedback kinds — the uppercase triage tag sent to WhatsApp stays English
     (it is built from kind.tag, never through t()) */
  "Complaint": "शिकायत",
  "Requirement": "ज़रूरत",
  "Suggestion": "सुझाव",
  "Something we are doing right, or an honest opinion.": "कोई चीज़ जो हम ठीक कर रहे हैं, या आपकी ईमानदार राय।",
  "Something is wrong and needs fixing.": "कुछ गलत है और उसे ठीक करना है।",
  "You need equipment, a timing or a service we do not have.":
    "आपको कोई इक्विपमेंट, कोई समय या कोई सुविधा चाहिए जो हमारे पास नहीं है।",
  "An idea that would make the gym better.": "कोई आइडिया जो जिम को बेहतर बना दे।",

  /* Feedback areas — the <option value> stays English, only the label changes */
  "Equipment": "इक्विपमेंट",
  "Cleanliness & hygiene": "साफ़-सफ़ाई",
  "Coaching & guidance": "कोचिंग और गाइडेंस",
  "Timings & crowd": "समय और भीड़",
  "Membership & billing": "मेंबरशिप और बिलिंग",
  "Music & atmosphere": "म्यूज़िक और माहौल",
  "Changing rooms": "चेंजिंग रूम",
  "Something else": "कुछ और",

  /* Contact row label */
  "Call": "कॉल",
}
