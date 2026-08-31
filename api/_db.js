import { kv } from '@vercel/kv';
import Redis from 'ioredis';

let redisClient = null;

export function getDb() {
  if (process.env.REDIS_URL) {
    if (!redisClient) {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
      });
    }
    return {
      get: async (key) => {
        const val = await redisClient.get(key);
        if (!val) return null;
        try {
          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          return val;
        }
      },
      set: async (key, val) => {
        const strVal = typeof val === 'object' ? JSON.stringify(val) : val;
        return redisClient.set(key, strVal);
      }
    };
  }
  return kv;
}

export const NOTES_KEY = 'mural-notes';

export function hueFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % 360;
}

export function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
