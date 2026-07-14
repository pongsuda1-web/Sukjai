# Product Requirements Document (PRD) - NanSukjai (น่านสุขใจ)

## 1. Project Overview
**NanSukjai** is a comprehensive psychiatric patient tracking and management system designed specifically for healthcare providers in Nan Province, Thailand. The system aims to streamline the registration, monitoring, and follow-up processes for psychiatric patients, ensuring seamless coordination between community hospitals (รพช.), the provincial hospital (โรงพยาบาลน่าน), and Primary Care Units (รพ.สต.).

## 2. Core Objectives
- To digitize and centralize psychiatric patient records for Nan province.
- To provide an interactive map for spatial analysis of patient distribution and risk levels.
- To facilitate efficient follow-up tracking and medication adherence monitoring.
- To ensure accurate mapping of patients to their respective healthcare facilities based on their geographical location.

## 3. Key Features

### 3.1 Patient Management & Registry
- **Add/Edit Patient Profiles:** Capture essential information including HN, Name, Address, ICD-10 Diagnosis, Risk Level (SMI-V), and Medication Status.
- **Facility Mapping:**
  - **โรงพยาบาลหลัก (Main Hospital):** Automatically mapped based on the patient's district (อำเภอ). Includes community hospitals (รพช.) and Nan Provincial Hospital.
  - **รพ.สต. ที่ดูแล (Responsible PCU):** Automatically mapped based on the patient's sub-district (ตำบล).
- **Import Functionality:** 
  - Ability to import patient data in bulk (e.g., from Excel/CSV).
  - Smart Address Parsing: The system automatically extracts sub-district (`ต.`) and district (`อ.`) from a single address string (e.g., "21 ต.น้ำพาง อ.แม่จริม") to auto-assign the correct Hospital and PCU during import.
  - Smart Coordinate Assignment: If exact patient coordinates are missing during import, the system assigns the coordinates of their designated PCU or Hospital with a slight jitter to prevent map overlap.

### 3.2 Interactive GIS Mapping
- **Real-world Coordinates:** All community hospitals and PCUs in Nan province are plotted using exact real-world geographical coordinates (Latitude/Longitude).
- **Patient Mapping:** Patients are displayed on the map with color-coded pins based on their risk levels (e.g., Red, Yellow, Green).
- **Filtering:** Users can filter the map view by Risk Level, Medication Status, Follow-up Frequency, and specific Healthcare Facilities.

### 3.3 Access Control & Security
- **Role-Based Access Control (RBAC):**
  - Roles include Admins, Doctors, Nurses, JHW (เจ้าหน้าที่สาธารณสุข), and Social Workers.
  - Restricted roles (e.g., JHW, Social Workers) have limited access to sensitive data fields.
- **PDPA Compliance:** Strict adherence to data privacy regulations with proper audit logging for data access and modifications.

## 4. Technical Stack
- **Frontend:** Next.js (React)
- **Styling:** Vanilla CSS (Tailwind CSS avoided unless explicitly required) with modern, premium aesthetics (glassmorphism, dynamic micro-animations, vibrant gradients).
- **Backend/Database:** Supabase (PostgreSQL)
- **Mapping:** Leaflet.js / React-Leaflet

## 5. Recent Updates
- **Import Logic Enhancement:** Improved the import system to correctly parse combined address strings (`หมู่บ้าน`) to extract Tambon and Amphoe, enabling accurate auto-assignment of `pcu_id` and `hospital_id`.
- **Form Separation:** Clarified the separation of Main Hospitals (รพช. + รพ.น่าน) and PCUs (รพ.สต.) in the patient registration and editing forms.
- **Geocoding Completion:** Verified and inserted exact coordinates for all clinics across all districts in Nan province.
