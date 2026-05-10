// Curated list of craft-specific words: materials, tools, techniques,
// disciplines, and the classic outputs crafters actually make.
// Avoids generic decor / home goods / fashion / nature terms.
export const CRAFT_WORDS: string[] = [
  // Textile materials
  "yarn", "thread", "wool", "cotton", "linen", "silk", "felt", "fabric",
  "fiber", "twine", "rope", "ribbon", "lace", "denim", "canvas", "burlap",
  "velvet", "satin", "tulle", "muslin", "fleece", "leather", "suede",
  "floss", "skein", "spool", "bobbin", "hank", "ply", "roving",

  // Textile tools
  "needle", "pin", "scissors", "shears", "hook", "loom", "spindle", "thimble",
  "hoop", "shuttle", "treadle", "bodkin", "awl", "rotary",

  // Textile techniques + disciplines
  "knit", "knitting", "purl", "crochet", "crocheting",
  "sew", "sewing", "stitch", "weave", "weaving",
  "quilt", "quilting", "darn", "hem", "tat", "tatting",
  "macrame", "crewel", "needlepoint", "needlework", "tapestry",
  "applique", "patchwork",
  "embroidery", "embroider", "embroidering",
  "gauge", "swatch", "intarsia",
  "felting", "spinning", "weaver", "knitter",

  // Paper craft
  "paper", "cardstock", "vellum", "washi",
  "origami", "kirigami", "papercraft",
  "scrapbook", "scrapbooking",
  "decoupage", "quilling",
  "stamp", "stamping", "stencil", "stenciling",
  "emboss", "embossing",
  "cardmaking",

  // Ceramics
  "clay", "porcelain", "terracotta", "ceramic", "earthenware", "stoneware",
  "pottery", "kiln", "wheel", "glaze", "glazing", "slip", "bisque",
  "throwing", "wedging", "kintsugi", "raku",

  // Sculpture / carving
  "sculpt", "sculpting", "sculpture",
  "carve", "carving", "whittle", "whittling",
  "mold", "cast", "casting", "chisel",

  // Woodwork
  "wood", "lumber", "plank", "dowel", "veneer", "balsa", "plywood",
  "hammer", "nail", "screw", "saw", "plane", "lathe", "sandpaper", "sanding",
  "joinery", "dovetail", "mortise", "tenon", "varnish", "stain", "lacquer",
  "woodworking", "woodturning", "pyrography",

  // Metal & jewelry
  "metal", "wire", "bead", "beading", "beadwork",
  "solder", "soldering", "anvil", "forge", "forging", "smith",
  "enamel", "enameling", "filigree", "bezel", "rivet", "engrave", "engraving",
  "jewelry", "bracelet", "necklace", "earring", "brooch", "pendant", "charm",
  "metalwork", "jewelrymaking",

  // Glass & resin
  "glass", "stained", "fused", "blown", "mosaic", "tile", "grout",
  "resin", "epoxy", "lampwork", "glasswork",

  // Paint & ink
  "paint", "painting", "acrylic", "watercolor", "gouache", "tempera",
  "oil", "brush", "palette", "easel",
  "ink", "marker", "pencil", "pastel", "charcoal", "crayon", "chalk",
  "sketch", "draw", "drawing", "doodle", "shade", "blend",
  "calligraphy", "lettering",
  "impasto", "gilding", "foiling",

  // Print & dye
  "dye", "dyeing", "batik", "shibori", "indigo", "madder", "mordant",
  "screenprint", "screenprinting", "linocut", "woodcut",
  "etching", "monoprint", "letterpress", "printmaking", "block",

  // Candle / soap / wax
  "candle", "candlemaking", "wax", "wick",
  "soap", "soapmaking", "balm",

  // Cake decorating (the crafty bits)
  "fondant", "frosting", "icing", "marzipan",
  "piping", "decorate", "garnish",

  // Bookbinding / leather
  "bookbinding", "binding", "leatherwork", "tooling", "stitching",

  // Embellishments
  "sequin", "rhinestone", "glitter", "tassel", "pompom", "fringe",
  "trim", "patch",

  // Fasteners
  "glue", "tape", "staple", "snap", "button", "buckle", "zipper", "velcro",
  "grommet", "eyelet", "magnet",

  // Pattern / design language
  "pattern", "template", "motif", "design", "texture", "layer", "color",

  // Classic craft outputs (things crafters specifically make)
  "scarf", "shawl", "mitten", "sock", "sweater",
  "blanket", "afghan", "doily",
  "basket", "wreath", "garland",
  "doll", "plush", "amigurumi",
  "pressed", "dried",

  // Meta / process
  "handmade", "homemade", "artisan", "craft", "crafting", "crafter", "crafty",
  "hobby", "project",
  "create", "creative", "creation", "maker", "studio", "workshop", "atelier",
  "kit", "supplies", "stash", "tutorial", "instructions",
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
