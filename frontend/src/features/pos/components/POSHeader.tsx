import { useEffect, useState } from 'react';

export function POSHeader() {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="pos-header">
      <div>
        <p className="pos-header__eyebrow">Counter workspace</p>
        <h1>CAFÉ POS &amp; BILLING</h1>
      </div>
      <div className="pos-header__meta">
        <span className="status-pill"><span aria-hidden="true" />Online</span>
        <time dateTime={currentTime.toISOString()}>
          {currentTime.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
        </time>
      </div>
    </header>
  );
}
