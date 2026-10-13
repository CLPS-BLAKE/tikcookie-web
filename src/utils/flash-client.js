// Shared request already unwraps Result.data. Never unwrap a second time here.
export function createFlashClient(request) {
  return {
    submit: ({ productId, requestKey }) => request.post('/orders/flash', { productId, requestKey }, { silent: true }),
    query: orderId => request.get(`/orders/flash/result/${encodeURIComponent(orderId)}`, { silent: true }),
  }
}
