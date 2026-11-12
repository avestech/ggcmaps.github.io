// components/FloorMapView.js
'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ZoomPan from './ZoomPan';
import OverlayHUD from './OverlayHUD';
import { sanitizeSvgMarkup } from '../lib/svgUtils';
import { getAssetPath } from '../lib/assetUtils';
import { getNextFloor, getPreviousFloor } from '../lib/floorNavigation';
import { useLanguage } from './LanguageContext';
import { getUIText } from '../lib/i18n';

// FloorMapView component for rendering an interactive floor map
export default function FloorMapView({ 
  src, 
  interactiveSelector = '.room-group, .room, .label',
  buildingData,
  currentFloorId,
  onFloorChange,
  onRoomSelect,
  roomToHighlight
}) {
  const [svgContent, setSvgContent] = useState('');
  // Keep React from replacing the highlighted SVG during URL-only renders.
  const svgMarkup = useMemo(() => ({ __html: svgContent }), [svgContent]);
  const containerRef = useRef(null);
  const [selectedId, setSelectedId] = useState(roomToHighlight);
  const { locale } = useLanguage();
  const ui = getUIText(locale);

  // Find current floor index and data
  const floors = buildingData?.floors || [];
  const currentFloorIndex = floors.findIndex(floor => floor.id === currentFloorId);

  // Floor navigation handlers
  const goToUpperFloor = () => {
    const next = getNextFloor(floors, currentFloorId);
    if (next) onFloorChange(next.id);
  };

  const goToLowerFloor = () => {
    const prev = getPreviousFloor(floors, currentFloorId);
    if (prev) onFloorChange(prev.id);
  };

  // Handles the selection of a room or area on the map
  const handleSelect = useCallback((id) => {
    if (id) {
      setSelectedId(String(id).trim()); // Update the selected ID state
      if (onRoomSelect) {
        onRoomSelect(String(id).trim()); // Notify parent of room selection
      }
    }
  }, [onRoomSelect]);

  // URL changes (including Back/Forward) and floor changes reset the selection.
  useEffect(() => {
    setSelectedId(roomToHighlight);
  }, [roomToHighlight, src]);

  // Apply both clicked and linked selections once the SVG is available.
  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;
    svg.querySelectorAll('.active-room, .label--active, [aria-selected]').forEach(el => {
      el.classList.remove('active-room', 'label--active');
      el.removeAttribute('aria-selected');
    });
    if (!selectedId) return;

    // Compare IDs directly so URL values are never interpreted as CSS selectors.
    const target = Array.from(svg.querySelectorAll('[id]')).find(el => el.id === selectedId);
    if (!target) return;
    target.classList.add('active-room');
    target.setAttribute('aria-selected', 'true');
    const shape = target.querySelector('.room') || target.querySelector('rect, polygon, path');
    const label = target.querySelector('.label') || target.querySelector('text');
    if (shape) {
      shape.classList.add('active-room');
      shape.parentElement.appendChild(shape);
    }
    if (label) {
      label.classList.add('label--active');
      label.parentElement.appendChild(label);
    }
  }, [selectedId, svgContent]);

  // Load SVG as text so events bubble to ZoomPan
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const assetSrc = getAssetPath(src);
        const res = await fetch(assetSrc, { cache: 'no-cache' });
        const raw = await res.text();
        const sanitized = sanitizeSvgMarkup(raw);
        if (isMounted) setSvgContent(sanitized);
      } catch {
        if (isMounted) setSvgContent('<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20">Failed to load map</text></svg>');
      }
    })();
    return () => { isMounted = false; };
  }, [src]);

  // Post-process injected SVG: sizing, disable links, and click selection
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    // Normalize SVG sizing for responsive layout
    const svg = container.querySelector('svg');
    if (svg) {
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.display = 'block';
    }

    // Disable navigation inside the SVG
    container.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.setAttribute('data-original-href', href);
        link.removeAttribute('href');
      }
    });

    // Delegate click to capture element IDs
    const onClick = (e) => {
      const clickable = e.target.closest(interactiveSelector);
      if (!clickable) return;
      e.preventDefault();
      const group = clickable.closest('.room-group');
      const idSource = group?.id || clickable.id || clickable.getAttribute('id');
      if (idSource) {
        handleSelect(idSource.trim());
      }
    };

    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [svgContent, interactiveSelector, handleSelect]);

  return (
    <div className="map-wrap" data-building={buildingData?.id}>
      <ZoomPan
        ref={containerRef}
        initialScale={1}
        minScale={0.1}
        maxScale={6}
        className="map-viewport"
        disableDoubleClickZoom={true}
        autoFit={false}
        fitPadding={0}
        fitScaleMultiplier={0.70}
        resetLabel={ui.overlay.resetLabel}
        resetAriaLabel={ui.overlay.resetAria}
      >
        <div
          className="w-100 h-100"
          style={{ pointerEvents: 'auto' }}
          dangerouslySetInnerHTML={svgMarkup}
        />
      </ZoomPan>

      <OverlayHUD buildingData={buildingData} currentFloorId={currentFloorId} onFloorChange={onFloorChange} isFloorView={true} />
    </div>
  );
}
