/**
 * Relational SQLite Database Architecture for SmartDose.
 * Production-ready DDL Schema for Android (Room / SQLite) & Cross-Platform engines.
 */

export const SQLITE_SCHEMA_DDL = `-- SmartDose Production Relational SQLite Schema
-- Target Engine: Android SQLite 3.x / Room / Flutter sqflite / Capacitor SQLite

PRAGMA foreign_keys = ON;

-- 1. User Profile Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    blood_group TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    preferred_language TEXT DEFAULT 'en',
    time_format TEXT DEFAULT '12h',
    elderly_mode INTEGER DEFAULT 0,
    sound_alerts INTEGER DEFAULT 1,
    sound_tone TEXT DEFAULT 'chime',
    vibrate INTEGER DEFAULT 1,
    snooze_interval_minutes INTEGER DEFAULT 10,
    missed_grace_minutes INTEGER DEFAULT 45,
    is_guest INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Medicines Master Table
CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    generic_name TEXT,
    medicine_type TEXT NOT NULL CHECK(medicine_type IN ('tablet', 'capsule', 'syrup', 'drops', 'inhaler', 'injection', 'patch', 'topical', 'other')),
    strength TEXT NOT NULL,
    quantity_per_dose REAL DEFAULT 1.0,
    unit TEXT NOT NULL,
    instructions TEXT,
    meal_timing TEXT DEFAULT 'after_meal' CHECK(meal_timing IN ('before_meal', 'after_meal', 'with_meal', 'empty_stomach', 'anytime')),
    start_date DATE NOT NULL,
    end_date DATE,
    is_ongoing INTEGER DEFAULT 1,
    frequency TEXT DEFAULT 'daily' CHECK(frequency IN ('daily', 'specific_days', 'interval')),
    specific_days_mask TEXT, -- JSON array of active days e.g. [1, 3, 5]
    interval_days INTEGER,
    color_hex TEXT DEFAULT '#0284c7',
    current_stock INTEGER DEFAULT 30,
    low_stock_threshold INTEGER DEFAULT 5,
    prescribing_doctor TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medicine Reminder Times Schedule Table (One-to-Many with medicines)
CREATE TABLE IF NOT EXISTS medicine_schedules (
    id TEXT PRIMARY KEY NOT NULL,
    medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    reminder_time TEXT NOT NULL, -- Format: 'HH:MM' 24-hr
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Scheduled Dose Instances & Adherence History Table
CREATE TABLE IF NOT EXISTS dose_instances (
    id TEXT PRIMARY KEY NOT NULL,
    medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'taken', 'missed', 'skipped')),
    taken_at DATETIME,
    notes TEXT,
    skip_reason TEXT,
    snoozed_until DATETIME,
    snooze_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(medicine_id, scheduled_date, scheduled_time)
);

-- 5. Caregiver Relationships & Alert Escalations Table
CREATE TABLE IF NOT EXISTS caregivers (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    alert_on_missed INTEGER DEFAULT 1,
    alert_delay_minutes INTEGER DEFAULT 45,
    share_adherence_weekly INTEGER DEFAULT 1,
    emergency_alerts INTEGER DEFAULT 1,
    is_verified INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notification Audit Logs
CREATE TABLE IF NOT EXISTS notification_logs (
    id TEXT PRIMARY KEY NOT NULL,
    medicine_id TEXT REFERENCES medicines(id) ON DELETE SET NULL,
    medicine_name TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    status TEXT NOT NULL,
    payload_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid query performance
CREATE INDEX IF NOT EXISTS idx_doses_date_status ON dose_instances(scheduled_date, status);
CREATE INDEX IF NOT EXISTS idx_doses_med_id ON dose_instances(medicine_id);
CREATE INDEX IF NOT EXISTS idx_schedules_med_id ON medicine_schedules(medicine_id);
`;
