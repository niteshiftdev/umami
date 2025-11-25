// Client Detection Module
// Detects visitor device, browser, OS, and geolocation from request headers and IP
// Uses MaxMind GeoLite2 database for IP geolocation lookup
// Falls back to CDN headers (Cloudflare, Vercel, CloudFront) when available

import path from 'node:path';
import { UAParser } from 'ua-parser-js';
import { browserName, detectOS } from 'detect-browser';
import isLocalhost from 'is-localhost-ip';
import ipaddr from 'ipaddr.js';
import maxmind from 'maxmind';
import { safeDecodeURIComponent } from '@/lib/url';
import { stripPort, getIpAddress } from '@/lib/ip';

const MAXMIND = 'maxmind';

const PROVIDER_HEADERS = [
  // Cloudflare headers
  {
    countryHeader: 'cf-ipcountry',
    regionHeader: 'cf-region-code',
    cityHeader: 'cf-ipcity',
  },
  // Vercel headers
  {
    countryHeader: 'x-vercel-ip-country',
    regionHeader: 'x-vercel-ip-country-region',
    cityHeader: 'x-vercel-ip-city',
  },
  // CloudFront headers
  {
    countryHeader: 'cloudfront-viewer-country',
    regionHeader: 'cloudfront-viewer-country-region',
    cityHeader: 'cloudfront-viewer-city',
  },
];

export function getDevice(userAgent: string, screen: string = '') {
  const { device } = UAParser(userAgent);

  const [width] = screen.split('x');

  const type = device?.type || 'desktop';

  if (type === 'desktop' && screen && +width <= 1920) {
    return 'laptop';
  }

  return type;
}

function getRegionCode(country: string, region: string) {
  if (!country || !region) {
    return undefined;
  }

  return region.includes('-') ? region : `${country}-${region}`;
}

function decodeHeader(s: string | undefined | null): string | undefined | null {
  if (s === undefined || s === null) {
    return s;
  }

  return Buffer.from(s, 'latin1').toString('utf-8');
}

export async function getLocation(ip: string = '', headers: Headers, hasPayloadIP: boolean) {
  // Ignore local ips
  if (!ip || (await isLocalhost(ip))) {
    return null;
  }

  if (!hasPayloadIP && !process.env.SKIP_LOCATION_HEADERS) {
    for (const provider of PROVIDER_HEADERS) {
      const countryHeader = headers.get(provider.countryHeader);
      if (countryHeader) {
        const country = decodeHeader(countryHeader);
        const region = decodeHeader(headers.get(provider.regionHeader));
        const city = decodeHeader(headers.get(provider.cityHeader));

        return {
          country,
          region: getRegionCode(country, region),
          city,
        };
      }
    }
  }

  // Database lookup
  if (!globalThis[MAXMIND]) {
    const dir = path.join(process.cwd(), 'geo');

    globalThis[MAXMIND] = await maxmind.open(
      process.env.GEOLITE_DB_PATH || path.resolve(dir, 'GeoLite2-City.mmdb'),
    );
  }

  const result = globalThis[MAXMIND]?.get(stripPort(ip));

  if (result) {
    const country = result.country?.iso_code ?? result?.registered_country?.iso_code;
    const region = result.subdivisions?.[0]?.iso_code;
    const city = result.city?.names?.en;

    return {
      country,
      region: getRegionCode(country, region),
      city,
    };
  }
}

// Extract comprehensive client information from request
// Called on every event to populate session and event details
//
// @param request - NextJS Request object
// @param payload - Event payload (may contain explicit userAgent, ip, screen)
// @returns Object with {userAgent, browser, os, ip, country, region, city, device}
export async function getClientInfo(request: Request, payload: Record<string, any>) {
  // User agent string from payload or request headers
  const userAgent = payload?.userAgent || request.headers.get('user-agent');
  // IP address from payload or request headers (handles proxies)
  const ip = payload?.ip || getIpAddress(request.headers);
  // Geolocation lookup from IP or CDN headers
  const location = await getLocation(ip, request.headers, !!payload?.ip);
  // Safe URI decode to handle special characters in location data
  const country = safeDecodeURIComponent(location?.country);
  const region = safeDecodeURIComponent(location?.region);
  const city = safeDecodeURIComponent(location?.city);
  // Browser and OS detection from user agent string
  const browser = browserName(userAgent);
  const os = detectOS(userAgent) as string;
  // Device type classification (desktop, laptop, tablet, mobile)
  const device = getDevice(userAgent, payload?.screen);

  return { userAgent, browser, os, ip, country, region, city, device };
}

// Check if client IP should be blocked from analytics
// Useful for excluding internal traffic, CI/CD pipelines, monitoring tools
// Supports both exact IP matches and CIDR notation ranges
//
// @param clientIp - IP address to check against blocklist
// @returns true if IP is blocked, false otherwise
export function hasBlockedIp(clientIp: string) {
  const ignoreIps = process.env.IGNORE_IP;

  if (ignoreIps) {
    const ips = [];

    // Parse comma-separated IP list from environment variable
    if (ignoreIps) {
      ips.push(...ignoreIps.split(',').map(n => n.trim()));
    }

    // Check each IP in the blocklist
    return ips.find(ip => {
      // Exact match
      if (ip === clientIp) {
        return true;
      }

      // CIDR notation match (e.g., "192.168.0.0/16")
      if (ip.indexOf('/') > 0) {
        const addr = ipaddr.parse(clientIp);
        const range = ipaddr.parseCIDR(ip);

        // Ensure IP version matches (IPv4 or IPv6) before checking range
        if (addr.kind() === range[0].kind() && addr.match(range)) {
          return true;
        }
      }
    });
  }

  return false;
}
