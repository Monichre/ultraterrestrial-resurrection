# PURSUE / war.gov UFO release archive

Source: https://www.war.gov/ufo/

Downloaded by: scripts/download_pursue_ufo_releases.py
Downloaded at epoch: 1779959108

## Official manifest

- CSV: metadata/uap-data.csv
- Parsed JSON: metadata/records.json
- Manifest rows: 222

## Official bundle archives

- _archives/release_01/documents/Release_1.zip — 1,223,976,178 bytes — sha256 ceb1823304fd2fdabc3b911a600db631b3f90520bffc6d1e0c8117f7e0427b98
- _archives/release_01/videos/uapvideos.zip — 1,334,665,058 bytes — sha256 8eb571400674a896e58c0307f44048e847390177758b4ee7206ef3612d2649cd
- _archives/release_02/documents/release_02_document_bundle.zip — 69,986,448 bytes — sha256 4b6e91fab8251e74152a51ab0da08a471354c40f3d0991a1f061f814ac4067a4
- _archives/release_02/videos/uap052226.zip — 5,644,377,817 bytes — sha256 ccd6bcf9805beef17ffcfbe61817b9955791b0af48883ac31a1627518d0369b2

## Extracted payload summary

- release_01/documents: 261 files
- release_01/videos: 28 files
- release_02/documents: 13 files
- release_02/videos: 57 files

Total extracted payload files: 359
Extracted file extensions: {
  ".jpg": 12,
  ".mp4": 85,
  ".pdf": 244,
  ".png": 16,
  "[no_ext]": 2
}

## Notes

- The war.gov document endpoints are Akamai-protected; normal curl returned 403 from this host. curl_cffi Chrome impersonation succeeded.
- The CloudFront video bundles were publicly accessible without the war.gov WAF hop.
- Archives are retained under _archives/ so the official originals remain reproducible.
