import { PaystackButton } from 'react-paystack';
import { CreditCard, Lock } from 'lucide-react';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  onSuccess: () => void;
}

export default function PaystackIntegration({ user, onSuccess }: Props) {
  // @ts-ignore
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_your_key_here";
  const amount = 500000; // NGN 5,000 in kobo

  const componentProps = {
    email: user.email,
    amount,
    metadata: {
      custom_fields: [
        {
          display_name: "User ID",
          variable_name: "user_id",
          value: user.uid,
        },
      ],
    },
    publicKey,
    text: "Unlock Premium Access (₦5,000)",
    onSuccess: async (reference: any) => {
      try {
        // 1. Log transaction
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          amount: amount / 100,
          status: 'success',
          reference: reference.reference,
          timestamp: serverTimestamp(),
        });

        // 2. Update user status
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          premiumStatus: true
        });

        onSuccess();
        alert("Welcome to the Premium Tribe! Payment Successful.");
      } catch (err) {
        console.error("Error updating subscription:", err);
      }
    },
    onClose: () => alert("Payment cancelled. You stay in the Casual Tribe for now."),
  };

  return (
    <div className="p-10 bg-natural-bg/50 rounded-[40px] border border-beige-line flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6 text-gold shadow-inner">
        <Lock size={32} />
      </div>
      <h4 className="text-2xl font-serif font-black italic mb-3">Guarded Heritage</h4>
      <p className="text-sm text-muted-tan mb-10 max-w-sm font-medium leading-relaxed italic">
        The ancestors have locked this secret recipe. Unlock full access to the Master Chef Tribe to reveal the hidden process.
      </p>
      
      {/* react-paystack provides the button wrapper */}
      <PaystackButton 
         className="btn-secondary w-full justify-center !rounded-2xl py-4 text-xs tracking-[0.2em] shadow-xl"
         {...componentProps} 
      />
      
      <div className="mt-8 flex items-center gap-3 text-[10px] text-muted-tan font-black uppercase tracking-widest">
        <CreditCard size={12} className="opacity-50" />
        Secured by Paystack
      </div>
    </div>
  );
}
