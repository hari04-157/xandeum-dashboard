# Xandeum Network Explorer & Analytics Platform

![Xandeum Explorer Preview](public/preview-image.png) 
*(Note: Upload a screenshot of your dashboard to your public folder and rename it preview-image.png)*

## 🏆 Project Overview
This is a production-ready **Analytics & Visualization Dashboard** built for the **Xandeum pNode Network**. It provides a real-time window into the "Scalable Storage Layer" of Solana, allowing operators and developers to monitor node health, network consensus, and gossip protocol traffic.

Built for the **Superteam Xandeum Bounty**, this platform focuses on **Enterprise Performance**, **High-Fidelity UX**, and **Innovative Data Visualization**.

## ✨ Key Features & Innovation

### 1. 📟 Immersive "Gossip Stream" Terminal (Innovation)
- **Real-time Visualization:** A scrolling hacker-style terminal that visualizes network events (Block Propagation, Votes, Syncs) in real-time.
- **Maximize Mode:** The terminal can be expanded to a full-screen overlay for deep monitoring without distractions.
- **Audio Feedback:** Integrated Web Audio API provides subtle, sci-fi interface sounds for interactions (can be toggled in settings).

### 2. ⚡ Enterprise Data Handling
- **High-Performance Rendering:** Implements `useMemo` caching and optimized pagination to handle datasets of **thousands of nodes** without browser lag.
- **Sortable Columns:** Users can sort the node list by Provider, Location, Version, or Status for quick analysis.
- **Skeleton Loading:** Polished shimmer effects during data fetching instead of generic loading spinners.

### 3. 🛡️ Robust Connectivity (Functionality)
- **Dual-Mode Engine:** 1. **RPC Live:** Attempts to fetch real data from a local Xandeum node (`127.0.0.1:6000`) using the official `get-pods` method.
    2. **Smart Simulation:** If no node is detected (e.g., during judging), it gracefully degrades to a high-fidelity simulation mode so the UI can still be fully reviewed.

### 4. 🧠 Educational Knowledge Base
- Integrated **FAQ Modal** explaining the "Xandeum Trilemma" and pNode architecture to help onboard new users.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Charts:** Recharts (Responsive Data Visualization)
- **Language:** TypeScript
- **HTTP Client:** Axios (JSON-RPC 2.0)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/hari04-157/xandeum-dashboard.git](https://github.com/hari04-157/xandeum-dashboard.git)
   cd xandeum-dashboard