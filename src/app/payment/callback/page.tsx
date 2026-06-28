'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('failed');
      return;
    }

    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlan(data.plan);
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 3000);
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Verifying your payment...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-muted-foreground">Welcome to {plan} plan. Redirecting to dashboard...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">Payment Failed</h2>
            <p className="text-muted-foreground">Something went wrong. Please try again.</p>
            <button onClick={() => router.push('/pricing')} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg">
              Back to Pricing
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader className="w-16 h-16 animate-spin" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
