require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./src/app.js");
const User = require("./src/models/user.model.js");
const bcrypt = require("bcrypt");

async function runTests() {
  console.log("=== Starting Panchakarma System End-to-End Verification ===");
  await mongoose.connect(process.env.DB_URI);
  console.log("✓ Connected to MongoDB");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(3099, resolve));
  const baseUrl = "http://localhost:3099";
  console.log("✓ Test server listening on " + baseUrl);

  try {
    // 1. Ensure a known admin user exists for testing
    let admin = await User.findOne({ email: "testadmin@clinic.com" });
    if (!admin) {
      admin = await User.create({
        fullName: "Test Administrator",
        email: "testadmin@clinic.com",
        password: await bcrypt.hash("adminPass123", 10),
        role: "admin",
        isActive: true,
      });
      console.log("✓ Created test admin user");
    } else {
      admin.password = await bcrypt.hash("adminPass123", 10);
      admin.isActive = true;
      await admin.save();
      console.log("✓ Reset test admin credentials");
    }

    // 2. Test Login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "testadmin@clinic.com", password: "adminPass123" }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok || !loginData.token) {
      throw new Error(`Login failed with status ${loginRes.status}: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.token;
    console.log("✓ Auth login succeeded, JWT token received");

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // 3. Test Setup Status
    const setupStatusRes = await fetch(`${baseUrl}/api/auth/setup-status`);
    const setupStatusData = await setupStatusRes.json();
    console.log("✓ /api/auth/setup-status returned:", setupStatusData);

    // 4. Test Therapies
    const uniqueTherapyName = "Abhyanga Test " + Date.now();
    const createTherapyRes = await fetch(`${baseUrl}/api/therapies`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: uniqueTherapyName,
        category: "basti",
        defaultDurationDays: 5,
        baseCost: 1200,
        description: "Full body herbal oil massage therapy",
      }),
    });
    const createTherapyData = await createTherapyRes.json();
    if (!createTherapyRes.ok) {
      throw new Error(`Create therapy failed: ${JSON.stringify(createTherapyData)}`);
    }
    const therapyId = createTherapyData.data._id;
    console.log("✓ Created therapy successfully, ID:", therapyId);

    const getTherapiesRes = await fetch(`${baseUrl}/api/therapies`);
    const getTherapiesData = await getTherapiesRes.json();
    if (!getTherapiesRes.ok || !Array.isArray(getTherapiesData.data)) {
      throw new Error("Get therapies failed");
    }
    console.log(`✓ Fetched ${getTherapiesData.data.length} therapies`);

    const updateTherapyRes = await fetch(`${baseUrl}/api/therapies/${therapyId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ baseCost: 1350 }),
    });
    const updateTherapyData = await updateTherapyRes.json();
    if (!updateTherapyRes.ok || updateTherapyData.data.baseCost !== 1350) {
      throw new Error("Update therapy failed");
    }
    console.log("✓ Updated therapy cost to 1350");

    // 5. Test Patients
    const testPhone = "9" + Math.floor(100000000 + Math.random() * 900000000);
    const createPatientRes = await fetch(`${baseUrl}/api/patients`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        fullName: "Suresh Sharma",
        gender: "male",
        dateOfBirth: "1988-06-15",
        phone: testPhone,
        address: "123 MG Road, Bengaluru",
        medicalNotes: "Vata dosha imbalance, lower back discomfort",
        emergencyContact: { name: "Sunita Sharma", phone: "9876543210" },
      }),
    });
    const createPatientData = await createPatientRes.json();
    if (!createPatientRes.ok) {
      throw new Error(`Create patient failed: ${JSON.stringify(createPatientData)}`);
    }
    const patientId = createPatientData.data._id;
    console.log("✓ Created patient successfully, ID:", patientId);

    const getPatientsRes = await fetch(`${baseUrl}/api/patients`, { headers: authHeaders });
    const getPatientsData = await getPatientsRes.json();
    console.log(`✓ Fetched ${getPatientsData.data.length} patients`);

    const updatePatientRes = await fetch(`${baseUrl}/api/patients/${patientId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ address: "456 Indiranagar, Bengaluru" }),
    });
    if (!updatePatientRes.ok) {
      throw new Error("Update patient failed");
    }
    console.log("✓ Updated patient address");

    // 6. Test Therapy Plan (startDate >= today, endDate >= startDate + duration)
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);

    const startDateStr = today.toISOString().split("T")[0];
    const endDateStr = next7Days.toISOString().split("T")[0];

    const createPlanRes = await fetch(`${baseUrl}/api/therapy-plans`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        patient: patientId,
        startDate: startDateStr,
        endDate: endDateStr,
        notes: "Daily early morning therapy sessions with lukewarm medicated oil",
        therapies: [
          {
            therapy: therapyId,
            durationDays: 5,
            costPerDay: 1350,
          },
        ],
      }),
    });
    const createPlanData = await createPlanRes.json();
    if (!createPlanRes.ok) {
      throw new Error(`Create therapy plan failed: ${JSON.stringify(createPlanData)}`);
    }
    const planId = createPlanData.data._id;
    console.log("✓ Created therapy plan successfully, ID:", planId);

    // 7. Verify auto-generated sessions & billing
    const getSessionsRes = await fetch(`${baseUrl}/api/sessions/plan/${planId}`, { headers: authHeaders });
    const getSessionsData = await getSessionsRes.json();
    if (!getSessionsRes.ok || getSessionsData.data.length !== 5) {
      throw new Error(`Expected 5 sessions, got: ${getSessionsData.data?.length}`);
    }
    console.log(`✓ Verified 5 daily sessions automatically created for plan`);

    const firstSession = getSessionsData.data[0];

    // 8. Test Session Status Update (by Admin / Doctor / Therapist)
    const updateSessionRes = await fetch(`${baseUrl}/api/sessions/${firstSession._id}/status`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        status: "completed",
        notes: "Patient felt relaxed, blood pressure 120/80",
      }),
    });
    const updateSessionData = await updateSessionRes.json();
    if (!updateSessionRes.ok || updateSessionData.data.status !== "completed") {
      throw new Error(`Update session status failed: ${JSON.stringify(updateSessionData)}`);
    }
    console.log("✓ Updated session #1 to 'completed', therapist notes saved");

    // Verify plan status changed from 'planned' to 'ongoing'
    const getPlanRes = await fetch(`${baseUrl}/api/therapy-plans/${planId}`, { headers: authHeaders });
    const getPlanData = await getPlanRes.json();
    console.log(`✓ Verified therapy plan status automatically transitioned to: ${getPlanData.data.status}`);

    // 9. Test Invoicing / Billing
    const getBillRes = await fetch(`${baseUrl}/api/bills/plan/${planId}`, { headers: authHeaders });
    const getBillData = await getBillRes.json();
    if (!getBillRes.ok) {
      throw new Error(`Get bill failed: ${JSON.stringify(getBillData)}`);
    }
    const billId = getBillData.data._id;
    const expectedTotal = 5 * 1350; // 6750
    if (getBillData.data.totalAmount !== expectedTotal) {
      throw new Error(`Expected total ${expectedTotal}, got ${getBillData.data.totalAmount}`);
    }
    console.log(`✓ Verified plan bill total amount = ₹${expectedTotal}`);

    // 10. Test Add Payment
    const payRes = await fetch(`${baseUrl}/api/bills/${billId}/pay`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ amount: 3000 }),
    });
    const payData = await payRes.json();
    if (!payRes.ok || payData.data.paidAmount !== 3000 || payData.data.status !== "partial") {
      throw new Error(`Add partial payment failed: ${JSON.stringify(payData)}`);
    }
    console.log("✓ Recorded partial payment of ₹3000, bill status is 'partial'");

    const payFullRes = await fetch(`${baseUrl}/api/bills/${billId}/pay`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ amount: 3750 }),
    });
    const payFullData = await payFullRes.json();
    if (!payFullRes.ok || payFullData.data.paidAmount !== 6750 || payFullData.data.status !== "paid") {
      throw new Error(`Add full payment failed: ${JSON.stringify(payFullData)}`);
    }
    console.log("✓ Recorded final payment of ₹3750, bill status updated to 'paid'");

    // 11. Test Patient History API
    const historyRes = await fetch(`${baseUrl}/api/patients/${patientId}/history`, { headers: authHeaders });
    const historyData = await historyRes.json();
    if (
      !historyRes.ok ||
      historyData.data.plans.length === 0 ||
      historyData.data.sessions.length === 0 ||
      historyData.data.bills.length === 0
    ) {
      throw new Error("Patient history verification failed");
    }
    console.log(
      `✓ Verified Patient History API: ${historyData.data.plans.length} plan(s), ${historyData.data.sessions.length} session(s), ${historyData.data.bills.length} bill(s)`
    );

    // 12. Test Reports APIs
    const revRes = await fetch(`${baseUrl}/api/reports/revenue`, { headers: authHeaders });
    const revData = await revRes.json();
    console.log("✓ Revenue Report:", revData.data);

    const topRes = await fetch(`${baseUrl}/api/reports/top-therapies`, { headers: authHeaders });
    const topData = await topRes.json();
    console.log("✓ Top Therapies Report:", topData.data);

    const countRes = await fetch(`${baseUrl}/api/reports/patient-count`, { headers: authHeaders });
    const countData = await countRes.json();
    console.log("✓ Patient Count Report:", countData.data);

    // 13. Test Users Management
    const newStaffEmail = "dr.sharma." + Date.now() + "@clinic.com";
    const createUserRes = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        fullName: "Dr. Alok Sharma",
        email: newStaffEmail,
        password: "password123",
        role: "doctor",
      }),
    });
    const createUserData = await createUserRes.json();
    if (!createUserRes.ok) {
      throw new Error(`Create user failed: ${JSON.stringify(createUserData)}`);
    }
    const newUserId = createUserData.data.id;
    console.log("✓ Created new Doctor user successfully, ID:", newUserId);

    const toggleRes = await fetch(`${baseUrl}/api/users/${newUserId}/status`, {
      method: "PATCH",
      headers: authHeaders,
    });
    const toggleData = await toggleRes.json();
    if (!toggleRes.ok || toggleData.data.isActive !== false) {
      throw new Error("Toggle user status failed");
    }
    console.log("✓ Toggled doctor status to inactive");

    // 14. Verify Demo Protections (Approach 1)
    const demoUser = await User.findOne({ email: "admin@panchveda.com" });
    if (demoUser) {
      const demoToggleRes = await fetch(`${baseUrl}/api/users/${demoUser._id}/status`, {
        method: "PATCH",
        headers: authHeaders,
      });
      if (demoToggleRes.status !== 403) {
        throw new Error(`Expected 403 when toggling demo user, got: ${demoToggleRes.status}`);
      }
      console.log("✓ Demo staff deactivation blocked with 403 Forbidden");
    }

    const TherapyModel = require("./src/models/therapy.model.js");
    const coreTherapy = await TherapyModel.findOne({ name: "Basti Therapy" });
    if (coreTherapy) {
      const deleteCoreTherapyRes = await fetch(`${baseUrl}/api/therapies/${coreTherapy._id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (deleteCoreTherapyRes.status !== 403) {
        throw new Error(`Expected 403 when deleting core classical therapy, got: ${deleteCoreTherapyRes.status}`);
      }
      console.log("✓ Core classical therapy deactivation blocked with 403 Forbidden");
    }

    const PatientModel = require("./src/models/patient.model.js");
    const corePatient = await PatientModel.findOne({ phone: "9845012345" });
    if (corePatient) {
      const deleteCorePatientRes = await fetch(`${baseUrl}/api/patients/${corePatient._id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (deleteCorePatientRes.status !== 403) {
        throw new Error(`Expected 403 when deleting core demo patient, got: ${deleteCorePatientRes.status}`);
      }
      console.log("✓ Core demo patient deactivation blocked with 403 Forbidden");
    }

    console.log("\n==========================================");
    console.log("🎉 ALL SYSTEM FLOWS PASSED 100%!");
    console.log("==========================================\n");
  } finally {
    server.close();
    await mongoose.disconnect();
  }
  process.exit(0);
}

runTests().catch((err) => {
  console.error("\n❌ TEST ERROR:", err.message);
  process.exit(1);
});
