// MindMap Application Logic - Senior Full-Stack Simulation

// 1. Initial Mock Data
let patients = [
    { id: 1, hn: "HN-001", name: "นาย สมชาย รักดี", dx: "F20.0 Schizophrenia", risk: "red", smiV: "SMI-V 1", followup: "รายสัปดาห์", village: "หมู่ 3 ต.ตะเคียนเตี้ย", hospital: "รพช. บางละมุง", lat: 13.0185, lng: 100.9632, lastVisit: "2026-07-02", nextVisit: "2026-07-09", missedAppointments: 3, medAdherence: "หยุดยาเอง", notes: "คนไข้อาศัยอยู่กับมารดาสูงอายุ มีพฤติกรรมก้าวร้าวเมื่อขาดยา", followups: [] },
    { id: 2, hn: "HN-002", name: "นางสาว วิภา ใจงาม", dx: "F31.1 Bipolar Affective Disorder", risk: "yellow", smiV: "SMI-V 4", followup: "รายเดือน", village: "หมู่ 1 ต.ตะเคียนเตี้ย", hospital: "รพช. บางละมุง", lat: 13.0241, lng: 100.9514, lastVisit: "2026-06-11", nextVisit: "2026-07-11", missedAppointments: 0, medAdherence: "สม่ำเสมอ", notes: "สามารถเข้าสังคมและทำงานได้ปกติ มีญาติช่วยดูแลจัดการยา", followups: [] },
    { id: 3, hn: "HN-003", name: "นาย เกรียงไกร มุ่งมั่น", dx: "F32.2 Major Depressive Disorder", risk: "green", smiV: "นัยยะซับซ้อน", followup: "ราย 3 เดือน", village: "หมู่ 4 ต.ตะเคียนเตี้ย", hospital: "รพช. ศรีราชา", lat: 13.0092, lng: 100.9745, lastVisit: "2026-05-15", nextVisit: "2026-08-15", missedAppointments: 1, medAdherence: "สม่ำเสมอ", notes: "พบปะพนักงานสังคมสงเคราะห์ตามกำหนด มีภาวะกังวลเล็กน้อย", followups: [] },
    { id: 4, hn: "HN-004", name: "นาง สมศรี มีธรรม", dx: "F20.3 Undifferentiated Schizophrenia", risk: "red", smiV: "SMI-V 2", followup: "รายสัปดาห์", village: "หมู่ 2 ต.บางละมุง", hospital: "รพช. บางละมุง", lat: 13.0315, lng: 100.9328, lastVisit: "2025-12-10", nextVisit: "2026-01-10", missedAppointments: 5, medAdherence: "หยุดยาเอง", notes: "ขาดการติดต่อกับรพ.สต. นานเกิน 6 เดือน เพื่อนบ้านแจ้งว่าไม่ยอมทานยา", followups: [] },
    { id: 5, hn: "HN-005", name: "นาย มานะ อดทน", dx: "F10.2 Alcohol Dependence Syndrome", risk: "yellow", smiV: "ใช้สุรา", followup: "รายเดือน", village: "หมู่ 5 ต.บางละมุง", hospital: "รพช. สัตหีบ", lat: 13.0428, lng: 100.9251, lastVisit: "2026-06-25", nextVisit: "2026-07-25", missedAppointments: 2, medAdherence: "ไม่ทราบแน่ชัด", notes: "มีประวัติดื่มแอลกอฮอล์ร่วมด้วย เสี่ยงต่อการขาดยาและกระตุ้นอาการจิตเวช", followups: [] },
    { id: 6, hn: "HN-006", name: "นางสาว ณิชาภา ร่มเย็น", dx: "F25.0 Schizoaffective Disorder", risk: "green", smiV: "SMI-V 4", followup: "ราย 3 เดือน", village: "หมู่ 3 ต.บางละมุง", hospital: "รพช. ศรีราชา", lat: 13.0371, lng: 100.9405, lastVisit: "2026-04-10", nextVisit: "2026-07-10", missedAppointments: 0, medAdherence: "สม่ำเสมอ", notes: "อาการคงที่ เข้าฝึกอาชีพที่ศูนย์ฟื้นฟูของชุมชน", followups: [] },
    { id: 7, hn: "HN-007", name: "นาย อุดม อุดมสุข", dx: "F22.0 Delusional Disorder", risk: "red", smiV: "SMI-V 3", followup: "รายสัปดาห์", village: "หมู่ 2 ต.ตะเคียนเตี้ย", hospital: "รพช. บางละมุง", lat: 13.0118, lng: 100.9572, lastVisit: "2026-06-30", nextVisit: "2026-07-07", missedAppointments: 2, medAdherence: "หยุดยาเอง", notes: "มีอาการระแวงคนรอบข้างสะสม ปฏิเสธการเข้าพบแพทย์", followups: [] },
    { id: 8, hn: "HN-008", name: "นาง จันทร์เพ็ญ สว่างจิตร", dx: "F31.3 Bipolar, Depressed Episode", risk: "yellow", smiV: "ผู้ดูแลสูงอายุ/อยู่คนเดียว", followup: "รายเดือน", village: "หมู่ 4 ต.บางละมุง", hospital: "รพช. สัตหีบ", lat: 13.0489, lng: 100.9389, lastVisit: "2026-06-20", nextVisit: "2026-07-20", missedAppointments: 1, medAdherence: "สม่ำเสมอ", notes: "อาการซึมเศร้าเด่น ญาติคอยดูแลใกล้ชิด", followups: [] },
    { id: 9, hn: "HN-009", name: "นาย นิพนธ์ รักษ์ดี", dx: "F20.0 Schizophrenia", risk: "green", smiV: "SMI-V 4", followup: "ราย 6 เดือน", village: "หมู่ 6 ต.ตะเคียนเตี้ย", hospital: "รพช. ศรีราชา", lat: 13.0035, lng: 100.9852, lastVisit: "2026-06-01", nextVisit: "2026-12-01", missedAppointments: 0, medAdherence: "สม่ำเสมอ", notes: "อาการสงบมานานกว่า 2 ปี รับยาต่อเนื่องที่รพ.สต.", followups: [] },
    { id: 10, hn: "HN-010", name: "นางสาว สุดา สายสมร", dx: "F20.0 Schizophrenia", risk: "red", smiV: "SMI-V 2", followup: "รายสัปดาห์", village: "หมู่ 1 ต.บางละมุง", hospital: "รพช. บางละมุง", lat: 13.0394, lng: 100.9214, lastVisit: "2026-01-05", nextVisit: "2026-02-05", missedAppointments: 4, medAdherence: "หยุดยาเอง", notes: "ขาดยาสะสมเกิน 5 เดือน ผู้ดูแลป่วยติดเตียงดูแลไม่ไหว", followups: [] }
];

const clinics = [
    { name: "รพ.สต. ตะเคียนเตี้ย", lat: 13.0162, lng: 100.9610 },
    { name: "รพ.สต. บางละมุง", lat: 13.0385, lng: 100.9312 }
];

// Initialize Audit Logs in localStorage if not exists
if (!localStorage.getItem("mindmap_audit_logs")) {
    const initialLogs = [
        { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), username: "system_daemon", role: "system", event: "SYSTEM_INIT", hn: "-", details: "เริ่มทำงานระบบระบบและเชื่อมต่อฐานข้อมูล PDPA Shield v1.0", ip: "127.0.0.1" },
        { timestamp: new Date(Date.now() - 3600000).toISOString(), username: "nurse_somjai", role: "doctor", event: "VIEW_MAP", hn: "-", details: "เข้าใช้งานหน้าแผนที่ติดตามผู้ป่วยประจำสัปดาห์", ip: "192.168.1.45" }
    ];
    localStorage.setItem("mindmap_audit_logs", JSON.stringify(initialLogs));
}

