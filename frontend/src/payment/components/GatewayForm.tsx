// src/payment/components/GatewayForm.tsx
import React, { useEffect, useState } from "react";
import { paymentsAPI } from "../../api/payments.api";

type Props = {
  selectedMethod: string;
  onMethodChange: (m: string) => void;
  onCardSelection?: (data: { savedCardId?: string; newCard?: { brand?: string; last4: string; expMonth: number; expYear: number; token: string } }) => void;
};

const GatewayForm: React.FC<Props> = ({ selectedMethod, onMethodChange, onCardSelection }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [mode, setMode] = useState<"saved"|"new">("saved");
  const [savedCardId, setSavedCardId] = useState<string>("");
  const [newCard, setNewCard] = useState({ number:"", expMonth:"", expYear:"", cvv:"", brand:"VISA" });

  useEffect(() => {
    paymentsAPI.getCards().then(setCards).catch(()=>setCards([]));
  }, []);

  useEffect(() => {
    if (onCardSelection) {
      if (mode === "saved" && savedCardId) onCardSelection({ savedCardId });
      if (mode === "new" && newCard.number.length >= 12) {
        onCardSelection({
          newCard: {
            brand: newCard.brand,
            last4: newCard.number.slice(-4),
            expMonth: Number(newCard.expMonth),
            expYear: Number(newCard.expYear),
            token: `tok_${Math.random().toString(36).slice(2,10)}`
          }
        });
      }
    }
  }, [mode, savedCardId, newCard, onCardSelection]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button type="button" className={`px-3 py-1 rounded ${selectedMethod==='card'?'bg-emerald-600 text-white':'bg-gray-100'}`} onClick={()=>onMethodChange("card")}>Card</button>
      </div>

      <div className="flex gap-4">
        <button type="button" className={`px-3 py-1 rounded ${mode==='saved'?'bg-emerald-100':'bg-gray-100'}`} onClick={()=>setMode("saved")}>Saved Card</button>
        <button type="button" className={`px-3 py-1 rounded ${mode==='new'?'bg-emerald-100':'bg-gray-100'}`} onClick={()=>setMode("new")}>New Card</button>
      </div>

      {mode === "saved" ? (
        <div className="space-y-2">
          {cards.length === 0 && <p className="text-sm text-gray-500">No saved cards.</p>}
          {cards.map(c => (
            <label key={c._id} className="flex items-center gap-3 p-2 border rounded">
              <input type="radio" name="savedCard" value={c._id} onChange={()=>setSavedCardId(c._id)} />
              <span>{c.brand} •••• {c.last4} (exp {c.expMonth}/{c.expYear})</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <input className="col-span-2 p-2 border rounded" placeholder="Card Number" value={newCard.number} onChange={e=>setNewCard({...newCard, number:e.target.value})}/>
          <input className="p-2 border rounded" placeholder="MM" value={newCard.expMonth} onChange={e=>setNewCard({...newCard, expMonth:e.target.value})}/>
          <input className="p-2 border rounded" placeholder="YYYY" value={newCard.expYear} onChange={e=>setNewCard({...newCard, expYear:e.target.value})}/>
          <input className="col-span-2 p-2 border rounded" placeholder="CVV" value={newCard.cvv} onChange={e=>setNewCard({...newCard, cvv:e.target.value})}/>
        </div>
      )}
    </div>
  );
};

export default GatewayForm;
