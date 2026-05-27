'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestOtp, verifyOtp } from '@/lib/authApi';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [showNameField, setShowNameField] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (showNameField) {
      if (!displayName.trim()) {
        setError('Please enter your display name.');
        return;
      }
      setError('');
      setSubmitting(true);
      try {
        const data = await requestOtp({ email: email.trim(), displayName: displayName.trim() });
        setUserId(data.userId);
        setStep('otp');
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const data = await requestOtp({ email: email.trim() });
      setUserId(data.userId);
      setStep('otp');
    } catch (err) {
      // If the backend says no account + needs a display name, reveal inline name field
      if (err.status === 404 && err.message.includes('displayName')) {
        setShowNameField(true);
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const data = await verifyOtp({ userId, code: code.trim() });
      setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError('');
    setSubmitting(true);
    try {
      await requestOtp({
        email: email.trim(),
        displayName: displayName.trim() || undefined,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 dark:bg-red-900 px-4">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-6">
        <p className="text-5xl leading-none" aria-hidden="true">🎅</p>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-red-800 dark:text-red-200">
            Sinterklaas Wishlist
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {step === 'email' && !showNameField && 'Sign in or create an account'}
            {step === 'email' && showNameField && 'Create your account'}
            {step === 'otp' && 'Check your email'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {showNameField && (
              <>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="displayName">
                  Display name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); setError(''); }}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-colors"
            >
              {submitting
                ? (showNameField ? 'Creating account…' : 'Sending…')
                : (showNameField ? 'Create account & send code' : 'Continue')}
            </button>
            {showNameField && (
              <button
                type="button"
                onClick={() => { setShowNameField(false); setDisplayName(''); setError(''); }}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline self-center"
              >
                Use a different email
              </button>
            )}
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{email}</span>.
              Enter it below — it expires in 10 minutes.
            </p>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="code">
              One-time code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
              placeholder="123456"
              autoComplete="one-time-code"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-widest text-center text-xl"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-colors"
            >
              {submitting ? 'Verifying…' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={submitting}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline self-center disabled:opacity-60"
            >
              Resend code
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
