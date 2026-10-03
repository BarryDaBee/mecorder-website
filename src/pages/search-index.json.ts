import { searchEntries } from '../lib/docs';

export function GET() {
  return new Response(JSON.stringify(searchEntries()), { headers: { 'Content-Type': 'application/json' } });
}
