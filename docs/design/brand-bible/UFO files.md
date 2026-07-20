<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# UFO files

The U.S. government **just released a second major tranche of UFO (UAP) files** on **May 22, 2026**, following President Donald Trump’s executive order for transparency on Unidentified Anomalous Phenomena.[^1_1][^1_2]

### Key facts about the latest disclosure:

| Aspect | Details |
| :-- | :-- |
| **Total files released** | 222 files in the second tranche (May 22), plus 161 files from the first tranche (May 8) [^1_2][^1_3] |
| **Content includes** | 51 videos, 7 audio clips, 6 PDF documents, including a 116-page report from 1948–1950 [^1_2][^1_3] |
| **Sightings described** | "Green orbs," discs, fireballs, metallic elliptical shapes, diamond-shaped objects [^1_2][^1_4] |
| **Time span** | Nearly 80 years of reports, dating back to 1948 [^1_2] |
| **Notable file** | Armed Forces Special Weapons Program report: 209 sightings near Sandia, New Mexico nuclear facility (1948–1950) [^1_2][^1_3] |
| **Recent sighting** | 2025 account from an intelligence officer who was "virtually speechless" after an encounter [^1_5] |
| **2023 footage** | Infrared video of an F-16 intercepting a diamond-shaped object over Lake Huron [^1_4] |

### What the files **do not** confirm:

- No definitive proof of extraterrestrial life[^1_2]
- No evidence of retrieved alien artifacts or spacecraft[^1_4]
- No conclusions about alien technology[^1_2]


### Where to access them:

- **Official portal**: [war.gov/ufo/](https://www.war.gov/ufo/) — the Department of War's dedicated UAP site[^1_6][^1_1]
- **National Archives**: Additional moving images and sound recordings at [archives.gov/research/topics/uaps](https://www.archives.gov/research/topics/uaps/moving-images-and-sound)[^1_7]
- **Project Blue Book** (1947–1969): 12,618 total sightings, 701 remain "unidentified," fully declassified at National Archives[^1_8]

The Pentagon has committed to releasing more files on a **"rolling basis"**. Future disclosures may include CIA documents.[^1_4][^1_2]

Would you like me to help you set up an automated workflow to monitor the war.gov/ufo portal for new releases, or fetch specific documents from the archive?
<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://www.war.gov/ufo/

[^1_2]: https://www.bbc.com/news/articles/cn8pzzlyy66o

[^1_3]: https://www.reuters.com/world/us/us-releases-second-batch-government-declassified-ufo-files-2026-05-22/

[^1_4]: https://www.foxnews.com/politics/nasa-chief-pulls-back-curtain-trump-ufo-files-after-bizarre-finds-surface-buried-fed-records

[^1_5]: https://www.cbsnews.com/news/ufo-files-pentagon-videos-documents/

[^1_6]: https://www.npr.org/2026/05/08/g-s1-121186/ufo-files-released-defense-department

[^1_7]: https://www.archives.gov/research/topics/uaps/moving-images-and-sound

[^1_8]: https://www.archives.gov/research/military/air-force/ufos

[^1_9]: https://en.wikipedia.org/wiki/UFO_Files

[^1_10]: https://en.wikipedia.org/wiki/United_States_UFO_files

[^1_11]: https://www.instagram.com/reel/DY2evLuAJf5/

[^1_12]: https://www.facebook.com/nbcnightlynews/posts/the-pentagon-released-a-new-batch-of-declassified-ufo-files-following-president-/1344564300870874/

[^1_13]: https://www.facebook.com/7NEWSQld/posts/the-us-department-of-war-released-a-second-tranche-of-files-relating-to-alien-an/1416482970510325/

[^1_14]: https://www.instagram.com/reel/DYqogg5j_W5/

[^1_15]: https://www.facebook.com/cnn/posts/the-pentagon-has-released-a-second-wave-of-declassified-ufo-files-adding-new-doc/1365520605440587/


---

# Help me automate monitoring for new UFO file releases

Excellent! I've created a comprehensive UFO file monitoring system for you. Here's what you have:

### Created Files

| File | Purpose |
| :-- | :-- |
| [`ufo-monitor-python.py`](output/ufo-monitor-python.py) | Main Python monitoring script |
| [`ufo-monitor.ts`](output/ufo-monitor.ts) | TypeScript/Node.js version |
| [`requirements.txt`](output/requirements.txt) | Python dependencies |
| [`package.json`](output/package.json) | Node.js dependencies |
| [`setup.sh`](output/setup.sh) | Quick setup script |
| [`setup-cron.sh`](output/setup-cron.sh) | Cron job automation |
| [`UFOFileMonitorDashboard.tsx`](output/UFOFileMonitorDashboard.tsx) | Next.js dashboard component |
| [`route.ts`](output/app/api/ufo-monitor/route.ts) | Next.js API route |

### Quick Start (Python Version - Easiest)

```bash
cd output
pip install -r requirements.txt
python ufo-monitor-python.py check  # Single check
python ufo-monitor-python.py watch  # Continuous monitoring
```


### Features

| Feature | Description |
| :-- | :-- |
| **Multi-source monitoring** | Checks Department of War PURSUE + National Archives [^2_1][^2_2] |
| **Automatic detection** | Finds new PDFs, videos (MP4), audio (MP3), documents [^2_3][^2_4] |
| **Persistent state** | Tracks 383+ known files to avoid duplicate alerts |
| **Notifications** | Terminal, file logs, email, Slack support |
| **Next.js dashboard** | Real-time UI showing files, alerts, stats |

### Automation Options

1. **Cron job** (every 6 hours):

```bash
chmod +x setup-cron.sh && ./setup-cron.sh
```

2. **Systemd service** (auto-start on boot):

```bash
sudo cp ufo-monitor.service /etc/systemd/system/
sudo systemctl enable ufo-monitor
sudo systemctl start ufo-monitor
```

3. **Next.js integration**: Use the dashboard component in your app to see real-time updates

### Notifications

Set environment variables for email/Slack:

```bash
export UFO_MONITOR_EMAIL=your@email.com
export UFO_MONITOR_SLACK_WEBHOOK=https://hooks.slack.com/services/xxx
```

Would you like me to help you set up the monitoring right now, or would you prefer to integrate it into your existing Next.js project first?

<div align="center">⁂</div>

[^2_1]: https://www.war.gov/ufo/

[^2_2]: https://www.archives.gov/research/topics/uaps/moving-images-and-sound

[^2_3]: https://www.bbc.com/news/articles/cn8pzzlyy66o

[^2_4]: https://www.reuters.com/world/us/us-releases-second-batch-government-declassified-ufo-files-2026-05-22/


---

# Show me how to add more monitoring sources

Answer skipped.