// 2. Global State Variables
let currentRole = "doctor";
let privacyShieldActive = true;
let activeView = "mapView";
let map = null;
let markersGroup = null;
let activeCharts = {};

// 3. Document Ready Setup
document.addEventListener("DOMContentLoaded", () => {
    // Check Authentication
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        const greetingEl = document.getElementById('userGreeting');
        if (greetingEl) {
            greetingEl.textContent = `สวัสดีคุณ ${user.name}`;
            greetingEl.style.color = '#fff';
            greetingEl.style.fontWeight = '500';
            greetingEl.style.marginLeft = '1rem';
        }
    }

    // Initialise Lucide Icons
    lucide.createIcons();

    // Load state from local storage or set defaults
    loadAuditLogs();
    setupEventListeners();
    applyRbacRules();
    runSessionTimer();

    // Map initialization
    initLeafletMap();

    // Initial table render
    renderPatientTable();
    updateGlobalAlertBadge();
    
    // Automatically generate security audits for initial view
    writeAuditLog("SYSTEM", "VIEW_MAP", "-", "เข้าชมแดชบอร์ดแผนที่หลักภายใต้ความคุ้มครองข้อมูล");
});

// 4. Session Countdown Timer (Simulation of auto logout)
function runSessionTimer() {
    let timeLeft = 15 * 60; // 15 minutes
    const timerElement = document.getElementById("sessionTimer");
    
    const interval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            alert("หมดอายุเซสชันระบบความปลอดภัย (15 นาที) กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
            window.location.reload();
        }
    }, 1000);
}

// 5. Event Listeners Setup
function setupEventListeners() {
    // Logout Button
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout && typeof logout === 'function') {
        btnLogout.addEventListener("click", () => {
            logout();
        });
    }

    // Role Selector Switcher
    document.getElementById("roleSelector").addEventListener("change", (e) => {
        currentRole = e.target.value;
        writeAuditLog("USER", "ROLE_CHANGE", "-", `เปลี่ยนสิทธิ์การเข้าถึงเป็น: ${e.target.options[e.target.selectedIndex].text}`);
        applyRbacRules();
    });

    // Privacy Shield Toggle Button
    const privacyToggle = document.getElementById("privacyShieldToggleBtn");
    privacyToggle.addEventListener("click", () => {
        privacyShieldActive = !privacyShieldActive;
        if (privacyShieldActive) {
            privacyToggle.classList.add("active");
            privacyToggle.querySelector("span").textContent = "Privacy Shield: ON";
            document.getElementById("shieldIcon").setAttribute("data-lucide", "eye-off");
        } else {
            privacyToggle.classList.remove("active");
            privacyToggle.querySelector("span").textContent = "Privacy Shield: OFF";
            document.getElementById("shieldIcon").setAttribute("data-lucide", "eye");
        }
        lucide.createIcons();
        
        writeAuditLog("USER", "TOGGLE_SHIELD", "-", `เปลี่ยนสถานะ Privacy Shield เป็น: ${privacyShieldActive ? "เปิดใช้งาน (บิดเบือนพิกัด)" : "ปิดการใช้งาน (พิกัดจริง)"}`);
        
        // Refresh views affected by privacy settings
        updateMapMarkers();
        renderPatientTable();
    });

    // Sidebar navigation items
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetView = item.getAttribute("data-view");
            switchView(targetView);
        });
    });

    // Table search inputs & filters
    document.getElementById("patientSearchInput").addEventListener("input", renderPatientTable);
    document.getElementById("filterRiskLevel").addEventListener("change", renderPatientTable);
    document.getElementById("filterFollowUp").addEventListener("change", renderPatientTable);
    document.getElementById("filterSmiV").addEventListener("change", renderPatientTable);

    // Map filters
    document.getElementById("mapFilterRisk").addEventListener("change", updateMapMarkers);
    document.getElementById("mapFilterStatus").addEventListener("change", updateMapMarkers);

    // Audit Log Filters
    document.getElementById("auditSearchInput").addEventListener("input", renderAuditLogs);
    document.getElementById("auditFilterAction").addEventListener("change", renderAuditLogs);

    // Settings Security Configurations
    document.getElementById("settingJitterToggle").addEventListener("change", (e) => {
        // Toggle Jitter setting
        privacyShieldActive = e.target.checked;
        const shieldBtn = document.getElementById("privacyShieldToggleBtn");
        if (privacyShieldActive) {
            shieldBtn.classList.add("active");
            shieldBtn.querySelector("span").textContent = "Privacy Shield: ON";
        } else {
            shieldBtn.classList.remove("active");
            shieldBtn.querySelector("span").textContent = "Privacy Shield: OFF";
        }
        updateMapMarkers();
        renderPatientTable();
    });

    // Patient Form Submissions (Create/Edit)
    document.getElementById("btnAddNewPatient").addEventListener("click", () => {
        if (currentRole !== "doctor") {
            alert("ปฏิเสธการเข้าถึง: เฉพาะแพทย์/พยาบาลเท่านั้นที่สามารถลงทะเบียนผู้ป่วยจิตเวชใหม่ได้");
            return;
        }
        openPatientModal();
    });

    document.getElementById("btnModalClose").addEventListener("click", closePatientModal);
    document.getElementById("btnFormCancel").addEventListener("click", closePatientModal);
    document.getElementById("patientForm").addEventListener("submit", savePatientForm);

    // Print & Export functions
    document.getElementById("btnExportPatients").addEventListener("click", () => triggerPrintExport("ทะเบียนคนไข้จิตเวชในระบบ"));
    document.getElementById("btnStatsExport").addEventListener("click", () => triggerPrintExport("รายงานสถิติสุขภาพจิตรวม"));

    // PDPA Rights Request Handling
    document.getElementById("pdpaRequestForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const hn = document.getElementById("pdpaPatientHn").value;
        const right = document.getElementById("pdpaRightType").value;
        const details = document.getElementById("pdpaDetails").value;

        // Add to audit trail
        writeAuditLog("USER", "PDPA_REQUEST", hn, `รับคำร้องขอสิทธิ์ PDPA ประเภท [${right}] รายละเอียด: ${details}`);
        alert(`บันทึกการใช้สิทธิ์ของคนไข้และส่งต่อแจ้งเตือนเจ้าหน้าที่ DPO สำเร็จ (HN: ${hn})`);
        
        // Reset form
        document.getElementById("pdpaRequestForm").reset();
    });

    // Follow-up Form Submissions
    document.getElementById("btnFollowClose").addEventListener("click", closeFollowUpModal);
    document.getElementById("btnFollowCancel").addEventListener("click", closeFollowUpModal);
    document.getElementById("followUpForm").addEventListener("submit", saveFollowUpForm);
}

// 6. View Switcher Logic
function switchView(viewId) {
    // Audit view switch event
    writeAuditLog("USER", "NAVIGATE", "-", `เปลี่ยนหน้าจอเป็น: ${viewId}`);

    // Update active nav link styling
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        if (item.getAttribute("data-view") === viewId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Toggle active view container
    const views = document.querySelectorAll(".dashboard-view");
    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.add("active");
        } else {
            view.classList.remove("active");
        }
    });

    activeView = viewId;

    // Handle view-specific initializations
    if (viewId === "mapView") {
        setTimeout(() => {
            if (map) map.invalidateSize();
        }, 100);
    } else if (viewId === "statsView") {
        initCharts();
    } else if (viewId === "alertCenterView") {
        renderAlertCenter();
    } else if (viewId === "auditLogView") {
        renderAuditLogs();
    }
}

