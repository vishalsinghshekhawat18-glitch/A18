# Proposal: Cross-Device State & Progress Synchronization Engine

**Author**: Antigravity Assistant  
**Date**: August 16, 2026  
**Status**: Proposal Only — Awaiting Human Review & Explicit Approval  
**Target Repository**: `vishalsinghshekhawat18-glitch/A18` ("Banking Command Center")

---

## 1. Context & Architecture Goal

The Banking Command Center is currently a static web application hosted on GitHub Pages (`gh-pages`). All persistence (last opened item, reading position, theme preference, font size) is stored exclusively in single-browser `localStorage`.

Per the updated product requirement, **cross-device progress synchronization** (reading state, bookmarks, last read item, and study preferences following a student across laptop, tablet, and mobile) is now a **near-term priority**.

This document proposes a minimal viable architecture for cross-device sync that **preserves GitHub Pages static hosting**, introduces zero server-maintenance overhead, and minimizes visual/interactive friction for students.

---

## 2. Infrastructure & Hosting Strategy

### Can we stay on GitHub Pages?
**YES.** Moving off GitHub Pages to a custom Node/SSR server is **unnecessary**.

A managed **Backend-as-a-Service (BaaS)** — specifically **Supabase** or **Firebase** — can bolt directly onto the Vite React application. 

```text
┌─────────────────────────────────────────────────────────┐
│              GitHub Pages Static Hosting                │
│  (Delivers HTML, CSS, & Bundled React App Assets)      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼ Client-side SDK (HTTPS)
┌─────────────────────────────────────────────────────────┐
│             Managed BaaS (Supabase / Firebase)           │
│  - Identity & Auth (Magic Link / Device Pairing)       │
│  - PostgreSQL / Firestore Document Store (User Progress)│
└─────────────────────────────────────────────────────────┘
```

- **Static Deployment**: Remains 100% on GitHub Pages via static `dist/` builds.
- **Dynamic State**: The React app communicates directly with the BaaS REST/Websocket API via client SDKs.
- **Offline / Instant Boot**: The app continues to load instantly from `localStorage`, syncing asynchronously with the BaaS in the background.

---

## 3. Identity & Authentication Comparison

We evaluated three potential identity mechanisms for linking devices:

| Feature / Criteria | Option A: Device Pairing Code (PIN) | Option B: Magic Link / OTP Email (Recommended) | Option C: Full Password Account |
|---|---|---|---|
| **Mechanism** | App generates a random 6-character code (e.g. `SYNC-7X9B2`). User types it into secondary device. | User enters email; receives a 6-digit OTP or one-click magic link. | User registers username + password, handles reset flows. |
| **Setup Friction** | Extremely Low (5 seconds). | Low (15 seconds, requires opening email once). | High (requires password creation & verification). |
| **Device Linking** | Instant code entry. | Instant via email click/OTP. | Manual login on every device. |
| **Account Recovery** | ❌ None. If local data is cleared and code is lost, progress is lost. | ✅ Full Recovery. Entering email restores all progress on any new device. | ✅ Full Recovery via password reset flow. |
| **Vendor Overhead** | Custom key mapping table in DB. | Native out-of-the-box BaaS feature. | Native BaaS feature, but requires reset UI handling. |

### 💡 Recommended Choice: Option B (Magic Link / OTP Email)
- **Why**: Magic-link / OTP email authentication provides the ideal balance: zero password fatigue for the student, zero password-reset maintenance for the developer, and permanent progress recovery if a phone or browser cache is cleared.

---

## 4. What Gets Synced (Data Payload Schema)

The sync engine will isolate user progress into a single lightweight JSON document per student:

```typescript
export interface UserSyncState {
  userId: string;                   // BaaS Auth UUID
  updatedAt: string;                // ISO timestamp (for conflict resolution)
  lastOpenedItemId: string | null;  // e.g. "migrated-ca-note-sec1-1"
  preferences: {
    theme: 'sepia' | 'warm' | 'night';
    fontSize: number;
  };
  itemProgress: Record<string, {
    completed: boolean;
    lastReadAt: string;
    scrollOffset?: number;
  }>;
}
```

---

## 5. Trade-Off Analysis & Managed Provider Selection

We compared **Supabase** vs **Firebase** vs **Custom Serverless API (Cloudflare Workers / Vercel KV)**:

| Provider | Free Tier Allowance | Vendor Lock-in | Setup Complexity | Recommendation |
|---|---|---|---|---|
| **Supabase** | 50,000 Monthly Active Users<br>500 MB PostgreSQL Database | Low (Open-source Postgres standard) | 🟢 Low (2 NPM packages, standard SQL table) | **RECOMMENDED** |
| **Firebase** | 50,000 Daily Active Users<br>1 GB Firestore Database | High (Proprietary NoSQL API) | 🟡 Moderate (SDK bundle size is larger) | Alternative |
| **Custom Cloudflare/Vercel API** | 100,000 requests/day | Medium (Custom Worker code) | 🔴 High (Requires writing custom backend code) | Avoid |

### Trade-off Summary:
- **Cost**: **$0.00 / month**. Supabase free tier (50,000 MAU) far exceeds the needs of this application.
- **Lock-in**: Low. Supabase uses standard PostgreSQL; data can be exported at any time.
- **Codebase Impact (`App.tsx`)**: Minimal. `App.tsx` retains its fast `useMemo` local state, wrapped in a lightweight `useSyncProgress()` custom hook that handles background push/pull.

---

## 6. Sizing & Implementation Effort Estimate

- **Estimated Effort**: **1 to 2 Days (Weekend Implementation Task)**.
- **Phased Implementation Steps**:
  1. Create Supabase project & define `user_progress` Postgres table (`userId`, `payload`, `updatedAt`).
  2. Implement `useSyncProgress()` React hook for silent `localStorage` $\leftrightarrow$ Supabase synchronization.
  3. Add a compact `SyncModal` UI component for entering email / OTP link.
  4. Verify multi-device sync between desktop and mobile viewports.

---

## 🛑 Checkpoint 3 Status

This proposal is **document-only**. No code changes, backend scaffolding, or dependencies have been added. 

*Awaiting explicit review and approval before any implementation begins.*
