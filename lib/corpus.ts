// Background ranking corpus: common English nouns, verbs, and adjectives.
// We rank guesses against this (plus the craft words) so the rank space is
// dense enough that two semantically distinct off-vocab guesses don't
// collide on the same integer rank.
//
// Keep it broad rather than thematic. The secret word is still always
// chosen from the curated craft list in words.ts.
export const COMMON_WORDS: string[] = [
  // Time
  "time", "year", "day", "night", "morning", "evening", "afternoon",
  "hour", "minute", "second", "week", "month", "today", "tomorrow",
  "yesterday", "moment", "season", "spring", "summer", "autumn", "winter",
  "century", "decade",

  // People & relationships
  "person", "people", "man", "woman", "child", "baby", "kid", "boy", "girl",
  "family", "mother", "father", "brother", "sister", "son", "daughter",
  "parent", "grandparent", "friend", "neighbor", "stranger", "guest", "host",
  "couple", "spouse", "husband", "wife", "team", "group", "crowd",
  "community", "society", "tribe", "nation",

  // Body
  "body", "head", "hair", "face", "eye", "nose", "ear", "mouth", "lip",
  "tooth", "tongue", "neck", "shoulder", "arm", "elbow", "wrist", "hand",
  "finger", "thumb", "palm", "chest", "back", "stomach", "waist", "hip",
  "leg", "knee", "ankle", "foot", "toe", "skin", "bone", "muscle", "blood",
  "heart", "brain", "lung", "liver", "voice", "breath",

  // Home & rooms
  "home", "house", "apartment", "room", "kitchen", "bedroom", "bathroom",
  "living", "dining", "hallway", "garage", "basement", "attic", "yard",
  "garden", "porch", "balcony", "rooftop",
  "door", "window", "wall", "floor", "ceiling", "roof", "stair", "step",
  "table", "chair", "bed", "sofa", "couch", "desk", "shelf", "cabinet",
  "drawer", "closet", "mirror", "lamp", "rug", "pillow", "blanket",
  "curtain", "bookshelf",

  // Containers
  "box", "bag", "basket", "bin", "bucket", "barrel", "crate", "jar", "bottle",
  "can", "cup", "mug", "glass", "bowl", "plate", "dish", "pot", "pan",
  "kettle", "tray", "vase", "tin",

  // Food & drink
  "food", "meal", "breakfast", "lunch", "dinner", "snack", "dessert",
  "drink", "water", "juice", "milk", "tea", "coffee", "soda", "wine", "beer",
  "bread", "toast", "butter", "cheese", "yogurt", "egg",
  "meat", "chicken", "beef", "pork", "fish", "shrimp", "bacon", "ham",
  "fruit", "apple", "orange", "banana", "grape", "lemon", "lime", "peach",
  "pear", "berry", "strawberry", "blueberry", "raspberry", "cherry", "melon",
  "watermelon", "pineapple", "coconut", "mango",
  "vegetable", "carrot", "potato", "tomato", "onion", "garlic", "pepper",
  "lettuce", "spinach", "celery", "cucumber", "broccoli", "corn", "pea",
  "bean", "mushroom",
  "rice", "pasta", "noodle", "soup", "stew", "salad", "sandwich", "burger",
  "pizza", "taco", "sushi", "curry",
  "cake", "cookie", "pie", "muffin", "donut", "brownie", "pancake", "waffle",
  "candy", "chocolate", "ice", "cream",
  "salt", "sugar", "honey", "syrup", "spice", "herb", "oil", "vinegar",
  "sauce", "ketchup", "mustard",

  // Nature
  "nature", "earth", "world", "land", "sea", "ocean", "lake", "river",
  "stream", "pond", "waterfall", "beach", "island", "coast", "shore",
  "mountain", "hill", "valley", "cliff", "cave", "forest", "jungle",
  "desert", "field", "meadow", "swamp", "tundra",
  "sky", "sun", "moon", "star", "planet", "cloud", "rainbow", "horizon",
  "rain", "snow", "ice", "frost", "fog", "mist", "wind", "storm", "thunder",
  "lightning", "hurricane", "tornado",
  "rock", "stone", "pebble", "boulder", "sand", "soil", "mud", "dust",
  "tree", "trunk", "branch", "leaf", "root", "bark", "twig", "log",
  "flower", "petal", "stem", "bud", "blossom", "grass", "weed", "vine",
  "moss", "bush", "shrub", "fern", "seed", "fruit", "nut", "acorn",

  // Animals
  "animal", "pet", "dog", "puppy", "cat", "kitten", "horse", "pony", "cow",
  "calf", "pig", "piglet", "sheep", "lamb", "goat", "rabbit", "hamster",
  "guinea", "mouse", "rat", "squirrel", "chipmunk", "raccoon", "skunk",
  "deer", "moose", "elk", "bear", "wolf", "fox", "coyote", "lion", "tiger",
  "leopard", "cheetah", "elephant", "giraffe", "zebra", "rhino", "hippo",
  "camel", "kangaroo", "koala", "panda", "monkey", "ape", "gorilla",
  "chimpanzee", "sloth",
  "bird", "chicken", "rooster", "duck", "goose", "swan", "turkey", "pigeon",
  "sparrow", "robin", "owl", "eagle", "hawk", "falcon", "crow", "raven",
  "parrot", "penguin", "ostrich", "flamingo",
  "fish", "shark", "whale", "dolphin", "salmon", "tuna", "trout", "octopus",
  "squid", "crab", "lobster", "shrimp", "starfish", "jellyfish", "seahorse",
  "reptile", "snake", "lizard", "turtle", "tortoise", "crocodile",
  "alligator", "gecko", "iguana",
  "frog", "toad", "salamander",
  "insect", "bug", "ant", "bee", "wasp", "fly", "mosquito", "moth",
  "butterfly", "beetle", "cricket", "grasshopper", "ladybug", "dragonfly",
  "spider", "scorpion", "worm", "snail", "slug",

  // Clothing & accessories
  "shirt", "blouse", "tshirt", "sweater", "hoodie", "jacket", "coat", "vest",
  "pants", "trousers", "jeans", "shorts", "skirt", "dress", "gown", "suit",
  "uniform", "robe", "pajamas",
  "shoe", "boot", "sandal", "sneaker", "slipper", "heel",
  "sock", "stocking", "tights",
  "hat", "cap", "beanie", "scarf", "tie", "bowtie", "belt", "glove", "mitten",
  "watch", "bracelet", "necklace", "earring", "ring", "wallet", "purse",
  "backpack", "tote", "handbag", "umbrella", "sunglasses",

  // Tech & objects
  "phone", "computer", "laptop", "tablet", "screen", "monitor", "keyboard",
  "mouse", "speaker", "headphone", "microphone", "camera", "lens", "battery",
  "charger", "plug", "cable", "cord", "wire", "chip", "circuit", "gear",
  "motor", "engine", "machine", "robot", "tool", "device", "gadget",
  "switch", "knob", "lever", "button", "remote", "antenna", "radio",
  "television", "speaker",

  // Vehicles
  "vehicle", "car", "truck", "van", "bus", "taxi", "motorcycle", "scooter",
  "bicycle", "skateboard", "train", "tram", "subway", "plane", "airplane",
  "helicopter", "rocket", "boat", "ship", "yacht", "canoe", "kayak", "raft",
  "submarine",

  // Work / school
  "school", "classroom", "teacher", "student", "professor", "principal",
  "lesson", "class", "course", "subject", "homework", "test", "exam",
  "grade", "diploma", "degree", "university", "college",
  "office", "workplace", "factory", "store", "shop", "mall", "market",
  "restaurant", "cafe", "bar", "hotel", "hospital", "clinic", "pharmacy",
  "bank", "library", "museum", "gallery", "theater", "cinema", "stadium",
  "gym", "park", "playground", "zoo", "aquarium",
  "job", "career", "work", "task", "duty", "project", "meeting",
  "appointment", "schedule", "deadline",
  "boss", "manager", "employee", "worker", "colleague", "client", "customer",
  "doctor", "nurse", "engineer", "lawyer", "judge", "scientist", "writer",
  "artist", "musician", "actor", "chef", "baker", "farmer", "fisherman",
  "soldier", "pilot", "driver", "police", "firefighter",

  // Money & business
  "money", "cash", "coin", "dollar", "cent", "price", "cost", "fee", "bill",
  "receipt", "tax", "salary", "wage", "income", "profit", "loss", "budget",
  "loan", "debt", "credit", "investment", "business", "company", "industry",
  "market", "trade", "deal", "contract", "sale", "discount", "purchase",

  // Activities / sports
  "sport", "game", "play", "match", "race", "competition", "tournament",
  "football", "soccer", "basketball", "baseball", "tennis", "volleyball",
  "hockey", "golf", "cricket", "rugby", "boxing", "wrestling", "swimming",
  "running", "cycling", "skiing", "skating", "surfing", "climbing",
  "hiking", "fishing", "hunting", "camping",

  // Arts & entertainment
  "art", "music", "song", "melody", "rhythm", "beat", "tune", "lyric",
  "concert", "band", "orchestra", "choir", "album", "playlist",
  "instrument", "guitar", "piano", "drum", "violin", "flute", "trumpet",
  "saxophone", "cello", "harp", "harmonica", "accordion",
  "dance", "ballet", "theater", "play", "movie", "film", "show", "series",
  "novel", "story", "poem", "essay", "article", "magazine", "newspaper",
  "comic", "manga",

  // Education / mind
  "idea", "thought", "mind", "memory", "knowledge", "wisdom", "intelligence",
  "skill", "talent", "ability", "experience", "lesson", "fact", "truth",
  "lie", "opinion", "belief", "theory", "hypothesis", "discovery",
  "invention", "innovation", "secret", "mystery", "puzzle", "riddle",

  // Feelings & abstract
  "feeling", "emotion", "love", "hate", "joy", "happiness", "sadness",
  "anger", "fear", "surprise", "disgust", "shame", "pride", "envy",
  "jealousy", "hope", "doubt", "trust", "courage", "patience", "peace",
  "war", "conflict", "friendship", "loneliness", "freedom", "justice",
  "dream", "wish", "goal", "plan", "fate", "luck", "chance",

  // Health
  "health", "medicine", "drug", "pill", "vaccine", "doctor", "nurse",
  "patient", "illness", "disease", "injury", "wound", "cut", "bruise",
  "burn", "fever", "cold", "flu", "cough", "headache", "stomachache",
  "allergy", "infection", "bandage", "cast", "crutch", "wheelchair",

  // Travel
  "trip", "travel", "vacation", "holiday", "tour", "journey", "adventure",
  "passport", "ticket", "luggage", "suitcase", "map", "compass", "hotel",
  "hostel", "campsite", "airport", "station", "harbor",

  // Geography / location
  "country", "city", "town", "village", "neighborhood", "street", "road",
  "highway", "avenue", "alley", "bridge", "tunnel", "intersection",
  "address", "location", "place", "region", "area", "zone", "border",

  // Materials & substances (general, beyond craft)
  "wood", "metal", "steel", "iron", "copper", "brass", "bronze", "gold",
  "silver", "aluminum", "tin", "lead", "plastic", "rubber", "stone",
  "concrete", "brick", "cement", "glass", "ceramic", "paper", "cardboard",
  "fabric", "cloth", "leather", "wool", "silk", "cotton", "linen", "fur",
  "feather", "shell", "ivory", "horn",
  "liquid", "solid", "gas", "powder", "dust", "ash", "smoke", "steam",
  "foam", "bubble",

  // Colors
  "color", "red", "orange", "yellow", "green", "blue", "purple", "violet",
  "pink", "magenta", "cyan", "turquoise", "teal", "indigo", "black", "white",
  "gray", "brown", "tan", "beige", "cream", "ivory", "gold", "silver",
  "bronze", "rainbow",

  // Shapes / geometry
  "shape", "circle", "square", "triangle", "rectangle", "oval", "diamond",
  "star", "heart", "cross", "arrow", "line", "curve", "spiral", "zigzag",
  "dot", "point", "edge", "corner", "angle", "side", "surface", "sphere",
  "cube", "cone", "cylinder", "pyramid",

  // Size / quantity
  "size", "big", "small", "large", "tiny", "huge", "giant", "mini", "wide",
  "narrow", "tall", "short", "long", "thick", "thin", "heavy", "light",
  "deep", "shallow",
  "number", "amount", "quantity", "many", "few", "lot", "bunch", "pile",
  "stack", "row", "column", "set", "pair", "dozen", "hundred", "thousand",
  "million",

  // Movement / action
  "walk", "run", "jog", "sprint", "jump", "leap", "hop", "skip", "crawl",
  "climb", "swim", "dive", "fly", "fall", "rise", "sit", "stand", "lie",
  "kneel", "bend", "stretch", "twist", "turn", "spin", "roll", "slide",
  "drag", "push", "pull", "lift", "drop", "throw", "catch", "kick", "hit",
  "punch", "slap", "hug", "kiss", "shake",
  "open", "close", "lock", "unlock", "break", "fix", "build", "destroy",
  "make", "create", "produce", "design", "draw", "write", "read", "type",
  "speak", "talk", "shout", "whisper", "sing", "laugh", "cry", "smile",
  "frown", "yawn", "sneeze", "cough", "blink", "wink",
  "eat", "drink", "bite", "chew", "swallow", "taste", "smell", "touch",
  "feel", "see", "look", "watch", "hear", "listen",
  "sleep", "wake", "rest", "nap", "dream", "think", "remember", "forget",
  "learn", "teach", "study", "practice",
  "buy", "sell", "pay", "give", "take", "receive", "borrow", "lend", "owe",
  "save", "spend", "share", "trade", "exchange",
  "cook", "bake", "fry", "boil", "grill", "roast", "steam", "chop", "slice",
  "dice", "peel", "mix", "stir", "whisk", "knead", "season",
  "clean", "wash", "rinse", "dry", "scrub", "sweep", "mop", "dust", "vacuum",
  "polish", "wipe",

  // Qualities / adjectives
  "good", "bad", "great", "terrible", "amazing", "wonderful", "awful",
  "beautiful", "ugly", "pretty", "handsome", "cute", "elegant", "graceful",
  "fancy", "plain", "simple", "complex", "easy", "hard", "difficult",
  "soft", "hard", "smooth", "rough", "sharp", "dull", "shiny", "matte",
  "bright", "dim", "loud", "quiet", "silent",
  "hot", "warm", "cool", "cold", "freezing", "wet", "dry", "damp", "moist",
  "fast", "slow", "quick", "rapid", "swift",
  "new", "old", "fresh", "stale", "young", "ancient", "modern", "vintage",
  "rich", "poor", "wealthy", "broke", "expensive", "cheap", "free",
  "strong", "weak", "tough", "fragile", "delicate", "sturdy", "solid",
  "clean", "dirty", "filthy", "messy", "tidy", "neat", "organized",
  "safe", "dangerous", "risky", "secure",
  "happy", "sad", "angry", "calm", "nervous", "scared", "brave", "shy",
  "friendly", "mean", "kind", "rude", "polite", "honest", "fair", "smart",
  "clever", "wise", "silly", "funny", "serious", "boring", "exciting",
  "interesting", "weird", "strange", "normal", "ordinary", "special",
  "unique", "common", "rare",

  // Misc objects
  "ball", "balloon", "kite", "doll", "toy", "puzzle", "board", "card",
  "dice", "coin", "key", "lock", "chain", "rope", "string", "ribbon",
  "tape", "glue", "stapler", "scissors", "knife", "fork", "spoon",
  "chopstick", "straw", "napkin", "towel", "tissue", "sponge", "broom",
  "mop", "bucket", "hose", "ladder", "hammer", "screwdriver", "drill",
  "wrench", "pliers", "nail", "screw", "bolt", "nut",
  "book", "notebook", "diary", "journal", "calendar", "envelope", "stamp",
  "letter", "package", "parcel", "gift", "present", "ribbon", "candle",
  "lantern", "flashlight", "torch", "match", "lighter",
  "clock", "alarm", "timer", "calendar",
  "mirror", "frame", "picture", "photograph", "painting", "drawing",
  "poster", "sign", "sticker", "flag", "banner",

  // Mind / abstract continued
  "language", "word", "sentence", "paragraph", "letter", "number", "symbol",
  "code", "message", "email", "text", "call", "voicemail", "post", "blog",
  "news", "report", "story",
  "question", "answer", "problem", "solution", "issue", "topic", "subject",
  "reason", "cause", "effect", "result", "outcome",
  "rule", "law", "right", "wrong", "good", "evil",
  "power", "force", "energy", "strength", "speed", "weight", "balance",
  "pressure", "temperature", "humidity", "volume", "density",

  // Religion / culture
  "religion", "faith", "god", "spirit", "soul", "prayer", "temple", "church",
  "mosque", "synagogue", "shrine", "altar",
  "culture", "tradition", "custom", "ritual", "ceremony", "festival",
  "holiday", "wedding", "funeral", "birthday", "anniversary",

  // Misc
  "thing", "stuff", "item", "object", "piece", "part", "whole", "half",
  "quarter", "section", "portion", "fragment", "chunk", "scrap", "piece",
  "beginning", "middle", "end", "start", "finish", "top", "bottom", "front",
  "back", "left", "right", "center", "inside", "outside", "above", "below",
  "near", "far", "here", "there", "everywhere", "nowhere",
];
