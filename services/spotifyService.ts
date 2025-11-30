
// services/spotifyService.ts

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// This will be stored in settings
let clientId = '';
const redirectUri = window.location.origin + '/';

export const setSpotifyClientId = (id: string) => {
    clientId = id;
}

const generateRandomString = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const generateCodeChallenge = async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const redirectToSpotifyAuth = async () => {
    const verifier = generateRandomString(128);
    localStorage.setItem('spotify_code_verifier', verifier);
    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', redirectUri);
    params.append('scope', 'user-read-currently-playing');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`;
};

export const getAccessToken = async (code: string) => {
    const verifier = localStorage.getItem('spotify_code_verifier');
    if (!verifier) {
        throw new Error('Code verifier not found!');
    }

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('code_verifier', verifier);

    const result = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });

    const { access_token, refresh_token } = await result.json();
    return { access_token, refresh_token };
};

export const refreshAccessToken = async (refreshToken: string) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', clientId);

    const result = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });

    const { access_token, refresh_token: new_refresh_token } = await result.json();
    return { access_token, new_refresh_token };
}

export const getCurrentlyPlaying = async (accessToken: string) => {
    const result = await fetch(`${SPOTIFY_API_URL}/me/player/currently-playing`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (result.status === 204 || result.status > 400) {
        return null;
    }
    
    return await result.json();
};
