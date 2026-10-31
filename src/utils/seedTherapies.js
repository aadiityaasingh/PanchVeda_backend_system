const Therapy = require("../models/therapy.model.js");

const defaultMainTherapies = [
  {
    name: "Vamana Therapy",
    category: "vamana",
    defaultDurationDays: 5,
    baseCost: 2500,
    description: "Therapeutic emesis for Kapha detoxification and respiratory/metabolic balance.",
    isActive: true,
  },
  {
    name: "Virechana Therapy",
    category: "virechana",
    defaultDurationDays: 7,
    baseCost: 2000,
    description: "Therapeutic purgation for Pitta disorders, liver detox, and skin purification.",
    isActive: true,
  },
  {
    name: "Basti Therapy",
    category: "basti",
    defaultDurationDays: 8,
    baseCost: 1800,
    description: "Medicated herbal decoction and oil enemas for Vata management and musculoskeletal health.",
    isActive: true,
  },
  {
    name: "Nasya Therapy",
    category: "nasya",
    defaultDurationDays: 7,
    baseCost: 1500,
    description: "Nasal administration of medicated oils to clear toxins above the clavicle (head, neck & sinuses).",
    isActive: true,
  },
  {
    name: "Raktamokshana Therapy",
    category: "raktamokshana",
    defaultDurationDays: 3,
    baseCost: 2200,
    description: "Therapeutic bloodletting and purification for blood disorders, Pitta toxicity, and chronic skin ailments.",
    isActive: true,
  },
];

async function seedMainTherapies() {
  try {
    for (const item of defaultMainTherapies) {
      const existing = await Therapy.findOne({
        $or: [{ name: item.name }, { category: item.category }],
      });

      if (!existing) {
        await Therapy.create(item);
        console.log(`[Seed] Seeded ${item.name} (${item.category})`);
      } else if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
    }
    // Clean up temporary Abhyanga test therapies created by test runners
    await Therapy.deleteMany({ name: { $regex: "^Abhyanga Test" } });
  } catch (err) {
    console.error("[Seed] Error seeding main therapies:", err.message);
  }
}

module.exports = seedMainTherapies;