// 7. Role-Based Access Rules Enforcer (The core security mechanism)
function applyRbacRules() {
    const infoTitle = document.getElementById("roleInfoTitle");
    const infoDesc = document.getElementById("roleInfoDesc");
    const encryptionStatus = document.getElementById("encryptionStatus");

    // Hide or show features depending on the active role
    
    // Default visibility selectors
    const btnAddNew = document.getElementById("btnAddNewPatient");
    const privacyShieldToggleWrapper = document.getElementById("privacyShieldToggleWrapper");

    // Reset settings toggles and navigation options
    document.getElementById("navMap").style.display = "flex";
    document.getElementById("navPatients").style.display = "flex";
    document.getElementById("navAlerts").style.display = "flex";
    document.getElementById("navStats").style.display = "flex";
    document.getElementById("navAudits").style.display = "flex";
    document.getElementById("navSettings").style.display = "flex";

    btnAddNew.style.display = "inline-flex";
    privacyShieldToggleWrapper.style.display = "block";

    switch(currentRole) {
        case "doctor":
            infoTitle.textContent = "แพทย์ / พยาบาล";
            infoDesc.textContent = "เข้าถึงข้อมูลทางคลินิก (วินิจฉัย ICD-10) และประวัติการรักษาทั้งหมด แผนที่เป็นพิกัดหมู่บ้าน";
            break;
            
        case "social_worker":
            infoTitle.textContent = "นักสังคมสงเคราะห์";
            infoDesc.textContent = "จำกัดการเข้าถึงข้อมูลคลินิก (วินิจฉัย ICD-10 จะถูกปกปิด) เข้าถึงข้อมูลสังคมและการติดตามได้ปกติ แผนที่ระดับหมู่บ้าน";
            btnAddNew.style.display = "none";
            document.getElementById("navAudits").style.display = "none";
            break;
            
        case "jhw":
            infoTitle.textContent = "อสม. / JHW";
            infoDesc.textContent = "เห็นเฉพาะข้อมูลนัดหมาย ขาดนัด และแจ้งเตือนในความรับผิดชอบของตนเอง ไม่แสดงข้อมูลทางคลินิกหรือประวัติเชิงลึกใด ๆ";
            btnAddNew.style.display = "none";
            document.getElementById("navStats").style.display = "none";
            document.getElementById("navAudits").style.display = "none";
            break;
            
        case "manager":
            infoTitle.textContent = "ผู้บริหารสาธารณสุข";
            infoDesc.textContent = "เข้าถึงเฉพาะสถิติและรายงานสรุประดับเขตพื้นที่เพื่อวางแผนเชิงนโยบาย ไม่สามารถสืบค้นประวัติรายบุคคลหรือข้อมูลระบุตัวตนใด ๆ";
            btnAddNew.style.display = "none";
            privacyShieldToggleWrapper.style.display = "none";
            
            // Limit view access
            document.getElementById("navMap").style.display = "none";
            document.getElementById("navPatients").style.display = "none";
            document.getElementById("navAlerts").style.display = "none";
            document.getElementById("navAudits").style.display = "none";
            
            // Redirect to statistics view if currently in a restricted page
            if (activeView !== "statsView" && activeView !== "settingsView") {
                switchView("statsView");
            }
            break;
            
        case "admin":
            infoTitle.textContent = "IT Administrator";
            infoDesc.textContent = "ดูแลและควบคุมความปลอดภัยของระบบ ตรวจสอบประวัติการเข้าถึงข้อมูล (Audit Log) ไม่มีสิทธิ์เข้าถึงข้อมูลผู้ป่วย";
            btnAddNew.style.display = "none";
            privacyShieldToggleWrapper.style.display = "none";

            // Limit view access
            document.getElementById("navMap").style.display = "none";
            document.getElementById("navPatients").style.display = "none";
            document.getElementById("navAlerts").style.display = "none";
            document.getElementById("navStats").style.display = "none";
            
            if (activeView !== "auditLogView" && activeView !== "settingsView") {
                switchView("auditLogView");
            }
            break;
    }

    // Force redraw layout
    renderPatientTable();
    updateMapMarkers();
    updateGlobalAlertBadge();
    
    // Change encryption tag visually to represent protection status
    if (currentRole === "doctor") {
        encryptionStatus.innerHTML = `<i data-lucide="unlock"></i> DATA DECRYPTED`;
        encryptionStatus.className = "security-badge encryption decrypted";
    } else {
        encryptionStatus.innerHTML = `<i data-lucide="lock"></i> AES-256 ENCRYPTED`;
        encryptionStatus.className = "security-badge encryption";
    }
    lucide.createIcons();
}

// 8. Privacy Data Masking Helper Functions
function maskName(name) {
    if (currentRole === "doctor" || currentRole === "social_worker") {
        return name;
    } else if (currentRole === "jhw") {
        // Return initials
        const parts = name.split(" ");
        const prefix = parts[0] || ""; // นาย/นาง
        const firstName = parts[1] || "";
        const lastName = parts[2] || "";
        return `${prefix} ${firstName} ${lastName.charAt(0) || ""}.*`;
    } else {
        return "ผู้ป่วยไม่ระบุตัวตน (PDPA Protected)";
    }
}

function maskDx(dx) {
    if (currentRole === "doctor") {
        return dx;
    } else {
        return "🔒 ปกปิดข้อมูลอ่อนไหว (Sensitive Data)";
    }
}

