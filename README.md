# ⚡ TypeBlitz — Typing Speed Practice Game

![TypeBlitz Banner](https://img.shields.io/badge/TypeBlitz-Typing%20Speed%20Game-7c3aed?style=for-the-badge&logo=lightning&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-4ade80?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-a855f7?style=flat-square)

> A premium, zero-dependency typing speed trainer with real-time WPM tracking, accuracy scoring, animated visuals, and a beautiful dark UI.

---

## 🎮 Live Demo

**[▶ Try TypeBlitz](https://mrguddu07-prog.github.io/typeblitz)**

---

## ✨ Features

- **4 Difficulty Modes** — Easy, Medium, Hard, and Expert (includes real code snippets & SQL)
- **Real-Time Stats** — Live WPM, accuracy, elapsed time, and score updated as you type
- **Speed Level System** — 6 tiers from 🐢 Beginner to 👑 Legend based on your WPM
- **WPM Chart** — Canvas-drawn graph showing your speed progression over the test
- **Persistent Records** — Best WPM and total tests saved via `localStorage`
- **Animated Background** — Floating particles for a premium visual feel
- **Keyboard Shortcuts** — `Tab` to restart · `Esc` to reset
- **Fully Responsive** — Works on desktop, tablet, and mobile
- **Zero Dependencies** — Pure HTML, CSS, and vanilla JavaScript; no frameworks or libraries

---

## 📸 Screenshots

> *(Add screenshots of the game UI here after deploying)*

---

## 🚀 Getting Started

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/mrguddu07-prog/typeblitz.git

# 2. Navigate into the folder
cd typeblitz

# 3. Open in your browser
open index.html
# or just double-click index.html
```

No build step. No npm install. Just open and play.

---

## 📁 Project Structure

```
typeblitz/
├── index.html      # App structure & layout
├── style.css       # Design system, animations, responsive styles
└── script.js       # Game logic, WPM engine, chart rendering
```

---

## 🧠 How It Works

| Component | Description |
|-----------|-------------|
| **WPM Engine** | Calculates words per minute as `(correct chars / 5) / elapsed minutes` |
| **Accuracy** | Tracks correct vs total keystrokes in real time |
| **Score Formula** | `WPM × (Accuracy%) × Difficulty Multiplier` |
| **WPM Chart** | Custom Canvas API rendering with smooth bezier curves and gradient fills |
| **Difficulty Multipliers** | Easy ×1 · Medium ×1.5 · Hard ×2 · Expert ×3 |

---

## 🏆 Speed Level Reference

| Level | WPM Range | Badge |
|-------|-----------|-------|
| Beginner | < 20 | 🐢 |
| Average | 20 – 40 | 🚶 |
| Fast | 40 – 60 | 🏃 |
| Pro | 60 – 80 | ⚡ |
| Speed Demon | 80 – 100 | 🔥 |
| Legend | 100+ | 👑 |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure, Canvas API
- **CSS3** — Custom properties, Grid, Flexbox, keyframe animations, backdrop-filter
- **Vanilla JavaScript** — Game state management, real-time DOM manipulation, localStorage

---

## 🔮 Future Improvements

- [ ] Multiplayer race mode
- [ ] Custom text input by the user
- [ ] Detailed analytics dashboard (error heatmap, slowest words)
- [ ] Leaderboard with backend integration
- [ ] Dark/light theme toggle
- [ ] Typing sound effects (optional toggle)

---

## 👤 Author

**Guddu Kumar**
- 🔗 [LinkedIn](https://linkedin.com/in/guddu-kumar-374098394)
- 🐙 [GitHub](https://github.com/mrguddu07-prog)
- 🎓 BCA Cyber Security · Dev Bhoomi Uttarakhand University

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> *Built with ⚡ by Guddu Kumar — because fast fingers need fast feedback.*