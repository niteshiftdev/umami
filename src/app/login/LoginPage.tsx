'use client';
import { Column } from '@umami/react-zen';
import {
  GeocitiesBadge,
  GeocitiesHR,
  GeocitiesWebring,
} from '@/components/common/GeocitiesElements';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <Column
      alignItems="center"
      height="100vh"
      paddingTop="6"
      style={{ backgroundColor: '#000033' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div
          style={{
            fontSize: 12,
            color: '#ffff00',
            animation: 'marquee 10s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          ~*~ Welcome to my AWESOME analytics homepage ~*~
        </div>
      </div>
      <div className="geocities-login-wrapper">
        <div className="geocities-login-title">umami</div>
        <div className="geocities-login-subtitle">~*~ MEMBERS ONLY AREA ~*~</div>
        <GeocitiesHR />
        <div style={{ padding: '16px 0' }}>
          <LoginForm />
        </div>
        <GeocitiesHR />
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            color: '#888',
            textAlign: 'center',
          }}
        >
          Authorized users only!! No hackers allowed!!!
        </div>
      </div>
      <div style={{ marginTop: 16, width: '90%', maxWidth: 400 }}>
        <GeocitiesWebring />
      </div>
      <div style={{ marginTop: 'auto', width: '100%' }}>
        <GeocitiesBadge />
      </div>
    </Column>
  );
}