// 9. MAP CONTROLLER (Leaflet & Jittering System)
function initLeafletMap() {
    const defaultCenter = [13.025, 100.950]; // Centered near Bang Lamung / Takian Tia
    
    try {
        // Create leaflet map inside #map container
        map = L.map('map', {
            center: defaultCenter,
            zoom: 13
        });

        // Add sleek map layer matching design (CartoDB Dark Matter / Voyager)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        markersGroup = L.layerGroup().addTo(map);

        // Render facilities
        clinics.forEach(clinic => {
            const clinicIcon = L.divIcon({
                html: `<div class="clinic-marker-icon">🏥</div>`,
                className: 'custom-div-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            L.marker([clinic.lat, clinic.lng], { icon: clinicIcon })
                .addTo(map)
                .bindPopup(`<strong>${clinic.name}</strong><br>สถานพยาบาลหลักในพื้นที่`);
        });

        updateMapMarkers();
    } catch (e) {
        console.error("Leaflet mapping initialization failed, falling back to SVG mock layout", e);
        document.getElementById("map").style.display = "none";
        document.getElementById("mapFallback").style.display = "flex";
        renderMockMapCanvas();
    }
}

// Coordinate Jittering Engine (Ensuring Privacy Shield compliance)
function getCoordinates(patient) {
    if (privacyShieldActive) {
        // Reproducible offset based on patient ID so points don't drift each render
        // Multiplier of 0.0035 translates roughly to 250 - 350 meters shift
        const offsetLat = Math.sin(patient.id * 12.3) * 0.0035;
        const offsetLng = Math.cos(patient.id * 7.8) * 0.0035;
        return [patient.lat + offsetLat, patient.lng + offsetLng];
    } else {
        return [patient.lat, patient.lng];
    }
}

// Calculate the nearest healthcare clinic using the Haversine formula
function calculateNearestClinic(patient) {
    let minDistance = Infinity;
    let nearestClinic = null;

    clinics.forEach(clinic => {
        const dist = haversineDistance(patient.lat, patient.lng, clinic.lat, clinic.lng);
        if (dist < minDistance) {
            minDistance = dist;
            nearestClinic = clinic;
        }
    });

    return { clinic: nearestClinic, distance: minDistance.toFixed(2) };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Redraw patient map markers dynamically
function updateMapMarkers() {
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const riskFilter = document.getElementById("mapFilterRisk").value;
    const statusFilter = document.getElementById("mapFilterStatus").value;

    patients.forEach(patient => {
        // 1. Filter logic
        if (riskFilter !== "all" && patient.risk !== riskFilter) return;
        
        const isMissed = isMissedAppointment(patient);
        const isStopped = patient.medAdherence === "หยุดยาเอง";
        
        if (statusFilter !== "all") {
            if (statusFilter === "normal" && (isMissed || isStopped)) return;
            if (statusFilter === "missed" && !isMissed) return;
            if (statusFilter === "stopped" && !isStopped) return;
        }

        // 2. Render marker depending on coordinates (with or without Privacy Jitter)
        const coords = getCoordinates(patient);
        const color = patient.risk === "red" ? "red" : (patient.risk === "yellow" ? "orange" : "green");
        
        // Define Custom Marker Div
        const markerIcon = L.divIcon({
            html: `<div class="patient-marker-dot ${patient.risk}"></div>`,
            className: 'custom-div-icon',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker(coords, { icon: markerIcon }).addTo(markersGroup);

        // Bind interactive map popups
        marker.on("click", () => {
            selectPatientFromMap(patient);
        });
    });
}

function selectPatientFromMap(patient) {
    // Record log
    writeAuditLog("USER", "VIEW_PROFILE", patient.hn, `ตรวจสอบย่อผ่านคลิกพิกัดแผนที่ (${patient.hn})`);

    const panel = document.getElementById("quickDetailsPanel");
    const emptyState = panel.querySelector(".card-empty-state");
    const content = document.getElementById("quickDetailsContent");

    // Populate data
    document.getElementById("qdName").textContent = maskName(patient.name);
    document.getElementById("qdHn").textContent = patient.hn;
    
    // Clinical restriction logic
    const dxRow = document.getElementById("qdDxRow");
    if (currentRole === "doctor") {
        dxRow.style.display = "flex";
        document.getElementById("qdDx").textContent = patient.dx;
    } else {
        dxRow.style.display = "none";
    }

    document.getElementById("qdFollowUp").textContent = patient.followup;
    document.getElementById("qdNextAppt").textContent = formatDate(patient.nextVisit);
    
    const statusText = isMissedAppointment(patient) ? "ขาดนัดติดตามล่าช้า" : `ทานยา: ${patient.medAdherence}`;
    document.getElementById("qdStatus").textContent = statusText;

    const near = calculateNearestClinic(patient);
    document.getElementById("qdClinic").textContent = near.clinic.name;
    document.getElementById("qdDistance").textContent = `${near.distance} กม.`;

    const riskBadge = document.getElementById("qdRiskBadge");
    riskBadge.className = `badge ${patient.risk}`;
    riskBadge.textContent = patient.risk === "red" ? "ระดับสูง" : (patient.risk === "yellow" ? "ปานกลาง" : "ระดับต่ำ");

    // Setup action buttons on quick panel
    document.getElementById("btnQdViewProfile").onclick = () => {
        switchView("patientListView");
        document.getElementById("patientSearchInput").value = patient.hn;
        renderPatientTable();
    };

    // Acknowledge logic
    const btnAck = document.getElementById("btnQdAcknowledge");
    btnAck.className = "btn-secondary";
    btnAck.innerHTML = `<i data-lucide="check-circle"></i> รับทราบเคส`;
    
    btnAck.onclick = () => {
        writeAuditLog("USER", "ACK_ALERT", patient.hn, `ยืนยันรับทราบประวัติผู้ป่วย (${patient.hn}) ผ่านแผนที่ติดตาม`);
        btnAck.className = "btn-ack acknowledged";
        btnAck.innerHTML = `<i data-lucide="check"></i> ทราบแล้ว`;
        lucide.createIcons();
    };

    // Show details panel
    emptyState.style.display = "none";
    content.style.display = "flex";
    lucide.createIcons();
}

// 10. PATIENT TABLE RENDERING
function renderPatientTable() {
    const tbody = document.getElementById("patientsTableBody");
    tbody.innerHTML = "";

    const query = document.getElementById("patientSearchInput").value.toLowerCase();
    const risk = document.getElementById("filterRiskLevel").value;
    const follow = document.getElementById("filterFollowUp").value;
    const smiVFilter = document.getElementById("filterSmiV").value;

    // Filter patients
    const filtered = patients.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query) || p.hn.toLowerCase().includes(query) || p.village.toLowerCase().includes(query) || (p.hospital && p.hospital.toLowerCase().includes(query));
        const matchesRisk = risk === "all" || p.risk === risk;
        
        let matchesFollow = true;
        if (follow !== "all") {
            if (follow === "weekly" && p.followup !== "รายสัปดาห์") matchesFollow = false;
            if (follow === "monthly" && p.followup !== "รายเดือน") matchesFollow = false;
            if (follow === "quarterly" && p.followup !== "ราย 3 เดือน") matchesFollow = false;
            if (follow === "semi-annual" && p.followup !== "ราย 6 เดือน") matchesFollow = false;
        }

        const matchesSmiV = smiVFilter === "all" || (p.smiV || "") === smiVFilter;

        return matchesQuery && matchesRisk && matchesFollow && matchesSmiV;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted);">ไม่พบข้อมูลผู้ป่วยจิตเวชตามเกณฑ์ที่เลือก</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const row = document.createElement("tr");

        // Compute distance to nearest clinic
        const near = calculateNearestClinic(p);

        // Formatting attributes
        const maskedNameStr = maskName(p.name);
        const maskedDxStr = maskDx(p.dx);
        const riskLabel = p.risk === "red" ? "สูง (แดง)" : (p.risk === "yellow" ? "ปานกลาง" : "ต่ำ (เขียว)");

        const smiVBadgeHtml = getSmiVBadge(p.smiV);
        
        const isMissed = isMissedAppointment(p);
        const statusBadge = isMissed 
            ? `<span class="badge red">ขาดนัดสะสม</span>` 
            : (p.medAdherence === "หยุดยาเอง" ? `<span class="badge yellow">หยุดยาเอง</span>` : `<span class="badge green">ปกติ</span>`);

        row.innerHTML = `
            <td><strong>${p.hn}</strong></td>
            <td>${maskedNameStr}</td>
            <td><span class="dx-text">${maskedDxStr}</span></td>
            <td><strong>${p.hospital}</strong></td>
            <td>${p.village} <br><small style="color: var(--text-muted);">🏥 ${near.clinic.name} (${near.distance} กม.)</small></td>
            <td><span class="badge ${p.risk}">${riskLabel}</span></td>
            <td>${smiVBadgeHtml}</td>
            <td>${p.followup}</td>
            <td><span class="${p.missedAppointments >= 2 ? 'text-danger font-bold' : ''}">${p.missedAppointments}</span></td>
            <td>${statusBadge}</td>
            <td>${p.notes || '-'}</td>
            <td class="cell-actions">
                <button class="btn-icon followup-btn" onclick="openFollowUpModal(${p.id})" title="บันทึกการติดตาม" style="color: var(--primary); border-color: var(--primary);"><i data-lucide="clipboard-check"></i></button>
                <button class="btn-icon edit-btn" onclick="editPatient(${p.id})" title="แก้ไขข้อมูล"><i data-lucide="edit-3"></i></button>
                <button class="btn-icon delete-btn" onclick="deletePatient(${p.id})" title="ลบข้อมูล"><i data-lucide="trash-2"></i></button>
            </td>
        `;

        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// Check if patient qualifies for the appointment alerts rule
function isMissedAppointment(patient) {
    if (patient.missedAppointments >= 2) return true;
    
    // Check if months since last visit > 6 months
    const lastVisitDate = new Date(patient.lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today - lastVisitDate);
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.4);
    
    return diffMonths > 6;
}

// 11. PATIENT FORMS (CREATE / EDIT)
function openPatientModal(patient = null) {
    const modal = document.getElementById("patientModal");
    const form = document.getElementById("patientForm");
    
    if (patient) {
        document.getElementById("modalTitle").textContent = `แก้ไขข้อมูลทะเบียนผู้ป่วย [${patient.hn}]`;
        document.getElementById("patientIdx").value = patient.id;
        document.getElementById("pName").value = patient.name;
        document.getElementById("pHn").value = patient.hn;
        document.getElementById("pDx").value = patient.dx;
        document.getElementById("pRisk").value = patient.risk;
        document.getElementById("pFollowUp").value = patient.followup;
        document.getElementById("pVillage").value = patient.village;
        document.getElementById("pLat").value = patient.lat;
        document.getElementById("pLng").value = patient.lng;
        document.getElementById("pLastVisit").value = patient.lastVisit;
        document.getElementById("pNextVisit").value = patient.nextVisit;
        document.getElementById("pMissedCount").value = patient.missedAppointments;
        document.getElementById("pMed").value = patient.medAdherence;
        document.getElementById("pHospital").value = patient.hospital || "รพช. บางละมุง";
        document.getElementById("pSmiV").value = patient.smiV || "SMI-V 4";
    } else {
        document.getElementById("modalTitle").textContent = "ลงทะเบียนคนไข้จิตเวชใหม่";
        form.reset();
        document.getElementById("patientIdx").value = "";
        
        // Populate default test values to make it easy for user
        document.getElementById("pLat").value = 13.0205;
        document.getElementById("pLng").value = 100.9584;
        document.getElementById("pLastVisit").value = new Date().toISOString().split('T')[0];
        document.getElementById("pNextVisit").value = new Date(Date.now() + 30 * 24 * 3600000).toISOString().split('T')[0];
        document.getElementById("pHospital").value = "รพช. บางละมุง";
    }

    modal.style.display = "flex";
}

function closePatientModal() {
    document.getElementById("patientModal").style.display = "none";
}

function savePatientForm(e) {
    e.preventDefault();

    if (currentRole !== "doctor") {
        alert("ขออภัย: เฉพาะบุคลากรการรักษา (Doctor/Nurse) เท่านั้นที่มีสิทธิ์แก้ไขฐานข้อมูลผู้ป่วย");
        return;
    }

    const idVal = document.getElementById("patientIdx").value;
    const patientData = {
        hn: document.getElementById("pHn").value,
        name: document.getElementById("pName").value,
        dx: document.getElementById("pDx").value,
        risk: document.getElementById("pRisk").value,
        followup: document.getElementById("pFollowUp").value,
        village: document.getElementById("pVillage").value,
        hospital: document.getElementById("pHospital").value,
        smiV: document.getElementById("pSmiV").value,
        lat: parseFloat(document.getElementById("pLat").value),
        lng: parseFloat(document.getElementById("pLng").value),
        lastVisit: document.getElementById("pLastVisit").value,
        nextVisit: document.getElementById("pNextVisit").value,
        missedAppointments: parseInt(document.getElementById("pMissedCount").value || 0),
        medAdherence: document.getElementById("pMed").value,
        notes: "บันทึกจากการแก้ไขข้อมูลในระบบแดชบอร์ดหลัก"
    };

    if (idVal) {
        // Edit Mode
        const id = parseInt(idVal);
        const index = patients.findIndex(p => p.id === id);
        if (index !== -1) {
            patients[index] = { ...patients[index], ...patientData };
            writeAuditLog("USER", "EDIT_PATIENT", patientData.hn, `ปรับปรุงทะเบียนผู้ป่วยจิตเวช (${patientData.hn})`);
        }
    } else {
        // Add Mode
        const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
        patients.push({ id: newId, ...patientData });
        writeAuditLog("USER", "ADD_PATIENT", patientData.hn, `ลงทะเบียนผู้ป่วยจิตเวชรายใหม่ (${patientData.hn})`);
    }

    closePatientModal();
    renderPatientTable();
    updateMapMarkers();
    updateGlobalAlertBadge();
    alert("บันทึกข้อมูลสำเร็จระบบรักษาความปลอดภัยแล้ว");
}

// Global functions for inline Edit/Delete buttons (exposed to window)
window.editPatient = function(id) {
    if (currentRole !== "doctor") {
        alert("สิทธิ์ไม่เพียงพอ: เฉพาะแพทย์/พยาบาลเท่านั้นที่ดำเนินการแก้ไขทะเบียนได้");
        return;
    }
    const patient = patients.find(p => p.id === id);
    if (patient) {
        openPatientModal(patient);
    }
};

window.deletePatient = function(id) {
    if (currentRole !== "doctor") {
        alert("สิทธิ์ไม่เพียงพอ: เฉพาะแพทย์/พยาบาลเท่านั้นที่ดำเนินการลบทะเบียนได้");
        return;
    }
    const patient = patients.find(p => p.id === id);
    if (patient) {
        if (confirm(`คุณต้องการลบข้อมูลผู้ป่วย ${patient.name} (${patient.hn}) ออกจากทะเบียนการเฝ้าระวังหรือไม่?\n*ประวัตินี้จะถูกบันทึกใน Audit Log`)) {
            patients = patients.filter(p => p.id !== id);
            writeAuditLog("USER", "DELETE_PATIENT", patient.hn, `ลบผู้ป่วยออกจากระบบ (${patient.hn})`);
            renderPatientTable();
            updateMapMarkers();
            updateGlobalAlertBadge();
        }
    }
};

// 12. ALERT CENTER ENGINE
function updateGlobalAlertBadge() {
    const count = patients.filter(isMissedAppointment).length;
    const badge = document.getElementById("globalAlertBadge");
    
    // Hide or show alerts badge depending on role permissions
    if (currentRole === "manager" || currentRole === "admin") {
        badge.style.display = "none";
    } else {
        badge.style.display = "inline-block";
        badge.textContent = count;
    }
}

function renderAlertCenter() {
    const list = document.getElementById("alertsListContainer");
    list.innerHTML = "";

    const alertCases = patients.filter(p => isMissedAppointment(p) || p.medAdherence === "หยุดยาเอง");

    let highCount = 0;
    let missedCount = 0;
    let ackCount = parseInt(localStorage.getItem("mindmap_acknowledged_count") || 0);

    if (alertCases.length === 0) {
        list.innerHTML = `<div class="card-empty-state"><i data-lucide="shield-check"></i><p>ไม่พบสัญญาณเตือนความผิดปกติในระบบขณะนี้</p></div>`;
        lucide.createIcons();
        return;
    }

    alertCases.forEach(p => {
        const isMissed = isMissedAppointment(p);
        let alertType = "warning";
        let title = "พฤติกรรมสุ่มเสี่ยง (หยุดยาเอง)";
        let desc = `ผู้ป่วย **${maskName(p.name)}** มีรายงานปฏิเสธยาจิตเวชในชุมชน (${p.village})`;

        if (p.risk === "red") {
            alertType = "danger";
            highCount++;
        }

        if (isMissed) {
            title = "ขาดการติดต่อ/ขาดนัดตรวจกำหนด";
            const lastVisitDate = new Date(p.lastVisit);
            const today = new Date();
            const diffMonths = Math.floor(Math.abs(today - lastVisitDate) / (1000 * 60 * 60 * 24 * 30.4));
            
            if (diffMonths >= 6) {
                desc = `ผู้ป่วย **${maskName(p.name)}** ขาดการรักษานานกว่า 6 เดือน (พบครั้งสุดท้าย ${formatDate(p.lastVisit)}) (${p.village})`;
                missedCount++;
            } else {
                desc = `ผู้ป่วย **${maskName(p.name)}** ขาดนัดตรวจสะสมครบ ${p.missedAppointments} ครั้ง (${p.village})`;
            }
        }

        // Generate Alert Tile UI
        const tile = document.createElement("div");
        tile.className = `alert-tile ${alertType}`;
        tile.innerHTML = `
            <div class="alert-tile-content">
                <div class="alert-tile-icon"><i data-lucide="${alertType === 'danger' ? 'alert-octagon' : 'alert-triangle'}"></i></div>
                <div class="alert-tile-text">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                    <span class="alert-time"><i data-lucide="clock"></i> ตรวจสอบพฤติกรรมล่าสุด: ${formatDate(p.lastVisit)}</span>
                </div>
            </div>
            <button class="btn-ack" onclick="acknowledgeAlert(this, '${p.hn}')"><i data-lucide="check"></i> ยืนยันติดตาม</button>
        `;
        list.appendChild(tile);
    });

    document.getElementById("alertKpiHigh").textContent = highCount;
    document.getElementById("alertKpiMissed").textContent = missedCount;
    document.getElementById("alertKpiAck").textContent = ackCount;

    lucide.createIcons();
}

window.acknowledgeAlert = function(btn, hn) {
    btn.className = "btn-ack acknowledged";
    btn.innerHTML = `<i data-lucide="check-check"></i> ดำเนินการแล้ว`;
    btn.disabled = true;
    
    // Save state count
    let ackCount = parseInt(localStorage.getItem("mindmap_acknowledged_count") || 0);
    ackCount++;
    localStorage.setItem("mindmap_acknowledged_count", ackCount);
    document.getElementById("alertKpiAck").textContent = ackCount;
    
    writeAuditLog("USER", "ACK_ALERT", hn, `ดำเนินการเยี่ยมบ้าน/ติดตามและยืนยันดูแลการกินยาของเคส ${hn}`);
    lucide.createIcons();
};

// 13. REPORTING & CHARTS (MANAGEMENT)
function initCharts() {
    // Destroy previous charts before drawing new ones
    if (activeCharts.risk) activeCharts.risk.destroy();
    if (activeCharts.med) activeCharts.med.destroy();

    // Recalculate KPIs
    const total = patients.length;
    const redCount = patients.filter(p => p.risk === "red").length;
    const missedCount = patients.filter(isMissedAppointment).length;
    const regularMed = patients.filter(p => p.medAdherence === "สม่ำเสมอ").length;

    document.getElementById("statsTotal").textContent = total;
    document.getElementById("statsRedPct").textContent = `${Math.round((redCount / total) * 100)}%`;
    document.getElementById("statsMissedPct").textContent = `${Math.round((missedCount / total) * 100)}%`;
    document.getElementById("statsMedPct").textContent = `${Math.round((regularMed / total) * 100)}%`;

    // 1. Pie Chart: Risk Ratio
    const ctxRisk = document.getElementById("chartRiskRatio").getContext("2d");
    const yellowCount = patients.filter(p => p.risk === "yellow").length;
    const greenCount = patients.filter(p => p.risk === "green").length;

    activeCharts.risk = new Chart(ctxRisk, {
        type: 'pie',
        data: {
            labels: ['ระดับสูง (แดง)', 'ระดับปานกลาง (เหลือง)', 'ระดับต่ำ (เขียว)'],
            datasets: [{
                data: [redCount, yellowCount, greenCount],
                backgroundColor: ['#a32d2d', '#b27318', '#3b6d11'],
                borderWidth: 1,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 2. Bar Chart: Med Adherence by Risk
    const ctxMed = document.getElementById("chartMedAdherence").getContext("2d");
    
    const medsByRisk = {
        red: { yes: 0, no: 0, maybe: 0 },
        yellow: { yes: 0, no: 0, maybe: 0 },
        green: { yes: 0, no: 0, maybe: 0 }
    };

    patients.forEach(p => {
        const type = p.medAdherence === "สม่ำเสมอ" ? "yes" : (p.medAdherence === "หยุดยาเอง" ? "no" : "maybe");
        medsByRisk[p.risk][type]++;
    });

    activeCharts.med = new Chart(ctxMed, {
        type: 'bar',
        data: {
            labels: ['ระดับเฝ้าระวังสูง', 'ระดับเฝ้าระวังปานกลาง', 'ระดับเฝ้าระวังต่ำ'],
            datasets: [
                {
                    label: 'รับประทานยาสม่ำเสมอ',
                    data: [medsByRisk.red.yes, medsByRisk.yellow.yes, medsByRisk.green.yes],
                    backgroundColor: '#3b6d11'
                },
                {
                    label: 'หยุดยาเอง/ขาดยา',
                    data: [medsByRisk.red.no, medsByRisk.yellow.no, medsByRisk.green.no],
                    backgroundColor: '#a32d2d'
                },
                {
                    label: 'ไม่ทราบผลชัดเจน',
                    data: [medsByRisk.red.maybe, medsByRisk.yellow.maybe, medsByRisk.green.maybe],
                    backgroundColor: '#b27318'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 3. Hospital Breakdown Statistics (Requested Update)
    const hospitalsList = ["รพช. บางละมุง", "รพช. ศรีราชา", "รพช. สัตหีบ"];
    const hospitalData = {};
    hospitalsList.forEach(h => {
        hospitalData[h] = { schizophrenia: 0, bipolar: 0, depression: 0, other: 0, total: 0, missed: 0 };
    });

    patients.forEach(p => {
        const hosp = p.hospital || "รพช. บางละมุง";
        if (!hospitalData[hosp]) {
            hospitalData[hosp] = { schizophrenia: 0, bipolar: 0, depression: 0, other: 0, total: 0, missed: 0 };
        }
        
        hospitalData[hosp].total++;
        if (isMissedAppointment(p)) {
            hospitalData[hosp].missed++;
        }

        const dxLower = p.dx.toLowerCase();
        if (dxLower.includes("schizophrenia") || dxLower.includes("schizo")) {
            hospitalData[hosp].schizophrenia++;
        } else if (dxLower.includes("bipolar")) {
            hospitalData[hosp].bipolar++;
        } else if (dxLower.includes("depressive") || dxLower.includes("depression") || dxLower.includes("depress")) {
            hospitalData[hosp].depression++;
        } else {
            hospitalData[hosp].other++;
        }
    });

    // Populate stats table
    const statsTbody = document.getElementById("hospitalStatsTableBody");
    if (statsTbody) {
        statsTbody.innerHTML = "";
        hospitalsList.forEach(h => {
            const d = hospitalData[h];
            const missedRate = d.total > 0 ? `${Math.round((d.missed / d.total) * 100)}%` : "0%";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${h}</strong></td>
                <td>${d.schizophrenia} ราย</td>
                <td>${d.bipolar} ราย</td>
                <td>${d.depression} ราย</td>
                <td>${d.other} ราย</td>
                <td><strong>${d.total} ราย</strong></td>
                <td><span class="badge ${d.missed > 0 ? 'yellow' : 'green'}">${missedRate} (${d.missed}/${d.total} ราย)</span></td>
            `;
            statsTbody.appendChild(row);
        });
    }

    // Render Hospital Stacked Comparison Chart
    if (activeCharts.hospitalComparison) activeCharts.hospitalComparison.destroy();
    const ctxHospital = document.getElementById("chartHospitalComparison").getContext("2d");
    activeCharts.hospitalComparison = new Chart(ctxHospital, {
        type: 'bar',
        data: {
            labels: hospitalsList,
            datasets: [
                {
                    label: 'โรคจิตเภท (Schizophrenia)',
                    data: hospitalsList.map(h => hospitalData[h].schizophrenia),
                    backgroundColor: '#185fa5'
                },
                {
                    label: 'อารมณ์สองขั้ว (Bipolar)',
                    data: hospitalsList.map(h => hospitalData[h].bipolar),
                    backgroundColor: '#b27318'
                },
                {
                    label: 'โรคซึมเศร้า (Depression)',
                    data: hospitalsList.map(h => hospitalData[h].depression),
                    backgroundColor: '#a32d2d'
                },
                {
                    label: 'โรคอื่นๆ/สารเสพติด (Others)',
                    data: hospitalsList.map(h => hospitalData[h].other),
                    backgroundColor: '#5f5e5a'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 14. APPEND-ONLY AUDIT LOG CONTROLLER
function loadAuditLogs() {
    return JSON.parse(localStorage.getItem("mindmap_audit_logs") || "[]");
}

function writeAuditLog(userType, eventType, hnTarget, details) {
    const logs = loadAuditLogs();
    
    // Simulate user identity based on active role
    let username = "system_daemon";
    if (userType === "USER") {
        username = currentRole === "doctor" ? "dr_sompong" : 
                   (currentRole === "social_worker" ? "sw_wanida" : 
                   (currentRole === "jhw" ? "jhw_village3" : 
                   (currentRole === "manager" ? "director_hosp" : "it_admin_sec")));
    }

    const newLog = {
        timestamp: new Date().toISOString(),
        username: username,
        role: currentRole,
        event: eventType,
        hn: hnTarget,
        details: details,
        ip: `192.168.10.${10 + currentRole.length}`
    };

    logs.push(newLog);
    localStorage.setItem("mindmap_audit_logs", JSON.stringify(logs));
}

function renderAuditLogs() {
    const tbody = document.getElementById("auditTableBody");
    tbody.innerHTML = "";

    const query = document.getElementById("auditSearchInput").value.toLowerCase();
    const action = document.getElementById("auditFilterAction").value;
    const logs = loadAuditLogs();

    // Sort by timestamp descending
    const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const filtered = sortedLogs.filter(log => {
        const matchesQuery = log.username.toLowerCase().includes(query) || 
                             log.details.toLowerCase().includes(query) || 
                             log.hn.toLowerCase().includes(query);
        const matchesAction = action === "all" || log.event === action;
        return matchesQuery && matchesAction;
    });

    filtered.forEach(log => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatTimestamp(log.timestamp)}</td>
            <td><strong>${log.username}</strong><br><small style="color: var(--text-muted);">${log.role}</small></td>
            <td><span class="badge ${log.event === 'ROLE_CHANGE' ? 'yellow' : (log.event.includes('DELETE') ? 'red' : 'green')}">${log.event}</span></td>
            <td>${log.hn}</td>
            <td>${log.details}</td>
            <td>${log.ip}</td>
        `;
        tbody.appendChild(row);
    });
}

// 15. PRINTING AND EXPORT WITH WATERMARK
function triggerPrintExport(reportTitle) {
    if (currentRole === "admin") {
        alert("การปฏิเสธการเข้าถึง: IT Admin ไม่มีสิทธิ์ส่งออกรายงานข้อมูลคนไข้");
        return;
    }
    
    // Check setting export lock
    const exportLocked = document.getElementById("settingExportToggle").checked;
    if (exportLocked && currentRole !== "doctor" && currentRole !== "social_worker") {
        alert("ระบบปฏิเสธการเข้าถึง: ฟังก์ชันการส่งออกรายงานในขณะนี้ถูกจำกัดเฉพาะบุคลากรคลินิก (Clinical Staff)");
        return;
    }

    // Set Watermark text
    const watermarkTextDiv = document.getElementById("printWatermarkDetails");
    const printTime = new Date().toLocaleString("th-TH");
    watermarkTextDiv.textContent = `พิมพ์โดยเจ้าหน้าที่: [${currentRole}] | วันที่ส่งออก: [${printTime}] | ข้อมูลความลับห้ามเผยแพร่`;

    // Write audit log
    writeAuditLog("USER", "EXPORT", "-", `พิมพ์ส่งออกรายงาน [${reportTitle}] พร้อมประทับลายน้ำความปลอดภัย`);

    // Toggle watermark visibility helper for printing
    const watermarkOverlay = document.getElementById("printWatermark");
    watermarkOverlay.style.display = "flex";

    window.print();
    
    // Reset watermark visibility after printing
    setTimeout(() => {
        watermarkOverlay.style.display = "none";
    }, 1000);
}

// 16. Utility Formatter Helper Functions
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
        return dateStr;
    }
}

function formatTimestamp(isoStr) {
    try {
        const date = new Date(isoStr);
        return date.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "2-digit" }) + " " +
               date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch (e) {
        return isoStr;
    }
}

// 17. Map Offline Graphic Canvas Generator
function renderMockMapCanvas() {
    const canvas = document.getElementById("mockMapCanvas");
    canvas.innerHTML = "";
    
    // Draw simple local area layout with SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.backgroundColor = "#eaf2f9";
    
    // Add grid lines representing roads
    for (let i = 40; i < 400; i += 60) {
        const roadH = document.createElementNS("http://www.w3.org/2000/svg", "line");
        roadH.setAttribute("x1", "0");
        roadH.setAttribute("y1", i.toString());
        roadH.setAttribute("x2", "100%");
        roadH.setAttribute("y2", i.toString());
        roadH.setAttribute("stroke", "#ffffff");
        roadH.setAttribute("stroke-width", "6");
        svg.appendChild(roadH);

        const roadV = document.createElementNS("http://www.w3.org/2000/svg", "line");
        roadV.setAttribute("x1", i.toString());
        roadV.setAttribute("y1", "0");
        roadV.setAttribute("x2", i.toString());
        roadV.setAttribute("y2", "100%");
        roadV.setAttribute("stroke", "#ffffff");
        roadV.setAttribute("stroke-width", "6");
        svg.appendChild(roadV);
    }
    
    // Render clinics as large blue circles
    clinics.forEach((clinic, idx) => {
        const cx = 100 + idx * 250;
        const cy = 120 + idx * 100;
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx.toString());
        circle.setAttribute("cy", cy.toString());
        circle.setAttribute("r", "16");
        circle.setAttribute("fill", "#185fa5");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "3");
        svg.appendChild(circle);
        
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", (cx - 30).toString());
        label.setAttribute("y", (cy + 25).toString());
        label.setAttribute("font-size", "10");
        label.setAttribute("font-weight", "bold");
        label.setAttribute("fill", "#0f2537");
        label.textContent = clinic.name;
        svg.appendChild(label);
    });
    
    // Render patients as colored dots based on current view/filters
    const riskFilter = document.getElementById("mapFilterRisk").value;
    
    patients.forEach((patient, idx) => {
        if (riskFilter !== "all" && patient.risk !== riskFilter) return;
        
        // Jitter mapping representation
        let px = 50 + (idx * 48) % 360;
        let py = 60 + (idx * 37) % 240;
        
        if (privacyShieldActive) {
            // Apply visual jitter offset
            px += Math.sin(idx) * 20;
            py += Math.cos(idx) * 20;
        }

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", px.toString());
        circle.setAttribute("cy", py.toString());
        circle.setAttribute("r", "9");
        
        const color = patient.risk === "red" ? "#a32d2d" : (patient.risk === "yellow" ? "#b27318" : "#3b6d11");
        circle.setAttribute("fill", color);
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "2");
        circle.style.cursor = "pointer";
        
        circle.addEventListener("click", () => {
            selectPatientFromMap(patient);
        });
        
        svg.appendChild(circle);
    });
    
    canvas.appendChild(svg);
}
// =====================================================
// 20. FOLLOW-UP MODAL CONTROLLER
// =====================================================

function openFollowUpModal(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // Guard: non-clinical roles can log follow-ups, but not view masked ICD
    const modal = document.getElementById("followUpModal");

    // Populate patient brief panel
    document.getElementById("fPatientId").value = patient.id;
    document.getElementById("fPatientName").textContent =
        (currentRole === "jhw" || currentRole === "manager") ? maskName(patient.name) : patient.name;
    document.getElementById("fPatientHn").textContent = patient.hn;

    const riskSpan = document.getElementById("fPatientRisk");
    const riskLabelMap = { red: "สูง (แดง) ⚠️", yellow: "ปานกลาง (เหลือง)", green: "ต่ำ (เขียว) ✅" };
    riskSpan.textContent = riskLabelMap[patient.risk] || patient.risk;
    riskSpan.className = `badge ${patient.risk}`;

    // Render past follow-up history
    const listEl = document.getElementById("pastFollowUpsList");
    if (!patient.followups || patient.followups.length === 0) {
        listEl.innerHTML = `<p style="text-align:center; padding: 8px 0; color: var(--text-muted);">ยังไม่มีประวัติการติดตาม</p>`;
    } else {
        listEl.innerHTML = [...patient.followups].reverse().map(log => {
            const outcomeColorMap = {
                completed_stable: "var(--success)",
                completed_transfer: "var(--primary)",
                in_progress: "var(--warning)",
                failed_relapse: "var(--danger)",
                failed_not_found: "#9b6b00"
            };
            const outcomeLabel = {
                completed_stable: "✅ ติดตามสำเร็จ – กลับมารับยา",
                completed_transfer: "✅ ส่งต่อ รพช. อื่น",
                in_progress: "⏳ กำลังดำเนินการ",
                failed_relapse: "🚨 อาการกำเริบ – ส่งต่อด่วน",
                failed_not_found: "❓ ไม่พบผู้ป่วย"
            };
            const color = outcomeColorMap[log.outcome] || "#555";
            return `
                <div class="past-followup-card" style="border-left: 3px solid ${color}; padding: 8px 10px; margin-bottom: 8px; background: rgba(0,0,0,0.03); border-radius: 4px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:700; color:${color};">${outcomeLabel[log.outcome] || log.outcome}</span>
                        <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(log.date).toLocaleDateString('th-TH', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                    </div>
                    <div style="margin-top: 4px;"><strong>ผู้ดำเนินการ:</strong> ${log.follower}</div>
                    ${log.notes ? `<div style="margin-top: 2px; color: var(--text-secondary);">${log.notes}</div>` : ""}
                </div>
            `;
        }).join("");
    }

    // Reset form fields
    document.getElementById("followUpForm").reset();
    document.getElementById("fPatientId").value = patient.id; // re-set after reset()

    modal.style.display = "flex";
    writeAuditLog("USER", "OPEN_FOLLOWUP", patient.hn, `เปิดหน้าบันทึกการติดตาม ${patient.name}`);
}

function closeFollowUpModal() {
    document.getElementById("followUpModal").style.display = "none";
}

function saveFollowUpForm(e) {
    e.preventDefault();

    const patientId = parseInt(document.getElementById("fPatientId").value);
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const follower = document.getElementById("fFollower").value;
    const outcome = document.getElementById("fOutcome").value;
    const notes = document.getElementById("fNotes").value.trim();

    // Build log entry
    const logEntry = {
        date: new Date().toISOString(),
        follower,
        outcome,
        notes
    };

    if (!patient.followups) patient.followups = [];
    patient.followups.push(logEntry);

    const prevRisk = patient.risk;

    // ── Risk-level State Machine ──────────────────────────────────
    if (outcome === "completed_stable") {
        // Patient returned to medication: reset missed counts, promote risk down
        patient.missedAppointments = 0;
        patient.medAdherence = "สม่ำเสมอ";
        patient.lastVisit = new Date().toISOString().split("T")[0];
        if (patient.risk === "red") {
            patient.risk = "yellow";   // Red → Yellow (needs continued monitoring)
        } else if (patient.risk === "yellow") {
            patient.risk = "green";    // Yellow → Green (stable)
        }
    } else if (outcome === "completed_transfer") {
        // Transfer: lower urgency but keep current level until confirmed
        patient.missedAppointments = Math.max(0, patient.missedAppointments - 1);
        if (patient.risk === "red") patient.risk = "yellow";
    } else if (outcome === "in_progress") {
        // Still working on it – no risk change, just log
    } else if (outcome === "failed_relapse") {
        // Relapse: escalate to highest alert
        patient.risk = "red";
        patient.medAdherence = "หยุดยาเอง";
        patient.missedAppointments += 1;
    } else if (outcome === "failed_not_found") {
        // Cannot locate: bump missed count, stay at current or escalate if already bad
        patient.missedAppointments += 1;
        if (patient.missedAppointments >= 3) patient.risk = "red";
        else if (patient.missedAppointments >= 2 && patient.risk === "green") patient.risk = "yellow";
    }

    // Audit trail
    const riskChanged = prevRisk !== patient.risk;
    writeAuditLog(
        "USER",
        "FOLLOWUP_SAVE",
        patient.hn,
        `บันทึกการติดตามโดย ${follower} | ผล: ${outcome}${riskChanged ? ` | ระดับเฝ้าระวังเปลี่ยน: ${prevRisk} → ${patient.risk}` : ""}${notes ? ` | หมายเหตุ: ${notes}` : ""}`
    );

    // Close modal and refresh all views
    closeFollowUpModal();
    renderPatientTable();
    updateMapMarkers();
    updateGlobalAlertBadge();
    if (activeView === "alertCenterView") renderAlertCenter();
    if (activeView === "statsView") initCharts();

    // Toast notification
    const toastMsg = riskChanged
        ? `✅ บันทึกสำเร็จ — ระดับเฝ้าระวังของ ${patient.hn} เปลี่ยนจาก [${prevRisk.toUpperCase()}] เป็น [${patient.risk.toUpperCase()}]`
        : `✅ บันทึกการติดตามสำเร็จ (${patient.hn})`;
    showToast(toastMsg, riskChanged ? (patient.risk === "red" ? "danger" : "success") : "info");
}

// ── Simple Toast Notification ──────────────────────────────────
function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.style.cssText = "position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px;";
        document.body.appendChild(container);
    }

    const colorMap = { success: "#3b6d11", danger: "#a32d2d", info: "#185fa5", warning: "#854f0b" };
    const bgMap   = { success: "#eaf3de", danger: "#fcebeb", info: "#e6f1fb", warning: "#faeeda" };

    const toast = document.createElement("div");
    toast.style.cssText = `
        padding: 12px 18px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
        background: ${bgMap[type] || bgMap.info}; color: ${colorMap[type] || colorMap.info};
        border-left: 4px solid ${colorMap[type] || colorMap.info};
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        max-width: 360px; animation: slideInToast 0.3s ease;
        cursor: pointer;
    `;
    toast.textContent = message;
    toast.onclick = () => toast.remove();
    container.appendChild(toast);

    setTimeout(() => { toast.style.opacity = "0"; toast.style.transition = "opacity 0.4s"; setTimeout(() => toast.remove(), 400); }, 5000);
}
