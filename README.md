
# 🚀 React Crypto Tracker

🌐 Experience It Live
>✨ Check out the live version of react crypto tracker:
👉 https://react-crypto-tracker-flax.vercel.app/

Welcome to **React Crypto Tracker** — a cryptocurrency price tracking application built with **React**, **TypeScript**, and **Tailwind CSS**, powered by the **CoinGecko API**.  
This app lets you explore real-time data for top cryptocurrencies, view detailed insights, and interact with historical price charts — all with support for Light/Dark mode.

## ✨ Features

- 🔹 **Top Cryptocurrencies**: Displays the top 100 coins with essential info like name, symbol, price, market cap, and 24h volume.
- 🔹 **Coin Details**: Click any coin to see in-depth information including descriptions, stats, and external links.
- 🔹 **Interactive Price Charts**: View historical price data (24h, 7d, 30d) with dynamic theming using Recharts.
- 🔹 **Light/Dark Mode**: Switch between light and dark themes for comfortable viewing.
- 🔹 **Modular Data Fetching**: Coin chart data loads separately for smoother experience when switching time ranges.
- 🔹 **Responsive Design**: Optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

| Technology         | Description                                     |
|-------------------------|-------------------------------------------------|
| **React**          ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black) | JavaScript library for building UIs |
| **TypeScript**     ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Superset of JS with type checking |
| **Tailwind CSS**   ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Utility-first CSS framework |
| **Recharts**       ![Recharts](https://img.shields.io/badge/-Recharts-FF4500?style=flat&logo=chartdotjs&logoColor=white) | React-based charting library |
| **CoinGecko API**  ![CoinGecko](https://img.shields.io/badge/-CoinGecko-292D3E?style=flat&logo=coingecko&logoColor=white) | Free API for cryptocurrency data |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/react-crypto-tracker.git
cd react-crypto-tracker
```

> Replace `your-username` with your GitHub username if you forked this project.

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run in Development Mode

```bash
npm run dev
# or
yarn dev
```

> App will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

> Compiled files will be located in the `dist/` folder.

## 📁 Project Structure

```
react-crypto-tracker/
├── public/
├── src/
│   ├── assets/                # Images, icons, and media
│   ├── components/            # Reusable UI components
│   │   ├── CoinDetail.tsx     # Displays coin details and charts
│   │   ├── CoinList.tsx       # Renders the main coin list
│   │   ├── Header.tsx         # Top navigation/header
│   │   ├── Footer.tsx         # Footer section
│   ├── hooks/
│   │   └── useCoinChartData.ts  # Custom hook for fetching chart data
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # React entry point
│   ├── index.css              # Main Tailwind CSS file
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## 🤝 Contributing

Contributions are welcome! If you have ideas, bugs, or improvements:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---
🌐 Experience It Live
>✨ Check out the live version of my portfolio:
👉 https://react-crypto-tracker-flax.vercel.app/

> Crafted with ❤️ by [ravarich](https://github.com/ravarich)
