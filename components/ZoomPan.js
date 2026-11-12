'use client';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// ZoomPan component allows for zooming and panning of its children
const ZoomPan = forwardRef(function ZoomPan({
  children,
  className = '',
  minScale = 0.5,
  maxScale = 4,
  initialScale = 1,
  wheelStep = 0.0005, 
  dblClickStep = 0.25,
  disableDoubleClickZoom = false,
  showControls = true,
  autoFit = false,
  fitPadding = 24,
  fitScaleMultiplier = 1,
  resetLabel = 'Reset',
  resetAriaLabel = 'Reset view'
}, forwardedRef) {
  const viewportRef = useRef(null);
  const setViewportRef = useCallback(
    (node) => {
      viewportRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );
  const [scale, setScale] = useState(initialScale);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const initialPosRef = useRef(null);
  const userHasDragged = useRef(false);

  // Clamp value between min and max
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const getCenteredPos = (rect, bounds, nextScale) => ({
    x: rect.width / (2 * nextScale) - (bounds.x + bounds.width / 2),
    y: rect.height / (2 * nextScale) - (bounds.y + bounds.height / 2)
  });

  const getAnchorBounds = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return null;
    const inner = vp.firstElementChild;
    if (!(inner instanceof HTMLElement)) return null;
    const svg = inner.querySelector('svg');
    if (!svg) return null;
    const candidate =
      svg.querySelector('[data-map-anchor]') ||
      svg.querySelector('.campus') ||
      svg;

    if (!(candidate instanceof SVGGraphicsElement)) return null;

    try {
      if (candidate === svg) {
        const viewBox = svg.viewBox?.baseVal;
        if (
          viewBox &&
          Number.isFinite(viewBox.width) &&
          Number.isFinite(viewBox.height) &&
          viewBox.width > 0 &&
          viewBox.height > 0
        ) {
          return {
            x: viewBox.x,
            y: viewBox.y,
            width: viewBox.width,
            height: viewBox.height
          };
        }
      }

      const bbox = candidate.getBBox();
      if (!Number.isFinite(bbox.width) || !Number.isFinite(bbox.height) || bbox.width <= 0 || bbox.height <= 0) {
        return null;
      }
      return bbox;
    } catch {
      return null;
    }
  }, []);

  // Set scale at a specific point
  const setScaleAt = useCallback(
    (next, cx, cy, isAutoFit = false) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();

      const prev = scale;
      next = clamp(next, minScale, maxScale);

      const bounds = getAnchorBounds();
      if (bounds && isAutoFit && !userHasDragged.current) {
        setPos(getCenteredPos(rect, bounds, next));
        setScale(next);
        return;
      }

      if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 2;
      }

      const px = cx - rect.left;
      const py = cy - rect.top;

      // The point on the content that is under the cursor
      const contentX = px / prev - pos.x;
      const contentY = py / prev - pos.y;

      // The new position of that point after scaling
      const newPosX = px / next - contentX;
      const newPosY = py / next - contentY;

      setPos({ x: newPosX, y: newPosY });
      setScale(next);
    },
    [scale, pos.x, pos.y, minScale, maxScale, getAnchorBounds]
  );

  const getViewportCenter = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return null;
    const rect = vp.getBoundingClientRect();
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2
    };
  }, []);

  const zoomByMultiplier = useCallback(
    (multiplier) => {
      const center = getViewportCenter();
      if (!center) return;
      setScaleAt(scale * multiplier, center.cx, center.cy);
    },
    [getViewportCenter, scale, setScaleAt]
  );

  const fitToBounds = useCallback(
    ({ force = false, padding = fitPadding } = {}) => {
      if (!force && userHasDragged.current) return false;

      const vp = viewportRef.current;
      if (!vp) return false;
      const rect = vp.getBoundingClientRect();
      if (!(rect.width > 0 && rect.height > 0)) return false;

      const bounds = getAnchorBounds();
      if (!bounds) return false;

      const safePadding = Math.max(0, Number.isFinite(padding) ? padding : 0);
      const usableWidth = rect.width - safePadding * 2;
      const usableHeight = rect.height - safePadding * 2;
      if (!(usableWidth > 0 && usableHeight > 0)) return false;

      const scaleX = usableWidth / bounds.width;
      const scaleY = usableHeight / bounds.height;
      const proposedScale = Math.min(scaleX, scaleY);
      if (!Number.isFinite(proposedScale) || proposedScale <= 0) return false;

      const scaled = proposedScale * fitScaleMultiplier;
      const nextScale = clamp(scaled, minScale, maxScale);
      const nextPos = getCenteredPos(rect, bounds, nextScale);

      setScale(nextScale);
      setPos(nextPos);
      userHasDragged.current = false;
      return true;
    },
    [fitPadding, fitScaleMultiplier, getAnchorBounds, maxScale, minScale]
  );

  const resetView = useCallback(() => {
    if (autoFit && fitToBounds({ force: true })) {
      userHasDragged.current = false;
      return;
    }

    // If we've stored an initial position, use it
    if (initialPosRef.current) {
      setScale(initialScale);
      setPos(initialPosRef.current);
      userHasDragged.current = false;
      return;
    }

    const nextScale = clamp(initialScale, minScale, maxScale);
    let nextPos = { x: 0, y: 0 };

    const vp = viewportRef.current;
    if (vp) {
      const rect = vp.getBoundingClientRect();
      const bounds = getAnchorBounds();
      if (bounds) {
        nextPos = getCenteredPos(rect, bounds, nextScale);
      }
    }

    setScale(nextScale);
    setPos(nextPos);
    userHasDragged.current = false;
  }, [autoFit, fitToBounds, initialScale, minScale, maxScale, getAnchorBounds]);

  useEffect(() => {
    resetView();
    // Store the initial position after resetView calculates it
    setPos((initialPos) => {
      initialPosRef.current = initialPos;
      return initialPos;
    });
  }, [resetView]);

  // ----- Pointer drag pan and two-finger pinch -----
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  const drag = useRef({
    active: false,
    id: null,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    captured: false,
    dragged: false
  });
  const TAP_SLOP = 4; // px before we consider it a drag

  const startPinch = () => {
    const [a, b] = Array.from(pointers.current.values());
    const rect = viewportRef.current.getBoundingClientRect();
    pinch.current = {
      distance: Math.hypot(b.x - a.x, b.y - a.y),
      scale,
      contentX: ((a.x + b.x) / 2 - rect.left) / scale - pos.x,
      contentY: ((a.y + b.y) / 2 - rect.top) / scale - pos.y
    };
    drag.current.active = false;
    drag.current.dragged = true;
    drag.current._suppressClickOnce = true;
    userHasDragged.current = true;
  };

  // Handle pointer down event
  const onPointerDown = (e) => {
    if (e.target.closest('button') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2) {
      startPinch();
      for (const id of pointers.current.keys()) {
        e.currentTarget.setPointerCapture(id);
      }
      return;
    }
    drag.current = {
      active: true,
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      captured: false,
      dragged: false
    };
  };

  // Handle pointer move event
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current) {
      const [a, b] = Array.from(pointers.current.values());
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      // Coincident fingers have no usable starting distance yet.
      if (!pinch.current.distance) {
        startPinch();
        return;
      }
      const nextScale = clamp(pinch.current.scale * distance / pinch.current.distance, minScale, maxScale);
      const rect = e.currentTarget.getBoundingClientRect();
      setScale(nextScale);
      setPos({
        x: ((a.x + b.x) / 2 - rect.left) / nextScale - pinch.current.contentX,
        y: ((a.y + b.y) / 2 - rect.top) / nextScale - pinch.current.contentY
      });
      return;
    }
    if (!drag.current.active || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    const dist = Math.hypot(dx, dy);

    // Acquire capture only after moving past the threshold
    if (!drag.current.captured && dist > TAP_SLOP) {
      drag.current.captured = true;
      drag.current.dragged = true;
      userHasDragged.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (drag.current.captured) {
      setPos({
        x: drag.current.origX + dx / scale,
        y: drag.current.origY + dy / scale
      });
    }
  };

  // Handle pointer up event
  const onPointerUp = (e) => {
    // Ignore capture transferred from an SVG child to this viewport.
    if (e.type === 'lostpointercapture' && e.target !== e.currentTarget) return;
    if (!pointers.current.delete(e.pointerId)) return;
    if (pinch.current) {
      pinch.current = null;
      drag.current._suppressClickOnce = true;
      if (pointers.current.size >= 2) {
        startPinch();
      } else if (pointers.current.size === 1) {
        const [id, point] = pointers.current.entries().next().value;
        // Continue panning from the current view without jumping after a pinch.
        drag.current = {
          active: true, id, startX: point.x, startY: point.y,
          origX: pos.x, origY: pos.y, captured: true, dragged: true,
          _suppressClickOnce: true
        };
      } else {
        drag.current.active = false;
        drag.current.captured = false;
      }
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
      return;
    }
    if (drag.current.id === e.pointerId) {
      if (drag.current.captured) {
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
      }
      // Reset; if not dragged, the native click will go to the SVG target
      drag.current.active = false;
      drag.current.captured = false;
      // If it was a drag, suppress the synthetic click on the container
      drag.current._suppressClickOnce = drag.current.dragged;
      drag.current.dragged = false;
    }
  };

  // Suppress container-level click after a drag so it doesn't interfere
  const onClickCapture = (e) => {
    if (e.target.closest('button')) return;
    if (drag.current._suppressClickOnce) {
      drag.current._suppressClickOnce = false;
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // ----- Non-passive wheel + touchmove listeners -----
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    // Handle wheel event for zooming
    const onWheel = (e) => {
      e.preventDefault();
      const vp = viewportRef.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      const pointerCx = typeof e.clientX === 'number' ? e.clientX : rect.left + rect.width / 2;
      const pointerCy = typeof e.clientY === 'number' ? e.clientY : rect.top + rect.height / 2;
      const multiplier = Math.exp(-e.deltaY * wheelStep);
      setScaleAt(scale * multiplier, pointerCx, pointerCy);
    };

    // Prevent default touchmove behavior for multi-touch
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel, { passive: false });
      el.removeEventListener('touchmove', onTouchMove, { passive: false });
    };
  }, [scale, wheelStep, setScaleAt]);

  // Handle double-click event for zooming
  const onDoubleClick = (e) => {
    if (disableDoubleClickZoom) return;
    e.preventDefault();
    const center = getViewportCenter();
    const anchorCx = userHasDragged.current && typeof e.clientX === 'number'
      ? e.clientX
      : center?.cx ?? (typeof e.clientX === 'number' ? e.clientX : 0);
    const anchorCy = userHasDragged.current && typeof e.clientY === 'number'
      ? e.clientY
      : center?.cy ?? (typeof e.clientY === 'number' ? e.clientY : 0);
    setScaleAt(scale * (1 + dblClickStep), anchorCx, anchorCy);
  };

  // Handle keyboard events for zooming and panning
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === '+' || e.key === '=') {
        const centerPoint = getViewportCenter();
        const anchorCx = centerPoint?.cx ?? innerWidth / 2;
        const anchorCy = centerPoint?.cy ?? innerHeight / 2;
        setScaleAt(scale * 1.1, anchorCx, anchorCy);
      }
      if (e.key === '-' || e.key === '_') {
        const centerPoint = getViewportCenter();
        const anchorCx = centerPoint?.cx ?? innerWidth / 2;
        const anchorCy = centerPoint?.cy ?? innerHeight / 2;
        setScaleAt(scale / 1.1, anchorCx, anchorCy);
      }
      if (e.key === '0') {
        resetView();
      }
      if (e.key === 'ArrowLeft') {
        userHasDragged.current = true;
        setPos((p) => ({ ...p, x: p.x + 30 / scale }));
      }
      if (e.key === 'ArrowRight') {
        userHasDragged.current = true;
        setPos((p) => ({ ...p, x: p.x - 30 / scale }));
      }
      if (e.key === 'ArrowUp') {
        userHasDragged.current = true;
        setPos((p) => ({ ...p, y: p.y + 30 / scale }));
      }
      if (e.key === 'ArrowDown') {
        userHasDragged.current = true;
        setPos((p) => ({ ...p, y: p.y - 30 / scale }));
      }
    };

    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [scale, setScaleAt, resetView, getViewportCenter]);

  const zoomIn = useCallback(() => zoomByMultiplier(1.15), [zoomByMultiplier]);
  const zoomOut = useCallback(() => zoomByMultiplier(1 / 1.15), [zoomByMultiplier]);

  useLayoutEffect(() => {
    if (!autoFit) return;

    let cancelled = false;
    let rafId = null;
    let attempts = 0;

    const scheduleFit = () => {
      if (cancelled || userHasDragged.current) return;
      const success = fitToBounds();
      attempts += 1;
      if (!success && attempts < 60) {
        rafId = requestAnimationFrame(scheduleFit);
      }
    };

    scheduleFit();

    const vp = viewportRef.current;
    let resizeObserver = null;
    let mutationObserver = null;
    if (typeof ResizeObserver !== 'undefined' && vp) {
      resizeObserver = new ResizeObserver(() => {
        if (!cancelled && !userHasDragged.current) {
          attempts = 0;
          scheduleFit();
        }
      });
      resizeObserver.observe(vp);
    }

    if (typeof MutationObserver !== 'undefined' && vp) {
      mutationObserver = new MutationObserver(() => {
        if (!cancelled && !userHasDragged.current) {
          attempts = 0;
          scheduleFit();
        }
      });
      mutationObserver.observe(vp, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [autoFit, fitToBounds]);

  return (
    <div
      ref={setViewportRef}
      className={className}
      onDoubleClick={onDoubleClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
      onClickCapture={onClickCapture}
        style={{
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none',
          overscrollBehavior: 'contain',
          background: 'transparent',
          cursor: drag.current.captured ? 'grabbing' : 'grab'
        }}
    >
      <div
        className="zoompan-stage"
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate(${pos.x}px, ${pos.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {children}
      </div>
      {showControls && (
        <div
          className="zoompan-controls-container"
        >
          <div className="zoompan-controls" style={{ pointerEvents: 'auto' }}>
            <button
              type="button"
              className="zoom-btn zoom-in"
              onClick={zoomIn}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <span aria-hidden="true">+</span>
            </button>

            <button
              type="button"
              className="zoom-reset-btn"
              onClick={resetView}
              aria-label={resetAriaLabel}
              title={resetAriaLabel}
            >
              <span className="mx-2" aria-hidden="true">{resetLabel}</span>
            </button>

            <button
              type="button"
              className="zoom-btn zoom-out"
              onClick={zoomOut}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <span aria-hidden="true">−</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ZoomPan;
