'use client';
import { Column, Row, Icon, Heading, Form, FormField, TextField, PasswordField, FormButtons } from '@umami/react-zen';
import { Logo } from '@/components/svg';
import { useState } from 'react';

export default function SplitLayoutLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left side - Value proposition */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, #147af3 0%, #0d66cc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        color: 'white',
      }}>
        <Column alignItems="center" gap="6">
          <Icon size="lg" style={{ color: 'white' }}>
            <Logo />
          </Icon>

          <Heading style={{ color: 'white', fontSize: '32px', fontWeight: 700, textAlign: 'center' }}>
            umami
          </Heading>

          <div style={{ fontSize: '16px', textAlign: 'center', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>
              Privacy-focused analytics that respects your users
            </p>

            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  minWidth: '24px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginTop: '2px',
                }}>✓</div>
                <div>
                  <strong>No cookies or tracking</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    Fully GDPR compliant
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  minWidth: '24px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginTop: '2px',
                }}>✓</div>
                <div>
                  <strong>Real-time insights</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    See metrics as they happen
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  minWidth: '24px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginTop: '2px',
                }}>✓</div>
                <div>
                  <strong>Open source</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    100% transparent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Column>
      </div>

      {/* Right side - Login form */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: '#f8f9fa',
      }}>
        <Column
          gap="6"
          style={{
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <div>
            <Heading style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              Sign In
            </Heading>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Column gap="4" style={{ width: '100%' }}>
              <FormField label="Username" name="username">
                <TextField placeholder="admin" autoComplete="off" required />
              </FormField>

              <FormField label="Password" name="password">
                <PasswordField placeholder="••••••" required />
              </FormField>

              {error && (
                <div style={{
                  color: '#d32f2f',
                  fontSize: '13px',
                  padding: '8px 12px',
                  background: '#ffebee',
                  borderRadius: '6px',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: '#147af3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#0d66cc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#147af3')}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </Column>
          </form>
        </Column>
      </div>
    </div>
  );
}
