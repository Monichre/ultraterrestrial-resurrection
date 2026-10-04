import type { NextConfig } from 'next'
import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname( fileURLToPath( import.meta.url ) )
const repoRoot = path.resolve( rootDir, '../..' )
const dbPkg = path.join( repoRoot, 'packages/db' )

loadEnv( { path: path.join( repoRoot, '.env' ) } )
loadEnv( { path: path.join( repoRoot, '.env.local' ) } )
loadEnv( { path: path.join( repoRoot, 'apps/app/.env.local' ) } )
loadEnv( { path: path.join( repoRoot, 'packages/db/.env' ) } )
loadEnv( { path: path.join( rootDir, '.env.local' ), override: true } )

const nextConfig: NextConfig = {
  transpilePackages: ['@db', '@repo/disclosure-ui'],
  experimental: {
    externalDir: true,
  },
  webpack: ( config ) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@db/postgres': path.join( dbPkg, 'src/postgres/index.ts' ),
      '@db': dbPkg,
    }
    return config
  },
}

export default nextConfig
