/**
 * Simple Redis-based Queue utility
 * Provides Queue-like interface using @upstash/redis
 * Replaces the non-existent @upstash/queue package
 */
import { Redis } from '@upstash/redis'

export interface QueueOptions {
  url: string
  token: string
  queueName?: string
}

export class Queue<T = unknown> {
  private redis: Redis
  private queueKey: string

  constructor(options: QueueOptions) {
    this.redis = new Redis({
      url: options.url,
      token: options.token,
    })
    this.queueKey = options.queueName || 'default-queue'
  }

  /**
   * Push an item onto the queue
   */
  async push(item: T): Promise<void> {
    await this.redis.lpush(this.queueKey, JSON.stringify(item))
  }

  /**
   * Pop an item from the queue (FIFO)
   */
  async pop(): Promise<T | null> {
    const item = await this.redis.rpop(this.queueKey)
    if (!item) return null
    return JSON.parse(item as string) as T
  }

  /**
   * Get the current queue size
   */
  async size(): Promise<number> {
    return await this.redis.llen(this.queueKey)
  }

  /**
   * Peek at items without removing them
   */
  async peek(count: number = 10): Promise<T[]> {
    const items = await this.redis.lrange(this.queueKey, 0, count - 1)
    return items.map((item) => JSON.parse(item as string) as T)
  }

  /**
   * Clear all items from the queue
   */
  async clear(): Promise<void> {
    await this.redis.del(this.queueKey)
  }
}
