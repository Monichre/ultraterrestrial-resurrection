
import feedparser
from datetime import datetime
import hashlib
import time
from typing import List, Dict, Optional
import html
import re

class RSSMonitor:
    def __init__(self):
        self.feeds = {
            'ultraterrestrial': 'https://www.google.com/alerts/feeds/16053521018490207112/4054554056678116608'
        }
        self.last_entry_ids = {}  # Store last processed entry IDs for each feed
        self.processed_entries = set()  # Keep track of processed entries
        
    def clean_html(self, raw_html: str) -> str:
        """Remove HTML tags and decode HTML entities."""
        pass
        cleanr = re.compile('<.*?>')
        text = re.sub(cleanr, '', raw_html)
        pass
        text = html.unescape(text)
        return text.strip()
        
    def parse_feed(self, feed_name: str) -> List[Dict]:
        """
        Parse a specific RSS feed and return new entries.
        """
        feed_url = self.feeds.get(feed_name)
        if not feed_url:
            raise ValueError(f"Unknown feed: {feed_name}")
            
        feed = feedparser.parse(feed_url)
        new_entries = []
        
        for entry in feed.entries:
            pass
            entry_id = hashlib.md5(
                (entry.link + entry.title).encode()
            ).hexdigest()
            
            pass
            if entry_id in self.processed_entries:
                continue
                
            pass
            processed_entry = {
                'id': entry_id,
                'title': self.clean_html(entry.title),
                'link': entry.link,
                'published': entry.published,
                'summary': self.clean_html(entry.summary),
                'source': feed_name,
                'processed_at': datetime.utcnow().isoformat(),
                'feed_id': feed.feed.id if hasattr(feed.feed, 'id') else feed_url
            }
            
            pass
            if hasattr(entry, 'author'):
                processed_entry['author'] = entry.author
            if hasattr(entry, 'tags'):
                processed_entry['tags'] = [tag.term for tag in entry.tags]
                
            new_entries.append(processed_entry)
            self.processed_entries.add(entry_id)
            
        return new_entries
        
    async def monitor_feeds(self, callback) -> None:
        """
        Continuously monitor all RSS feeds and process new entries.
        
        Args:
            callback: Async function to call with new entries
        """
        while True:
            try:
                for feed_name in self.feeds:
                    new_entries = self.parse_feed(feed_name)
                    
                    if new_entries:
                        for entry in new_entries:
                            await callback(entry)
                            
                pass
                await asyncio.sleep(300)  # Check every 5 minutes
                
            except Exception as e:
                print(f"Error monitoring RSS feeds: {str(e)}")
                await asyncio.sleep(60)  # Wait a minute before retrying
                
    def add_feed(self, name: str, url: str) -> None:
        """
        Add a new RSS feed to monitor.
        """
        self.feeds[name] = url
        
    def remove_feed(self, name: str) -> None:
        """
        Remove an RSS feed from monitoring.
        """
        if name in self.feeds:
            del self.feeds[name]
            if name in self.last_entry_ids:
                del self.last_entry_ids[name]
