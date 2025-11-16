/**
 * API Route: POST /api/ledger/update
 *
 * Triggers an update check for pending ledger entries.
 * This can be called by:
 * - Scheduled cron jobs (GitHub Actions)
 * - Client-side manual refresh
 * - Vercel/Edge cron triggers
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchLedger } from '@/lib/ledger';
import { updatePendingEntries } from '@/lib/ledger-updater';

export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Can run on edge for fast execution

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization for production
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.UPDATE_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Fetch current ledger
    const ledgerData = await fetchLedger();

    // Update pending entries
    const { updatedLedger, result } = await updatePendingEntries(ledgerData);

    // In a production system, you would:
    // 1. Write updatedLedger back to storage (file system, database, S3)
    // 2. Invalidate CDN cache
    // 3. Trigger rebuild if needed

    // For now, return the update statistics
    return NextResponse.json({
      success: true,
      checked: result.checked,
      updated: result.updated,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Ledger update failed:', error);
    return NextResponse.json(
      {
        error: 'Update failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual trigger via browser
export async function GET(request: NextRequest) {
  return POST(request);
}
