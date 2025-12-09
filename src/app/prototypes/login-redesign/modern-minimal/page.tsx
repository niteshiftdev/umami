'use client';
import { Column, Icon, Heading } from '@umami/react-zen';
import { Logo } from '@/components/svg';
import { useState } from 'react';

export default function ModernMinimalLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setError('Invalid credentials');
      } else {
        const data = await res.json();
        if (data.token) {
          window.location.href = '/websites';
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <Column
        alignItems="center"
        gap="8"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderRadius: '12px',
          padding: '3rem 2rem',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Icon size="lg" style={{ color: '#147af3' }}>
          <Logo />
        </Icon>

        <Column alignItems="center" gap="2">
          <Heading style={{ fontSize: '28px', fontWeight: 700 }}>umami</Heading>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Privacy-focused analytics</p>
        </Column>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Column gap="4" style={{ width: '100%' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#333',
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="admin"
                autoComplete="off"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#147af3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#333',
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#147af3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>

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

        <p style={{
          color: '#999',
          fontSize: '12px',
          textAlign: 'center',
          margin: '0.5rem 0 0 0',
        }}>
          Demo: admin / umami
        </p>
      </Column>
    </div>
  );
}
