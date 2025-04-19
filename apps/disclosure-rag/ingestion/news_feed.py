
from newsapi import NewsApiClient
from datetime import datetime, timedelta
import json
import os

class NewsFeedMonitor:
    def __init__(self, api_key):
        self.newsapi = NewsApiClient(api_key=api_key)
        self.keywords = [
            'UFO', 'UAP', 'flying saucer', 'aerial phenomenon',
            'unidentified craft', 'extraterrestrial', 'alien spacecraft'
        ]
        
    def get_latest_news(self):
        all_articles = []
        
        for keyword in self.keywords:
            try:
                response = self.newsapi.get_everything(
                    q=keyword,
                    language='en',
                    sort_by='publishedAt',
                    from_param=(datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
                    to=datetime.now().strftime('%Y-%m-%d')
                )
                
                if response['status'] == 'ok':
                    all_articles.extend(response['articles'])
            except Exception as e:
                print(f"Error fetching news for keyword {keyword}: {str(e)}")
                
        return self._deduplicate_articles(all_articles)
    
    def _deduplicate_articles(self, articles):
        seen_urls = set()
        unique_articles = []
        
        for article in articles:
            if article['url'] not in seen_urls:
                seen_urls.add(article['url'])
                unique_articles.append(article)
                
        return unique_articles
    
    def monitor_news_stream(self, callback):
        """
        Continuously monitor news and call the callback function with new articles
        """
        while True:
            articles = self.get_latest_news()
            for article in articles:
                callback(article)
            time.sleep(300)  # Check every 5 minutes
