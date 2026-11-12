'use client';
import { useEffect, useRef, useState } from 'react';

export default function RoomSharePopup({ url, roomLabel, copy, onClose }) {
  const popupRef = useRef(null);
  const linkRef = useRef(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const previousFocus = document.activeElement;
    const popup = popupRef.current;
    linkRef.current.focus({ preventScroll: true });
    linkRef.current.select();
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (popup.contains(document.activeElement) && previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      // Clipboard access may be unavailable on a phone's local HTTP preview.
      linkRef.current?.focus({ preventScroll: true });
      linkRef.current?.select();
      setStatus('manual');
    }
  };

  return (
    <section ref={popupRef} className="room-share-popup" role="dialog" aria-labelledby="room-share-title" aria-describedby="room-share-location">
      <div className="room-share-heading">
        <h2 id="room-share-title">{copy.title}</h2>
        <button type="button" className="room-share-close" aria-label={copy.close} onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <p id="room-share-location">{roomLabel}</p>
      <label htmlFor="room-share-link">{copy.linkLabel}</label>
      <input ref={linkRef} id="room-share-link" type="text" readOnly value={url} onFocus={event => event.target.select()} />
      <button type="button" className="btn btn-primary room-share-copy" onClick={copyLink}>
        <i className="bi bi-link-45deg" aria-hidden="true" /> {copy.copyLink}
      </button>
      <p className="room-share-status" role="status">
        {status === 'copied' ? copy.copied : status === 'manual' ? copy.manualCopy : copy.hint}
      </p>
    </section>
  );
}
