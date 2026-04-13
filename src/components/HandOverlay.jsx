import { useRef, useEffect, useCallback } from 'react';

const HAND_CONN = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];
const TIPS = new Set([4, 8, 12, 16, 20]);

export default function HandOverlay({
  landmarks, gesture,
  pinchHoldMs, hand1PinchMid,
  scalpelHand, scalpelTrail,
  thumbPinkyHoldMs,
}) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const mx = x => (1 - x) * W;
    const my = y => y * H;

    // ── 1. Hand skeleton — SMALL ─────────────────────────────────────────────
    if (landmarks?.length) {
      landmarks.forEach((hand, hi) => {
        if (!hand?.length) return;
        const color = hi === 0 ? 'rgba(0,212,255,0.65)' : 'rgba(0,255,136,0.65)';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.0; // was 1.8
        HAND_CONN.forEach(([a, b]) => {
          if (!hand[a] || !hand[b]) return;
          ctx.beginPath();
          ctx.moveTo(mx(hand[a].x), my(hand[a].y));
          ctx.lineTo(mx(hand[b].x), my(hand[b].y));
          ctx.stroke();
        });

        hand.forEach((pt, i) => {
          if (!pt) return;
          const isTip = TIPS.has(i);
          ctx.beginPath();
          ctx.arc(mx(pt.x), my(pt.y), isTip ? 2.5 : 1.5, 0, Math.PI * 2); // was 5 and 3
          ctx.fillStyle = isTip ? '#ff4757' : (hi === 0 ? '#00d4ff' : '#00ff88');
          ctx.fill();
        });
      });
    }

    // ── 2. Pinch hold indicator ───────────────────────────────────────────────
    if (hand1PinchMid && pinchHoldMs > 0) {
      const px = mx(hand1PinchMid.x);
      const py = my(hand1PinchMid.y);
      const progress  = Math.min(1, pinchHoldMs / 1000); // 1 second now
      const isComplete = progress >= 1;

      // Background ring
      ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2.5; ctx.stroke();

      // Progress arc
      if (progress > 0) {
        ctx.beginPath();
        ctx.arc(px, py, 20, -Math.PI/2, -Math.PI/2 + progress * Math.PI * 2);
        ctx.strokeStyle = isComplete ? '#ff0000' : `rgba(255,${100-Math.round(progress*100)},${100-Math.round(progress*100)},0.95)`;
        ctx.lineWidth = 2.5; ctx.stroke();
      }

      // Center dot
      ctx.beginPath(); ctx.arc(px, py, isComplete ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isComplete ? '#ff0000' : `rgba(255,70,70,${0.5+progress*0.5})`; ctx.fill();

      // Pulse ring when complete
      if (isComplete) {
        ctx.beginPath(); ctx.arc(px, py, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,0,0,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }

    // ── 3. Scalpel cursor ────────────────────────────────────────────────────
    if (gesture === 'SCALPEL' && scalpelHand?.indexTip) {
      const tip = scalpelHand.indexTip;
      const sx = mx(tip.x), sy = my(tip.y);

      let angle = -Math.PI / 4;
      if (landmarks) {
        for (const hand of landmarks) {
          if (!hand?.length) continue;
          if (Math.hypot(mx(hand[8].x) - sx, my(hand[8].y) - sy) < 10) {
            const k = hand[5];
            if (k) angle = Math.atan2(my(tip.y) - my(k.y), mx(tip.x) - mx(k.x));
            break;
          }
        }
      }

      ctx.save(); ctx.translate(sx, sy); ctx.rotate(angle + Math.PI/2);

      // ── Jarrohlik pichoq (scalpel) — to'g'ri shakl ──
      // Dasta (handle)
      ctx.beginPath();
      ctx.roundRect(-4, 2, 8, 22, 2);
      ctx.fillStyle = 'rgba(180,180,200,0.92)'; ctx.fill();
      ctx.strokeStyle = 'rgba(120,120,140,0.8)'; ctx.lineWidth = 0.5; ctx.stroke();

      // Tutqich o'rovi
      ctx.beginPath();
      for (let yi = 6; yi < 22; yi += 4) {
        ctx.moveTo(-3, yi); ctx.lineTo(3, yi);
      }
      ctx.strokeStyle = 'rgba(80,80,100,0.5)'; ctx.lineWidth = 1; ctx.stroke();

      // Pichoq tigi (blade) — keskin uchli
      ctx.beginPath();
      ctx.moveTo(-4, 2);     // chap yon
      ctx.lineTo(4, 2);      // o'ng yon
      ctx.lineTo(1.5, -26);  // o'ng qirrasi (biroz egik)
      ctx.lineTo(0, -30);    // uch
      ctx.lineTo(-1.5, -26); // chap qirra
      ctx.closePath();
      ctx.fillStyle = 'rgba(220,225,240,0.95)'; ctx.fill();

      // Tiga — metall aks
      ctx.beginPath();
      ctx.moveTo(0, -30); ctx.lineTo(1.5, -26); ctx.lineTo(0.5, -10);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1; ctx.stroke();

      // Qo'riqchi (guard)
      ctx.beginPath();
      ctx.roundRect(-6, 0, 12, 4, 1);
      ctx.fillStyle = 'rgba(100,100,120,0.9)'; ctx.fill();

      ctx.restore();

      // Qizil nuqta — uch joyi
      ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,30,30,0.9)'; ctx.fill();
    }

    // ── 4. Scalpel trail — PERSISTENT (ESC gacha saqlanadi) ────────────────
    if (scalpelTrail?.length > 1) {
      // Gradient qizil chiziq
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < scalpelTrail.length; i++) {
        const p0 = scalpelTrail[i - 1];
        const p1 = scalpelTrail[i];
        const progress = i / scalpelTrail.length;
        // Yangi nuqtalar yorqinroq, eski nuqtalar biroz so'niq
        const alpha = 0.55 + progress * 0.4;
        ctx.beginPath();
        ctx.moveTo(p0.x * W, p0.y * H);
        ctx.lineTo(p1.x * W, p1.y * H);
        ctx.strokeStyle = `rgba(255,40,40,${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Boshlang'ich nuqta — kichik doira
      const first = scalpelTrail[0];
      ctx.beginPath();
      ctx.arc(first.x * W, first.y * H, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,80,80,0.7)';
      ctx.fill();

      // Oxirgi nuqta — kichik doira
      const last = scalpelTrail[scalpelTrail.length - 1];
      ctx.beginPath();
      ctx.arc(last.x * W, last.y * H, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,30,30,0.9)';
      ctx.fill();

      ctx.restore();
    }

    // ── 5. Model switch progress ──────────────────────────────────────────────
    if ((gesture === 'NEXT_MODEL' || gesture === 'PREV_MODEL') && thumbPinkyHoldMs > 0) {
      const progress = Math.min(1, thumbPinkyHoldMs / 1500);
      const label = gesture === 'NEXT_MODEL' ? '→ Keyingisi' : '← Oldingisi';
      const cx = W / 2, cy = H - 65, barW = 180;

      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.roundRect(cx - barW/2 - 16, cy - 20, barW + 32, 46, 8); ctx.fill();

      ctx.font = `bold 14px monospace`;
      ctx.fillStyle = `rgba(0,212,255,${0.5 + progress*0.5})`;
      ctx.textAlign = 'center'; ctx.fillText(label, cx, cy + 1);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.roundRect(cx - barW/2, cy + 12, barW, 5, 2); ctx.fill();
      ctx.fillStyle = progress >= 1 ? '#00ff88' : '#00d4ff';
      ctx.roundRect(cx - barW/2, cy + 12, barW * progress, 5, 2); ctx.fill();
    }

  }, [landmarks, gesture, pinchHoldMs, hand1PinchMid, scalpelHand, scalpelTrail, thumbPinkyHoldMs]);

  const drawRef = useRef(draw);
  useEffect(() => { drawRef.current = draw; }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      // devicePixelRatio orqali to'g'ri piksel o'lchami
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      // Canvas CSS o'lchamlari o'zgarmaydi
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      // Resize dan keyin qayta chizish
      drawRef.current?.();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:50 }} />
  );
}