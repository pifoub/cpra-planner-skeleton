/**
 * POST JSON to the given URL and return the parsed response.
 * Throws an Error when the request fails.
 */
export async function postJSON(url: string, body: any) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      throw new Error(await r.text());
    }
    return await r.json();
  } catch (err) {
    throw err instanceof Error ? err : new Error('Request failed');
  }
}
