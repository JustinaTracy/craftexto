// Curated list of craft-related words. Kept lowercase, single-word.
export const CRAFT_WORDS: string[] = [
  // textile materials
  "yarn", "thread", "wool", "cotton", "linen", "silk", "felt", "fabric",
  "fiber", "twine", "rope", "ribbon", "lace", "denim", "canvas", "burlap",
  "velvet", "satin", "tulle", "muslin", "fleece", "leather", "suede",
  "embroidery", "floss", "skein", "spool", "bobbin",

  // textile tools
  "needle", "pin", "scissors", "shears", "hook", "loom", "spindle", "thimble",
  "hoop", "frame", "shuttle", "treadle", "bodkin", "awl",

  // textile techniques
  "knit", "purl", "crochet", "sew", "stitch", "weave", "quilt", "applique",
  "darn", "hem", "tat", "macrame", "crewel", "needlepoint", "tapestry",

  // paper craft
  "paper", "cardboard", "cardstock", "vellum", "origami", "kirigami", "papier",
  "scrapbook", "stamp", "sticker", "washi", "doily", "confetti",

  // ceramics & sculpture
  "clay", "porcelain", "terracotta", "ceramic", "pottery", "kiln", "wheel",
  "glaze", "slip", "bisque", "earthenware", "stoneware", "sculpture",
  "carve", "mold", "cast", "kneading", "throwing",

  // woodwork
  "wood", "lumber", "plank", "dowel", "veneer", "balsa", "plywood",
  "hammer", "nail", "screw", "saw", "chisel", "plane", "lathe", "sandpaper",
  "whittle", "joinery", "dovetail", "mortise", "tenon", "varnish", "stain",

  // metal & jewelry
  "metal", "wire", "bead", "charm", "pendant", "clasp", "solder", "anvil",
  "forge", "smith", "enamel", "filigree", "bezel", "rivet", "engrave",
  "jewelry", "bracelet", "necklace", "earring", "ring", "brooch",

  // glass & resin
  "glass", "stained", "fused", "blown", "mosaic", "tile", "grout", "resin",
  "epoxy", "casting", "mold", "lampwork",

  // paint & ink
  "paint", "acrylic", "watercolor", "gouache", "tempera", "oil", "brush",
  "palette", "easel", "canvas", "ink", "marker", "pencil", "pastel", "charcoal",
  "crayon", "chalk", "sketch", "draw", "doodle", "calligraphy", "lettering",

  // fragrance & wax
  "candle", "wax", "wick", "soap", "lotion", "balm", "perfume", "incense",
  "potpourri", "essential",

  // food crafts
  "bake", "baking", "cake", "cookie", "frosting", "fondant", "icing",
  "sugar", "chocolate", "marzipan", "dough", "flour", "rolling", "cutter",
  "decorate", "garnish", "plating",

  // floral & nature
  "flower", "wreath", "bouquet", "garland", "pressed", "dried", "potted",
  "terrarium", "succulent", "moss", "twig", "branch", "bark", "leaf", "seed",
  "shell", "feather", "pebble", "driftwood",

  // patterns & decoration
  "pattern", "stencil", "template", "design", "motif", "chevron", "stripe",
  "polka", "floral", "geometric", "ornament", "decoration", "embellish",
  "trim", "fringe", "tassel", "pompom", "sequin", "rhinestone", "glitter",

  // adhesives & fasteners
  "glue", "tape", "staple", "clip", "snap", "button", "buckle", "zipper",
  "velcro", "magnet", "hook", "eye", "grommet", "eyelet",

  // measuring & marking
  "ruler", "tape", "compass", "protractor", "square", "marker", "chalk",

  // gifting & home
  "gift", "wrapping", "bow", "card", "envelope", "tag", "ornament",
  "frame", "vase", "bowl", "cup", "plate", "tray", "coaster", "trivet",
  "doormat", "rug", "blanket", "pillow", "cushion", "throw", "quilt",
  "curtain", "tablecloth", "runner", "placemat", "apron", "potholder",
  "coaster",

  // wearables
  "scarf", "shawl", "hat", "beanie", "mitten", "glove", "sock", "sweater",
  "cardigan", "poncho", "skirt", "dress", "shirt", "vest", "tie", "belt",
  "purse", "bag", "tote", "wallet", "backpack",

  // toys & figures
  "doll", "plush", "puppet", "teddy", "figurine", "miniature", "diorama",
  "puzzle", "kite", "marionette",

  // outdoor & rustic
  "basket", "broom", "wreath", "birdhouse", "lantern", "planter", "trellis",
  "fairy", "gnome",

  // print & dye
  "dye", "tie", "batik", "shibori", "indigo", "madder", "mordant",
  "screen", "block", "linocut", "woodcut", "etching", "engraving", "gocco",
  "monoprint", "letterpress",

  // crafts as hobby names
  "knitting", "crocheting", "sewing", "weaving", "quilting", "embroidering",
  "painting", "sculpting", "woodworking", "papercraft", "scrapbooking",
  "cardmaking", "stamping", "stenciling", "decoupage", "enameling",
  "candlemaking", "soapmaking", "bookbinding", "leatherwork", "metalwork",
  "glasswork", "beading", "macrame", "felting", "spinning", "dyeing",
  "printmaking", "calligraphy", "modeling", "carving", "etching",

  // nice generic concepts
  "handmade", "homemade", "artisan", "craft", "crafty", "hobby", "project",
  "create", "creative", "creation", "maker", "studio", "workshop", "atelier",
  "kit", "supplies", "stash", "tutorial", "pattern", "instructions",
  "color", "palette", "texture", "shape", "layer", "detail",
];

// Deduplicate while preserving first occurrence
const seen = new Set<string>();
export const VOCAB: string[] = CRAFT_WORDS.filter((w) => {
  const k = w.toLowerCase();
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

export function dailyIndex(date = new Date()): number {
  // Deterministic word for the date, using local YYYY-MM-DD.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const key = `${y}-${m}-${d}`;
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % VOCAB.length;
}

export function randomIndex(): number {
  return Math.floor(Math.random() * VOCAB.length);
}

export function dailyKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
