import type { NextApiRequest, NextApiResponse } from 'next';

// Deprecated endpoint: authentication removed from public web app.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Cache-Control', 'max-age=300, public, immutable');
	res.status(410).json({ error: 'gone', message: 'Authentication removed. Use auth.istampit.io for auth flows.' });
}
