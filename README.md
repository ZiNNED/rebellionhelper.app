# ⭐ Star Wars: RebellionHelper

An interactive helper map for the popular board game [Star Wars: Rebellion](https://boardgamegeek.com/boardgame/187645/star-wars-rebellion). Track system loyalty, build queues, and probe droids — all from your browser.

🌐 **[rebellionhelper.app](https://rebellionhelper.app)**

## Features

- **System Loyalty Tracking** — Toggle each system between Subjugated, Imperial Loyalty, Rebel Loyalty, and Neutral
- **Build Queue Overview** — Instantly see what each player needs to put in their build queue
- **Probe Droid Tracking** — As the Empire player, track all your sent probe droids and mark systems as tracked or with boots on the ground
- **Build Restrictions** — Mark sabotaged systems or systems with opposition presence as build-disallowed
- **Customizable Colors** — Personalize the map colors to your liking
- **Mobile Friendly** — Works on phones and tablets with touch controls
- **Installable PWA** — Add it to your home screen for an app-like experience
- **Works Offline** — Service worker caching lets you use it without an internet connection

## How to Use

| Action | Desktop | Mobile |
|---|---|---|
| Toggle loyalty | Left click | Short tap |
| Toggle build allowed/disallowed | Right click | Long tap or double tap |
| Open build queue | Menu → Build Queue | Tap Rebel/Empire icon in corners |
| Toggle probe droid view | Probe Droid button | Probe Droid button |

## Development

This is a static web app with no build step required. To run it locally:

```bash
# Clone the repo
git clone https://github.com/ZiNNED/rebellionhelper.app.git
cd rebellionhelper.app

# Serve with any static file server
python3 -m http.server 8000
# or
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit changes.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## Support

If you find this tool useful, consider supporting its development via Bitcoin:

`bc1qfymdph0p033tfk66wge5ny7fdlpt8czgh7sh46`
