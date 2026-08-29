/**
 * Minimal JSON-RPC plumbing over HTTP and WebSocket. No dependencies.
 * Support code - not part of either exercise. You should not need to change anything here.
 */

let nextId = 1;

/** One HTTP JSON-RPC call. Throws on a JSON-RPC error object. */
export async function call(url, method, params = []) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: nextId++, method, params }),
  });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status} from ${redact(url)}`);
  const body = await response.json();
  if (body.error) throw new Error(`${method}: ${body.error.message} (${body.error.code}) from ${redact(url)}`);
  return body.result;
}

/**
 * Open a WebSocket subscription.
 *
 * `onNotification(params)` is called for every `eth_subscription` message, at the moment this
 * process receives it. Timestamp inside that callback if you are measuring delivery.
 *
 * Returns a handle with `close()` and a `ready` promise that resolves once the subscription id has
 * come back.
 */
export function subscribe(url, subscriptionParams, onNotification) {
  const socket = new WebSocket(url);
  const pending = new Map();
  let subscriptionId = null;

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('error', () => reject(new Error(`websocket error from ${redact(url)}`)));
    socket.addEventListener('close', () => {
      if (subscriptionId === null) reject(new Error(`websocket closed before subscribing: ${redact(url)}`));
    });
    socket.addEventListener('open', () => {
      const id = nextId++;
      pending.set(id, (result) => {
        subscriptionId = result;
        resolve(result);
      });
      socket.send(JSON.stringify({ jsonrpc: '2.0', id, method: 'eth_subscribe', params: subscriptionParams }));
    });
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.method === 'eth_subscription') {
        onNotification(message.params);
        return;
      }
      const settle = pending.get(message.id);
      if (!settle) return;
      pending.delete(message.id);
      if (message.error) reject(new Error(`eth_subscribe: ${message.error.message}`));
      else settle(message.result);
    });
  });

  return {
    ready,
    close() {
      try {
        socket.close();
      } catch {
        /* already closed */
      }
    },
  };
}

/** Never print a key that lives in a URL. */
export function redact(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}/…`;
  } catch {
    return '<endpoint>';
  }
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
