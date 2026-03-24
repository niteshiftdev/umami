'use client';
import { useEffect, useState } from 'react';

export function GeocitiesMarquee() {
  return (
    <div className="geocities-marquee-bar">
      <div className="geocities-marquee-text">
        ~*~*~ WELCOME TO MY AWESOME ANALYTICS PAGE ~*~*~ You are visitor # <VisitorNumber /> ~*~*~
        Please sign my guestbook!!! ~*~*~ This site is ALWAYS under construction ~*~*~ Best viewed
        in 800x600 resolution ~*~*~
      </div>
    </div>
  );
}

export function GeocitiesUnderConstruction() {
  return (
    <div className="geocities-under-construction">
      <span className="geocities-construction-emoji">&#x1F6A7;</span>
      <span>!! THIS PAGE IS UNDER CONSTRUCTION !!</span>
      <span className="geocities-construction-emoji">&#x1F6A7;</span>
    </div>
  );
}

function VisitorNumber() {
  const [count, setCount] = useState(13370);

  useEffect(() => {
    const stored = localStorage.getItem('geocities-visitor-count');
    if (stored) {
      setCount(Number(stored) + 1);
    }
    localStorage.setItem('geocities-visitor-count', String(count + 1));
  }, []);

  return <span>{String(count).padStart(7, '0')}</span>;
}

export function GeocitiesVisitorCounter() {
  const [count, setCount] = useState(13370);

  useEffect(() => {
    const stored = localStorage.getItem('geocities-visitor-count');
    if (stored) {
      setCount(Number(stored));
    }
  }, []);

  return (
    <div className="geocities-visitor-counter">
      <div>You are visitor number:</div>
      <div className="geocities-counter-display">{String(count).padStart(7, '0')}</div>
      <div style={{ marginTop: 4, fontSize: 10, color: '#666' }}>
        (counter powered by GeoCities WebCounter v3.2)
      </div>
    </div>
  );
}

export function GeocitiesBadge() {
  return (
    <div className="geocities-badge">
      <div style={{ marginBottom: 4 }}>
        <span
          style={{
            border: '1px solid #444',
            padding: '2px 6px',
            backgroundColor: '#222',
            fontSize: 10,
          }}
        >
          &#x1F4E7; Best viewed with Netscape Navigator 4.0 at 800x600
        </span>
      </div>
      <div>
        Made with &#x2764;&#xFE0F; on GeoCities | &copy; 1997 |{' '}
        <a href="#" onClick={e => e.preventDefault()}>
          Sign My Guestbook
        </a>{' '}
        |{' '}
        <a href="#" onClick={e => e.preventDefault()}>
          View Guestbook
        </a>
      </div>
    </div>
  );
}

export function GeocitiesWebring() {
  return (
    <div className="geocities-webring">
      <div className="geocities-webring-title">&#x1F517; Web Analytics WebRing &#x1F517;</div>
      <div>
        [&nbsp;
        <a href="#" onClick={e => e.preventDefault()}>
          &lt;&lt; Prev
        </a>
        &nbsp;|&nbsp;
        <a href="#" onClick={e => e.preventDefault()}>
          Random
        </a>
        &nbsp;|&nbsp;
        <a href="#" onClick={e => e.preventDefault()}>
          Next &gt;&gt;
        </a>
        &nbsp;]
      </div>
    </div>
  );
}

export function GeocitiesGuestbook() {
  return (
    <div className="geocities-guestbook">
      <a href="#" onClick={e => e.preventDefault()}>
        &#x1F4D6; SIGN MY GUESTBOOK!! &#x1F4D6;
      </a>
    </div>
  );
}

export function GeocitiesHR() {
  return <hr className="geocities-hr" />;
}

export function GeocitiesSidebarFooter() {
  return (
    <div className="geocities-sidebar-decoration">
      <div style={{ marginBottom: 6 }}>
        <span className="geocities-fire-emoji">&#x1F525;</span>{' '}
        <span style={{ color: '#ff6666' }}>HOT LINKS</span>{' '}
        <span className="geocities-fire-emoji">&#x1F525;</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 10 }}>
          &#x2B50; Cool Site Award &#x2B50;
        </a>
      </div>
      <GeocitiesGuestbook />
      <GeocitiesWebring />
      <div style={{ marginTop: 8, fontSize: 9, color: '#555' }}>
        Last updated: Jan 15, 1998
        <br />
        Site hosted on GeoCities
        <br />
        Area: SiliconValley/Hub/4269
      </div>
    </div>
  );
}
