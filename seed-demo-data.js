require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./src/models/user.model.js");
const Patient = require("./src/models/patient.model.js");
const Therapy = require("./src/models/therapy.model.js");
const TherapyPlan = require("./src/models/therapyPlan.model.js");
const Session = require("./src/models/session.model.js");
const Bill = require("./src/models/bill.model.js");

async function seedData() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected to MongoDB successfully!");

  // Clean existing collections to ensure fresh, consistent, linked demo data
  console.log("Cleaning old/orphaned records...");
  await Session.deleteMany({});
  await Bill.deleteMany({});
  await TherapyPlan.deleteMany({});
  await Patient.deleteMany({});
  await Therapy.deleteMany({});
  await User.deleteMany({});

  console.log("1. Seeding Staff Users...");
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const hashedPasswordDoctor = await bcrypt.hash("doctor123", 10);
  const hashedPasswordTherapist = await bcrypt.hash("therapist123", 10);

  const users = await User.insertMany([
    {
      fullName: "Dr. Harish Joshi",
      email: "admin@panchveda.com",
      password: hashedPasswordAdmin,
      role: "admin",
      isActive: true,
    },
    {
      fullName: "Dr. Ananya Kulkarni",
      email: "dr.ananya@panchveda.com",
      password: hashedPasswordDoctor,
      role: "doctor",
      isActive: true,
    },
    {
      fullName: "Dr. Rajeshwar Iyer",
      email: "dr.rajesh@panchveda.com",
      password: hashedPasswordDoctor,
      role: "doctor",
      isActive: true,
    },
    {
      fullName: "Vikram Rathore",
      email: "vikram@panchveda.com",
      password: hashedPasswordTherapist,
      role: "therapist",
      isActive: true,
    },
    {
      fullName: "Sneha Pillai",
      email: "sneha@panchveda.com",
      password: hashedPasswordTherapist,
      role: "therapist",
      isActive: true,
    },
  ]);
  console.log(`✓ Seeded ${users.length} staff users`);

  console.log("2. Seeding 5 Core Panchakarma Therapies...");
  const therapies = await Therapy.insertMany([
    {
      name: "Vamana Therapy",
      category: "vamana",
      defaultDurationDays: 5,
      baseCost: 2500,
      description: "Therapeutic emesis for Kapha detoxification, metabolic disorders, and chronic respiratory congestion.",
      isActive: true,
    },
    {
      name: "Virechana Therapy",
      category: "virechana",
      defaultDurationDays: 7,
      baseCost: 2000,
      description: "Therapeutic purgation for Pitta disorders, liver detox, digestive fire restoration, and skin purification.",
      isActive: true,
    },
    {
      name: "Basti Therapy",
      category: "basti",
      defaultDurationDays: 8,
      baseCost: 1800,
      description: "Medicated herbal decoction (Kashaya) and oil (Sneha) enemas for Vata management and joint rehabilitation.",
      isActive: true,
    },
    {
      name: "Nasya Therapy",
      category: "nasya",
      defaultDurationDays: 7,
      baseCost: 1500,
      description: "Nasal administration of medicated oils to clear toxins above the clavicle (migraines, sinusitis & cervical issues).",
      isActive: true,
    },
    {
      name: "Raktamokshana Therapy",
      category: "raktamokshana",
      defaultDurationDays: 3,
      baseCost: 2200,
      description: "Therapeutic bloodletting and purification for severe blood toxicity, eczema, psoriasis, and localized Pitta stagnation.",
      isActive: true,
    },
  ]);
  console.log(`✓ Seeded ${therapies.length} therapies`);

  const tVamana = therapies.find((t) => t.category === "vamana");
  const tVirechana = therapies.find((t) => t.category === "virechana");
  const tBasti = therapies.find((t) => t.category === "basti");
  const tNasya = therapies.find((t) => t.category === "nasya");
  const tRaktamokshana = therapies.find((t) => t.category === "raktamokshana");

  console.log("3. Seeding Realistic Patient Profiles...");
  const patients = await Patient.insertMany([
    {
      fullName: "Ramesh Chandra Verma",
      gender: "male",
      dateOfBirth: new Date("1970-05-14"),
      phone: "9845012345",
      address: "Flat 402, Shanthi Niketan Apartments, Jayanagar, Bengaluru",
      emergencyContact: { name: "Suman Verma", phone: "9845099881" },
      medicalNotes: "Vata-Kapha prakriti. Chronic lumbar spondylosis with radiculopathy. Advised low salt diet, avoidance of cold foods.",
      isActive: true,
    },
    {
      fullName: "Sunita Venkatesh",
      gender: "female",
      dateOfBirth: new Date("1978-11-22"),
      phone: "9886023456",
      address: "14/B, 7th Cross, Malleshwaram, Bengaluru",
      emergencyContact: { name: "Venkatesh Murthy", phone: "9886011223" },
      medicalNotes: "Pitta-Vata aggravation. Severe morning sinus headaches and chronic cervical stiffness. Prescribed Anu Taila.",
      isActive: true,
    },
    {
      fullName: "Aditya Pratap Singh",
      gender: "male",
      dateOfBirth: new Date("1986-08-09"),
      phone: "9900034567",
      address: "Villa 28, Palm Meadows, Whitefield, Bengaluru",
      emergencyContact: { name: "Pooja Singh", phone: "9900088776" },
      medicalNotes: "Pitta dominant prakriti. Grade 1 Fatty Liver, acidity, and sluggish digestion. Recommended light warm soups.",
      isActive: true,
    },
    {
      fullName: "Meenakshi Sundaram",
      gender: "female",
      dateOfBirth: new Date("1962-03-30"),
      phone: "9741045678",
      address: "88, 11th Main, Indiranagar, Bengaluru",
      emergencyContact: { name: "Dr. S. Sundaram", phone: "9741033445" },
      medicalNotes: "Vata excess. Bilateral knee osteoarthritis with morning stiffness. History of mild hypertension under control.",
      isActive: true,
    },
    {
      fullName: "Kavita Deshmukh",
      gender: "female",
      dateOfBirth: new Date("1993-09-17"),
      phone: "9844056789",
      address: "B-201, Green Glen Layout, Bellandur, Bengaluru",
      emergencyContact: { name: "Rahul Deshmukh", phone: "9844022334" },
      medicalNotes: "Kapha-Vata imbalance. Hormonal irregularities, lethargy, slow metabolism. Starting pre-purification snehana.",
      isActive: true,
    },
    {
      fullName: "Pradeep Nambiar",
      gender: "male",
      dateOfBirth: new Date("1975-01-25"),
      phone: "9980067890",
      address: "34, 2nd Sector, HSR Layout, Bengaluru",
      emergencyContact: { name: "Latha Nambiar", phone: "9980044556" },
      medicalNotes: "Rakta & Pitta dushti. Chronic dry eczema on forearms and shins. Avoid sour, spicy, and fermented foods.",
      isActive: true,
    },
    {
      fullName: "Gaurav Malhotra",
      gender: "male",
      dateOfBirth: new Date("1982-12-04"),
      phone: "9845078901",
      address: "Penthouse 4, Prestige Enclave, Koramangala, Bengaluru",
      emergencyContact: { name: "Ritu Malhotra", phone: "9845011992" },
      medicalNotes: "High stress, disturbed sleep cycle, Vata nervous exhaustion. Advised Shirodhara and gentle evening abhyanga.",
      isActive: true,
    },
    {
      fullName: "Deepika Sharma",
      gender: "female",
      dateOfBirth: new Date("1989-06-18"),
      phone: "9945089012",
      address: "512, 14th Cross, JP Nagar Phase 2, Bengaluru",
      emergencyContact: { name: "Arun Sharma", phone: "9945077889" },
      medicalNotes: "Cervical radiculopathy and left frozen shoulder. Responds well to warm medicated oil fomentation.",
      isActive: true,
    },
  ]);
  console.log(`✓ Seeded ${patients.length} patients`);

  // Helper date generators
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d;
  };

  const daysFromNow = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };

  console.log("4. Seeding Therapy Plans, Daily Sessions & Invoices...");

  // PLAN 1: Completed Plan (Patient 0: Ramesh Verma - Basti 8 days, completed 2 days ago)
  const p1Start = daysAgo(10);
  const p1End = daysAgo(3);
  const plan1 = await TherapyPlan.create({
    patient: patients[0]._id,
    startDate: p1Start,
    endDate: p1End,
    status: "completed",
    notes: "Complete 8-day Yoga Basti regimen for chronic lower back stiffness.",
    therapies: [{ therapy: tBasti._id, durationDays: 8, costPerDay: tBasti.baseCost }],
  });

  const p1Sessions = [];
  for (let d = 0; d < 8; d++) {
    const sDate = new Date(p1Start);
    sDate.setDate(sDate.getDate() + d);
    p1Sessions.push({
      therapyPlan: plan1._id,
      therapy: tBasti._id,
      sessionDate: sDate,
      status: "completed",
      notes: d === 0 ? "Initial Sneha Basti administered smoothly." : d === 7 ? "Final decoction enema completed. Patient reports 80% pain relief." : "Therapy well tolerated, vital signs stable.",
    });
  }
  await Session.insertMany(p1Sessions);
  const p1Total = 8 * tBasti.baseCost; // 14,400
  await Bill.create({
    therapyPlan: plan1._id,
    patient: patients[0]._id,
    totalAmount: p1Total,
    paidAmount: p1Total,
    status: "paid",
  });

  // PLAN 2: Ongoing Plan (Patient 1: Sunita Venkatesh - Nasya 7 days, started 3 days ago, active today!)
  const p2Start = daysAgo(3);
  const p2End = daysFromNow(3);
  const plan2 = await TherapyPlan.create({
    patient: patients[1]._id,
    startDate: p2Start,
    endDate: p2End,
    status: "ongoing",
    notes: "7-day Marsha Nasya for chronic sinus congestion and migraines.",
    therapies: [{ therapy: tNasya._id, durationDays: 7, costPerDay: tNasya.baseCost }],
  });

  const p2Sessions = [];
  for (let d = 0; d < 7; d++) {
    const sDate = new Date(p2Start);
    sDate.setDate(sDate.getDate() + d);
    const isPast = d < 3;
    const isToday = d === 3;
    p2Sessions.push({
      therapyPlan: plan2._id,
      therapy: tNasya._id,
      sessionDate: sDate,
      status: isPast ? "completed" : "scheduled",
      notes: isPast ? "Face steaming done with Dashamoola kashaya; 8 drops instilled per nostril." : isToday ? "Scheduled for 10:30 AM appointment." : undefined,
    });
  }
  await Session.insertMany(p2Sessions);
  const p2Total = 7 * tNasya.baseCost; // 10,500
  await Bill.create({
    therapyPlan: plan2._id,
    patient: patients[1]._id,
    totalAmount: p2Total,
    paidAmount: 6000,
    status: "partial",
  });

  // PLAN 3: Ongoing Plan (Patient 2: Aditya Singh - Virechana 7 days, started 1 day ago, active today!)
  const p3Start = daysAgo(1);
  const p3End = daysFromNow(5);
  const plan3 = await TherapyPlan.create({
    patient: patients[2]._id,
    startDate: p3Start,
    endDate: p3End,
    status: "ongoing",
    notes: "Virechana course for liver detox, digestion fire re-ignition.",
    therapies: [{ therapy: tVirechana._id, durationDays: 7, costPerDay: tVirechana.baseCost }],
  });

  const p3Sessions = [];
  for (let d = 0; d < 7; d++) {
    const sDate = new Date(p3Start);
    sDate.setDate(sDate.getDate() + d);
    const isPast = d < 1;
    const isToday = d === 1;
    p3Sessions.push({
      therapyPlan: plan3._id,
      therapy: tVirechana._id,
      sessionDate: sDate,
      status: isPast ? "completed" : "scheduled",
      notes: isPast ? "Snehapana initiated with Kalyanaka Ghrita (30ml)." : isToday ? "Today: Snehapana Day 2 (50ml). Scheduled 11:30 AM." : undefined,
    });
  }
  await Session.insertMany(p3Sessions);
  const p3Total = 7 * tVirechana.baseCost; // 14,000
  await Bill.create({
    therapyPlan: plan3._id,
    patient: patients[2]._id,
    totalAmount: p3Total,
    paidAmount: 8000,
    status: "partial",
  });

  // PLAN 4: Ongoing Plan (Patient 3: Meenakshi Sundaram - Basti 8 days, active today on Day 4!)
  const p4Start = daysAgo(4);
  const p4End = daysFromNow(3);
  const plan4 = await TherapyPlan.create({
    patient: patients[3]._id,
    startDate: p4Start,
    endDate: p4End,
    status: "ongoing",
    notes: "Kala Basti protocol for bilateral knee pain and joint immobility.",
    therapies: [{ therapy: tBasti._id, durationDays: 8, costPerDay: tBasti.baseCost }],
  });

  const p4Sessions = [];
  for (let d = 0; d < 8; d++) {
    const sDate = new Date(p4Start);
    sDate.setDate(sDate.getDate() + d);
    const isPast = d < 4;
    p4Sessions.push({
      therapyPlan: plan4._id,
      therapy: tBasti._id,
      sessionDate: sDate,
      status: isPast ? "completed" : "scheduled",
      notes: isPast ? "Sneha basti with Sahacharadi taila. Knee mobility improving." : d === 4 ? "Scheduled for 3:00 PM session." : undefined,
    });
  }
  await Session.insertMany(p4Sessions);
  const p4Total = 8 * tBasti.baseCost; // 14,400
  await Bill.create({
    therapyPlan: plan4._id,
    patient: patients[3]._id,
    totalAmount: p4Total,
    paidAmount: p4Total,
    status: "paid",
  });

  // PLAN 5: Planned Future Plan (Patient 4: Kavita Deshmukh - Vamana 5 days, starting in 2 days)
  const p5Start = daysFromNow(2);
  const p5End = daysFromNow(6);
  const plan5 = await TherapyPlan.create({
    patient: patients[4]._id,
    startDate: p5Start,
    endDate: p5End,
    status: "planned",
    notes: "Vamana cleansing for Kapha metabolic balance.",
    therapies: [{ therapy: tVamana._id, durationDays: 5, costPerDay: tVamana.baseCost }],
  });

  const p5Sessions = [];
  for (let d = 0; d < 5; d++) {
    const sDate = new Date(p5Start);
    sDate.setDate(sDate.getDate() + d);
    p5Sessions.push({
      therapyPlan: plan5._id,
      therapy: tVamana._id,
      sessionDate: sDate,
      status: "scheduled",
      notes: `Scheduled session ${d + 1}`,
    });
  }
  await Session.insertMany(p5Sessions);
  const p5Total = 5 * tVamana.baseCost; // 12,500
  await Bill.create({
    therapyPlan: plan5._id,
    patient: patients[4]._id,
    totalAmount: p5Total,
    paidAmount: 3000,
    status: "partial",
  });

  // PLAN 6: Planned Future Plan (Patient 5: Pradeep Nambiar - Raktamokshana 3 days, starting next week)
  const p6Start = daysFromNow(5);
  const p6End = daysFromNow(7);
  const plan6 = await TherapyPlan.create({
    patient: patients[5]._id,
    startDate: p6Start,
    endDate: p6End,
    status: "planned",
    notes: "Jalaukavacharana (leech therapy) for localized chronic eczema.",
    therapies: [{ therapy: tRaktamokshana._id, durationDays: 3, costPerDay: tRaktamokshana.baseCost }],
  });

  const p6Sessions = [];
  for (let d = 0; d < 3; d++) {
    const sDate = new Date(p6Start);
    sDate.setDate(sDate.getDate() + d);
    p6Sessions.push({
      therapyPlan: plan6._id,
      therapy: tRaktamokshana._id,
      sessionDate: sDate,
      status: "scheduled",
      notes: `Scheduled session ${d + 1}`,
    });
  }
  await Session.insertMany(p6Sessions);
  const p6Total = 3 * tRaktamokshana.baseCost; // 6,600
  await Bill.create({
    therapyPlan: plan6._id,
    patient: patients[5]._id,
    totalAmount: p6Total,
    paidAmount: 0,
    status: "unpaid",
  });

  console.log("✓ Seeded 6 comprehensive Therapy Plans, all associated Daily Sessions, and Invoices!");

  // Quick summary report
  const totalBills = await Bill.find({});
  const totalRev = totalBills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = totalBills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalSessions = await Session.countDocuments({});

  console.log("\n=======================================================");
  console.log("🌿 PANCHVEDA DEMO DATABASE SEEDED SUCCESSFULLY!");
  console.log("=======================================================");
  console.log(`• Staff Accounts:    5 (Admin, 2 Doctors, 2 Therapists)`);
  console.log(`• Core Therapies:    5 Classical Panchakarma Procedures`);
  console.log(`• Patients:          8 Registered Patients with full records`);
  console.log(`• Therapy Plans:     6 (Completed, Ongoing, and Planned)`);
  console.log(`• Therapy Sessions:  ${totalSessions} Scheduled & Completed Sessions`);
  console.log(`• Invoiced Revenue:  ₹${totalRev.toLocaleString("en-IN")}`);
  console.log(`• Collected Revenue: ₹${totalPaid.toLocaleString("en-IN")}`);
  console.log(`• Outstanding Dues:  ₹${(totalRev - totalPaid).toLocaleString("en-IN")}`);
  console.log("=======================================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

seedData().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
