# CanvasUrlDrop_PSUEDOCODE

Date: October 6th, 2026

## Goal

A YouTube link or page URL released on `/research-canvas` becomes a dropped-artifact node and fans out against the corpus, same as a file. Nothing is written to Postgres.

## Client

```
on dragenter/dragover/drop:
  types = dataTransfer.types
  if types has Files OR text/uri-list OR text/plain:
    preventDefault  // stop the browser from navigating away
  if only Files and MIME is unsupported and no URL type:
    show rejected affordance

on drop:
  file = first File with size > 0
  url  = parseDroppedUrl(dataTransfer)
    1. text/uri-list first non-# line
    2. text/plain if the whole string is one http(s) URL
    3. single href in text/html
  url = normalizePublicHttpUrl(url)  // reject localhost / private / non-http
  if file is accepted MIME:
    POST multipart file=...          // existing T-060 path
  else if url:
    POST multipart url=...
  else if file:
    existing preflight failure
```

Console submit: if the input is one public http(s) URL, call the same `handleUrl`. Otherwise keep the agent/tour path.

## Server (`POST /api/processing/drop`)

```
form = multipart
if file present: existing extract → embed → searchDatabase
if url present:
  if not public http(s): 400 INVALID_URL
  if youtube video id:
    oEmbed title/author
    scrapeWithFireCrawl(url) if available   // existing scrape, not youtube.py
    derivedVia = youtube-unfurl
    kind = youtube
  else:
    scrapeWithFireCrawl(url)
    if scrape empty: fetch HTML title + meta description (capped)
    derivedVia = url-scrape
    kind = url
  if no usable text: 422 EXTRACT_FAILED
  embed first 8000 chars → searchDatabase
  200 { artifact, matches, meta }   // same shape; artifact.sourceUrl set
never INSERT
never call processResource
never fetch a transcript
```

## Node

- kind `url` / `youtube` get their own icon and label
- stamp when `derivedVia` is `youtube-unfurl`: matched via video page text, not a transcript
- stamp when `derivedVia` is `url-scrape`: matched via page text
