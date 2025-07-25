# Wagerly: AI Copilot for Sports Betting

Wagerly is a Chrome extension that acts as your AI-powered copilot for sports betting. It provides real-time, in-depth analysis and actionable insights for supported sports betting sites, directly in your browser's side panel.

---

## Features

- **AI-Powered Analysis:** Uses OpenAI's GPT-4 to analyze live event data and provide:
  - Public Sentiment
  - High-Value Bets
  - Strategic Suggestions
  - Key Insights
- **Interactive Side Panel:** Chat with the AI, ask follow-up questions, and get tailored advice.
- **Automatic Site Detection:** Only activates on supported betting sites (see below).
- **Modern UI:** Clean, responsive design with custom icons for each analysis section.

---

## Supported Sites

- [BetMGM Sportsbook NJ](https://sports.nj.betmgm.com/en/sports/events/)
- [DraftKings Sportsbook](https://sportsbook.draftkings.com/event/)

---

## Installation

You can install Wagerly as an **unpacked extension** in Chrome or any Chromium-based browser (Brave, Edge, Vivaldi, etc.):

1. **Download or Clone the Repository**
   - Download the ZIP from GitHub and extract it, or clone the repo:
     ```
     git clone <repo-url>
     ```
2. **Open Chrome Extensions Page**
   - Go to `chrome://extensions` in your browser.
3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner.
4. **Load Unpacked**
   - Click the "Load unpacked" button.
   - Select the folder where you extracted/cloned this repository (the folder containing `manifest.json`).
5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in your Chrome toolbar and pin "Wagerly" for quick access.

---

## Usage

1. **Navigate to a Supported Site**
   - Go to a supported event page on BetMGM or DraftKings.
2. **Open the Side Panel**
   - Click the Wagerly extension icon in your toolbar.
   - The side panel will open automatically on supported sites.
3. **Interact with the AI**
   - The panel will display a detailed analysis of the current event.
   - Use the chat input to ask follow-up questions or request deeper insights.

If you visit an unsupported site, Wagerly will show a friendly message indicating that the extension is inactive.

---

## Configuration

**API Key Required:**

- Wagerly uses the OpenAI API to generate analysis. You must provide your own OpenAI API key.
- In `content.js` and `displayData.js`, replace the placeholder string `"your-api-key"` with your actual OpenAI API key.
- **Never share your API key publicly.**

---

## File Structure

- `manifest.json` — Chrome extension manifest (v3)
- `background.js` — Handles side panel activation and content script injection
- `content.js` — Extracts event data and sends it to the AI
- `displayData.js` — Renders the AI's analysis and chat UI
- `main-sp.html` — Main side panel HTML
- `invalid-sp.html` — Shown on unsupported sites
- `styles.css` — Custom styles for the side panel
- `icons/` — Custom icons for the extension and analysis sections

---

## Custom Icons

Wagerly uses the following icons (in `icons/`):
- `W-16.png`, `W-48.png`, `W-128.png` — Extension icons
- `chart_with_upwards_trend.png` — Strategic Suggestions
- `eyes.png` — Key Insights
- `fire.png` — High-Value Bets
- `speaking_head_in_silhouette.png` — Public Sentiment

---

## Troubleshooting

- **Extension not loading?**
  - Make sure you selected the correct folder (containing `manifest.json`) when loading unpacked.
  - Check the Chrome Extensions page for error messages.
- **No analysis or errors in the panel?**
  - Ensure your OpenAI API key is set correctly in both `content.js` and `displayData.js`.
  - Check the browser console for errors (right-click the panel, Inspect).
- **Panel not opening?**
  - The extension only activates on supported event pages.

---

## Credits

- **Author:** Aditya Dhanani
- **AI Analysis:** Powered by [OpenAI](https://openai.com/)
- **UI Font:** [Host Grotesk](https://fonts.google.com/specimen/Host+Grotesk)
- **Icons:** Custom PNGs in the `icons/` folder

---

## License

This project is for personal and educational use. Please do not distribute your OpenAI API key or use the extension for commercial purposes without permission.
