/* Humanitarian Hub TESTNET — /approve — Cloudflare Pages Function
   Pi TESTNET — sandbox:true — ALWAYS returns 200 */

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'approve endpoint live',
    network: 'testnet',
    sandbox: true
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    }
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const paymentId = body.paymentId;

    console.log('[TESTNET] Approving payment:', paymentId);

    if (!paymentId) {
      return new Response(JSON.stringify({ approved: true, note: 'no_payment_id', sandbox: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const apiKey = context.env.PI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ approved: true, note: 'no_api_key', sandbox: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const d = await r.json();
    console.log('[TESTNET] Pi approve result:', JSON.stringify(d));

    /* ALWAYS return 200 — non-200 causes Payment Expired in Pi SDK */
    return new Response(JSON.stringify({ approved: true, payment: d, sandbox: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (e) {
    console.error('[TESTNET] Approve error:', e.message);
    return new Response(JSON.stringify({ approved: true, note: 'error_but_approved', sandbox: true, error: e.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
