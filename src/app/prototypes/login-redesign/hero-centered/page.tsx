'use client';
import { Column, Icon, Heading, Form, FormField, TextField, PasswordField, FormButtons, Row } from '@umami/react-zen';
import { Logo } from '@/components/svg';
import { useState } from 'react';

export default function HeroCenteredLogin() {
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d66cc 0%, #1a5fd6 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
    }}>
      {/* Hero section */}
      <Column alignItems="center" gap="4" style={{ marginTop: '3rem', marginBottom: '4rem', color: 'white', maxWidth: '600px' }}>
        <Icon size="lg" style={{ color: 'white' }}>
          <Logo />
        </Icon>

        <Heading style={{
          color: 'white',
          fontSize: '40px',
          fontWeight: 800,
          textAlign: 'center',
          margin: '0 0 8px 0',
        }}>
          umami
        </Heading>

        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '18px',
          textAlign: 'center',
          margin: 0,
          maxWidth: '500px',
          lineHeight: 1.5,
        }}>
          Privacy-focused analytics that respects your users while providing real-time insights
        </p>

        {/* Feature metrics */}
        <Row gap="6" style={{
          marginTop: '3rem',
          width: '100%',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '4px',
            }}>
              10K+
            </div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
            }}>
              Active Users
            </div>
          </div>

          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '4px',
            }}>
              100%
            </div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
            }}>
              Open Source
            </div>
          </div>

          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '4px',
            }}>
              ∞
            </div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
            }}>
              No Limits
            </div>
          </div>
        </Row>
      </Column>

      {/* Login form card */}
      <Column
        gap="5"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div>
          <Heading style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            Welcome Back
          </Heading>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: 0,
          }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Column gap="4" style={{ width: '100%' }}>
            <FormField label="Username" name="username">
              <TextField
                placeholder="admin"
                autoComplete="off"
                required
                style={{ borderRadius: '8px' }}
              />
            </FormField>

            <FormField label="Password" name="password">
              <PasswordField
                placeholder="••••••"
                required
                style={{ borderRadius: '8px' }}
              />
            </FormField>

            {error && (
              <div style={{
                color: '#d32f2f',
                fontSize: '13px',
                padding: '10px 12px',
                background: '#ffebee',
                borderRadius: '8px',
                borderLeft: '3px solid #d32f2f',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #147af3 0%, #0d66cc 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'opacity 0.2s, transform 0.1s',
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </Column>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #eee',
        }}>
          <p style={{
            color: '#999',
            fontSize: '12px',
            margin: 0,
          }}>
            Demo credentials: <strong>admin</strong> / <strong>umami</strong>
          </p>
        </div>
      </Column>

      {/* Footer */}
      <div style={{
        marginTop: '3rem',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0 }}>Privacy-focused web analytics for the modern web</p>
      </div>
    </div>
  );
}
