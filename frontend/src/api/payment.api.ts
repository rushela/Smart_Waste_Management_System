// src/api/payments.api.ts
export const paymentsAPI = {
  // existing:
  listMine: async () => fetch("/api/payments/mine").then(r=>r.json()),

  // new:
  getCards: async () => fetch("/api/cards/mine").then(r=>r.json()),
  addCard: async (card: {brand:string; last4:string; expMonth:number; expYear:number; token:string; label?:string}) =>
    fetch("/api/cards", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(card) }).then(r=>r.json()),

  checkout: async (payload: {
    amount: number; method: "card"; description?: string;
    savedCardId?: string;
    newCard?: { brand?: string; last4: string; expMonth: number; expYear: number; token: string }
  }) =>
    fetch("/api/checkout", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }).then(r=>r.json()),

  confirmGateway: async (sessionId: string, outcome: "success"|"fail") =>
    fetch(`/api/mock-gateway/${sessionId}/confirm`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ outcome }) }).then(r=>r.json()),
};
