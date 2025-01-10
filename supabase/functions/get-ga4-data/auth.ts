import { SignJWT } from "https://deno.land/x/jose@v4.9.1/index.ts";
import { decode as base64Decode } from "https://deno.land/std@0.129.0/encoding/base64.ts";

export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  console.log('Starting private key import...');
  
  let cleanKey = pem
    .replace(/\\n/g, '\n')
    .replace(/["']/g, '')
    .trim();

  const matches = cleanKey.match(/-----BEGIN PRIVATE KEY-----\n?([\s\S]+)\n?-----END PRIVATE KEY-----/);
  if (!matches || !matches[1]) {
    throw new Error('Invalid PEM format: Missing key content');
  }

  const base64Content = matches[1].replace(/\s/g, '');
  console.log('Base64 content length:', base64Content.length);
  
  try {
    const binaryDer = base64Decode(base64Content);
    console.log('Binary DER length:', binaryDer.length);

    return await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );
  } catch (error) {
    console.error('Error importing private key:', error);
    throw error;
  }
}

export async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const key = await importPrivateKey(privateKey);
  const now = Math.floor(Date.now() / 1000);
  
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/analytics.readonly'
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .sign(key);

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    console.error('Token exchange failed:', error);
    throw new Error(`Token exchange failed: ${error}`);
  }

  const { access_token } = await tokenResponse.json();
  return access_token;
}