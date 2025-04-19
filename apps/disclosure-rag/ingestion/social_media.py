
import tweepy
import json
from datetime import datetime

class TwitterMonitor:
    def __init__(self, bearer_token):
        self.client = tweepy.Client(bearer_token=bearer_token)
        self.search_queries = [
            '(UFO OR UAP) lang:en -is:retweet',
            '"aerial phenomenon" lang:en -is:retweet',
            '"unidentified craft" lang:en -is:retweet',
            '(extraterrestrial OR "alien craft") lang:en -is:retweet'
        ]

    def get_recent_tweets(self):
        all_tweets = []
        
        for query in self.search_queries:
            try:
                tweets = self.client.search_recent_tweets(
                    query=query,
                    tweet_fields=['created_at', 'public_metrics', 'context_annotations'],
                    max_results=100
                )
                
                if tweets.data:
                    all_tweets.extend(tweets.data)
            except Exception as e:
                print(f"Error fetching tweets for query {query}: {str(e)}")
                
        return self._process_tweets(all_tweets)
    
    def _process_tweets(self, tweets):
        processed_tweets = []
        
        for tweet in tweets:
            processed_tweet = {
                'id': tweet.id,
                'text': tweet.text,
                'created_at': tweet.created_at.isoformat(),
                'metrics': tweet.public_metrics,
                'context_annotations': tweet.context_annotations if hasattr(tweet, 'context_annotations') else None
            }
            processed_tweets.append(processed_tweet)
            
        return processed_tweets
    
    def monitor_twitter_stream(self, callback):
        """
        Continuously monitor Twitter and call the callback function with new tweets
        """
        while True:
            tweets = self.get_recent_tweets()
            for tweet in tweets:
                callback(tweet)
            time.sleep(60)  # Check every minute
