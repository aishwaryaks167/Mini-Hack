# SmartDose — Smart Medicine Reminder Mobile App
> **College Mini-Hackathon Edition (2-Member Team Project)**  
> Mobile-first, elderly-accessible medication compliance tracking application. Software-only solution requiring zero proprietary hardware.

---

## 🚀 Key Features

### 1. 📷 Medicine Photo Capture & Gallery Upload
- **Camera Capture:** Snap a photo of prescribed pills or prescription bottle labels using the mobile camera.
- **Gallery Upload:** Upload existing prescription images or pill blister pack photos from device storage.
- **Client-Side Compression:** Canvas-based image resizer scales images to lightweight WebP/JPEG data URLs, preventing local storage quota exhaustion.
- **Visual Pill Aids:** Embedded sample pill SVGs for demo and test purposes.
- **Visual Verification:** Photos appear on the Home Dashboard next-up card, timeline cards, detail modals, reminder alarm alerts, and system push notifications.

### 2. 👵 Elderly-First Accessibility Mode
- **High-Contrast Profile:** Distinct borders and calm teal/blue/amber palette.
- **Large Typography:** +25% scaled font sizing with clear visual weights.
- **Large Touch Targets:** 56px+ tap areas designed for unsteady hands.
- **Simplified Wording:** Clear, jargon-free medical reminders.

### 3. 🔔 Smart Reminder Engine & Web Audio Chimes
- **Zero External Audio Dependencies:** Synthesizes gentle medical chimes directly using browser Web Audio API oscillators (Classic Chime, Gentle Harp, Hospital Bell, Pulse Ping).
- **Persistent Dose Statuses:** `Pending`, `Taken`, `Missed`, and `Skipped`.
- **Configurable Snooze:** 5, 10, or 15 minutes. *Snoozing does not mark a dose as taken.*
- **Grace Period Auto-Missed Detection:** Automatically flags unconfirmed doses after 45 minutes (customizable to 30, 60, or 90 minutes).
- **Retroactive Record Correction:** Allows patients to fix accidental clicks or log forgotten doses while maintaining clinical audit integrity.

### 4. 📊 Strict Clinical Adherence Accounting & Reports
- **Documented Formula:**
  $$\text{Adherence \%} = \left(\frac{\text{Confirmed Taken Doses}}{\text{Total Doses Due to Date}}\right) \times 100$$
  *Future scheduled doses are strictly excluded from the denominator.*
- **SVG Adherence Chart:** Interactive daily compliance trend over 7, 14, or 30 days.
- **Clinical CSV Export:** 1-tap spreadsheet download with dates, times, doses, meal instructions, and skip reasons.
- **Printable Clinical Summary:** Formatted printable sheet for doctor consultations.

### 5. 🛡️ Caregiver Safety Escalation Protocol
- **Distinction Principle:** Clearly marks reminders as *"Confirmation not received"* rather than *"Medicine not taken"* to prevent unnecessary panic.
- **Escalation Rules:** Notifies designated caregiver (e.g., daughter or home nurse) after configurable unconfirmed delay.
- **Simulation & WhatsApp Bridge:** Simulates outbound dispatch payloads and generates direct prefilled WhatsApp/SMS check-in messages.

### 6. 🏆 Mini-Hackathon Presentation Kit
- Built-in slide deck covering the Problem Statement, Solution, Architecture, and Innovations.
- **3-Minute Timed Live Judge Pitch Script** formatted with speaking cues for a 2-member college hackathon team.
- Production-grade **SQLite Relational Schema DDL** viewer with 1-click copy.

---

## 🛠️ Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | High reliability, type safety, component modularity |
| **Build Tool** | Vite 8 | Near-instant compilation and dev server |
| **Styling** | Tailwind CSS v4 | Mobile-first utilities, responsive layouts, accessibility |
| **Icons** | Lucide React | Medical iconography (Pill, HeartPulse, Clock, Shield) |
| **Sound Synthesis**| Web Audio API | 100% offline, zero MP3 assets, zero CORS failure risk |
| **Persistence** | LocalStorage / SQLite DDL | Relational schema with foreign keys and cascade rules |
| **Mobile Bridge** | Capacitor / TWA | Clean compilation to native Android APK |

---

## 📱 Compiling to an Android APK

SmartDose is structured for instant compilation to Android:

### Approach A: Native Android APK via Capacitor (Recommended)
```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 2. Initialize Capacitor Configuration
npx cap init "SmartDose" "com.smartdose.app" --web-dir "dist"

# 3. Add Android platform project
npx cap add android

# 4. Build web production bundle & copy assets to Android
npm run build
npx cap sync android

# 5. Build release APK directly via Gradle wrapper
cd android
./gradlew assembleRelease
# Output APK: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Approach B: Google Bubblewrap TWA (Trusted Web Activity)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://<your-app-domain>/manifest.json
bubblewrap build
# Output APK: app-release-signed.apk
```

### Critical Android Permissions (`AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
```

---

## 🏃 Setup & Run Instructions

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript linter
npm run lint

# Build production bundle
npm run build
```

---

## ⚖️ Safety & Medical Disclaimer

SmartDose is a personal medication adherence and tracking companion. It does **not** provide medical diagnoses, alter prescribed dosages, or recommend pharmaceutical treatments. Patients are always advised to follow their prescription label and consult their licensed physician or pharmacist for clinical questions.
