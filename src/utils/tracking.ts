// Helpers for Meta Advanced Matching.
//
// Values are normalised but NOT hashed here: the Meta Pixel hashes advanced-matching
// parameters itself, and pre-hashing would make it hash twice and break matching.
// The server-side Conversions API call does its own SHA-256 hashing, mirroring the
// same normalisation rules (see backend/app/services/meta_capi.py).

export interface MetaUserData {
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  country?: string;
}

/** Read a browser cookie by name; '' when absent. */
export function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : '';
}

/**
 * Meta wants digits only, including country code, with no '+' or separators.
 * Bangladeshi numbers are entered as 01XXXXXXXXX, so the leading 0 becomes 880.
 */
export function normalizePhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('0')) return '880' + digits.slice(1);
  if (digits.length === 10) return '880' + digits; // entered without the leading 0
  return digits;
}

/**
 * Lowercase, letters and spaces only.
 * \p{M} is required alongside \p{L}: Bengali vowel signs are combining marks, and
 * dropping them would turn মোহাম্মদ into ম. Must stay identical to the backend's
 * normalisation in app/services/meta_capi.py.
 */
function normalizeName(raw: string): string {
  return (raw || '').toLowerCase().replace(/[^\p{L}\p{M}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

/** First and last token of the name; Meta treats a single name as the first name. */
export function splitName(full: string): { fn: string; ln: string } {
  const parts = normalizeName(full).split(' ').filter(Boolean);
  if (parts.length === 0) return { fn: '', ln: '' };
  if (parts.length === 1) return { fn: parts[0], ln: '' };
  return { fn: parts[0], ln: parts[parts.length - 1] };
}

/** Lowercase with spaces and punctuation stripped, per Meta's city/state rules. */
export function normalizePlace(raw: string): string {
  return (raw || '').toLowerCase().replace(/[^\p{L}\p{M}]/gu, '');
}

/** Build the advanced-matching payload, omitting anything we don't have. */
export function buildUserData(input: {
  name?: string;
  phone?: string;
  district?: string;
  division?: string;
}): MetaUserData {
  const { fn, ln } = splitName(input.name || '');
  const data: MetaUserData = {
    ph: normalizePhone(input.phone || ''),
    fn,
    ln,
    ct: normalizePlace(input.district || ''),
    st: normalizePlace(input.division || ''),
    country: 'bd',
  };
  // Drop empty keys so Meta doesn't receive blank parameters
  (Object.keys(data) as (keyof MetaUserData)[]).forEach(k => {
    if (!data[k]) delete data[k];
  });
  return data;
}

/**
 * Meta's click/browser identifiers. These are the strongest signals the
 * Conversions API can receive, so they are forwarded to the backend on checkout.
 */
export function getMetaBrowserIds(): { fbp: string; fbc: string } {
  return { fbp: getCookie('_fbp'), fbc: getCookie('_fbc') };
}

/** Meta-format product fields, derived from the GA4-style items already in the dataLayer. */
export function buildMetaContents(items: Array<{ item_id: string; price: number; quantity: number }>) {
  return {
    content_type: 'product',
    content_ids: items.map(i => String(i.item_id)),
    contents: items.map(i => ({
      id: String(i.item_id),
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: items.reduce((sum, i) => sum + (i.quantity || 0), 0),
  };
}
