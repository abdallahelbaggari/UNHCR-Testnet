/* Humanitarian Hub TESTNET — /cancel-payment — Cloudflare Pages Function
   Pi TESTNET — sandbox:true — Cancels pending payments via Pi API */

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'cancel-payment endpoint live',
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

    console.log('[TESTNET] Cancelling payment:', paymentId);

    if (!paymentId) {
      return new Response(JSON.stringify({ cancelled: true, note: 'no_payment_id', sandbox: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const apiKey = context.env.PI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ cancelled: true, note: 'no_api_key', sandbox: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    /* Call Pi API to cancel the payment */
    let piResult = null;
    try {
      const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      piResult = await r.json();
      console.log('[TESTNET] Pi cancel result:', JSON.stringify(piResult));
    } catch (piErr) {
      console.warn('[TESTNET] Pi cancel API error:', piErr.message);
    }

    return new Response(JSON.stringify({
      cancelled: true,
      paymentId: paymentId,
      piResult: piResult,
      sandbox: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ cancelled: true, sandbox: true, error: e.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
