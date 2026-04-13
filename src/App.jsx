import { useState, useRef, useEffect, useCallback } from 'react';
import ModelScene     from './components/ModelScene';
import CameraFeed     from './components/CameraFeed';
import VoiceAssistant from './components/VoiceAssistant';
import ModelSwitcher  from './components/ModelSwitcher';
import HandOverlay    from './components/HandOverlay';
import PartDetailView from './components/PartDetailView';
import LogViewer      from './components/LogViewer';
import useHandTracking from './hooks/useHandTracking';
import useVoiceAI     from './hooks/useVoiceAI';
import { MODELS, DEFAULT_MODEL_ID } from './config/models';
import { createLogger } from './utils/logger';
import GuidePage from './components/GuidePage';

const log = createLogger('APP');
const MAX_SCALE      = 8.0;
const MIN_SCALE      = 0.1;
const ROTATION_SIGN  = -1;
const PINCH_HOLD_MS  = 400;
const SWITCH_HOLD_MS = 600;

export default function App({ onOpenQuiz }) {
  const videoRef = useRef(null);
  const [showGuide, setShowGuide] = useState(true); // har safar ko'rinadi

  const [activeModelIdx, setActiveModelIdx] = useState(
    Math.max(0, MODELS.findIndex(m => m.id === DEFAULT_MODEL_ID))
  );
  const activeModel = MODELS[activeModelIdx] || MODELS[0];

  const [rotation,      setRotation]     = useState({ x:0, y:0 });
  const [scale,         setScale]        = useState(1.0);
  const [selectedPart,  setSelectedPart] = useState(null);       // { key, label }
  const [selectedMeshRawData, setSelectedMeshRawData] = useState(null); // geometry arrays
  const [highlightPart, setHighlightPart]= useState(null);
  const [hoverLabel,    setHoverLabel]   = useState(null);
  const [explodeOpen,   setExplodeOpen]  = useState(false);
  const [pinchPoint,    setPinchPoint]   = useState(null);

  const [pinchHoldMs,      setPinchHoldMs]      = useState(0);
  const [thumbPinkyHoldMs, setThumbPinkyHoldMs] = useState(0);
  const [scalpelTrail,     setScalpelTrail]     = useState([]);
  const [showQuizSelect,   setShowQuizSelect]   = useState(false);

  const hand  = useHandTracking(videoRef);
  const voice = useVoiceAI();

  const handRef         = useRef(hand);
  const selectedPartRef = useRef(selectedPart);
  const activeModelRef  = useRef(activeModel);
  const scalpelTrailRef = useRef(scalpelTrail);

  useEffect(()=>{handRef.current=hand;},[hand]);
  useEffect(()=>{selectedPartRef.current=selectedPart;},[selectedPart]);
  useEffect(()=>{activeModelRef.current=activeModel;},[activeModel]);
  useEffect(()=>{scalpelTrailRef.current=scalpelTrail;},[scalpelTrail]);

  const prevPalmRef    = useRef(null);
  const voiceActiveRef = useRef(false);
  const explodeTogRef  = useRef(false);
  const deselectRef    = useRef(false);
  const pinchStartRef  = useRef(null);
  const pinchFiredRef  = useRef(false);
  const switchStartRef = useRef(null);
  const switchFiredRef = useRef(false);
  const scalpelLastRef = useRef(null);
  const scalpelFadeRef = useRef(null);

  const doDeselect = useCallback(() => {
    log.info('DESELECT');
    setSelectedPart(null);
    setSelectedMeshRawData(null);
    setHighlightPart(null);
  }, []);

  const switchModel = useCallback((delta) => {
    setActiveModelIdx(i=>{const next=(i+delta+MODELS.length)%MODELS.length;log.info(`Model → ${MODELS[next].id}`);return next;});
    setRotation({x:0,y:0}); setScale(1.0);
    setHighlightPart(null); setSelectedPart(null); setSelectedMeshRawData(null);
    setExplodeOpen(false); prevPalmRef.current=null;
  }, []);

  useEffect(() => {
    const onKey = e => {
      switch(e.key.toLowerCase()) {
        case 'e': setExplodeOpen(o=>!o); break;
        case 'r': setRotation({x:0,y:0}); setScale(1.0); prevPalmRef.current=null; break;
        case 'escape': doDeselect(); break;
        case 'arrowright': switchModel(1); break;
        case 'arrowleft':  switchModel(-1); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [switchModel, doDeselect]);

  useEffect(() => {
    let raf;
    const loop = () => {
      const h = handRef.current;

      // PINCH HOLD
      const pinching = h.isTracking && h.h1PinchNorm < 0.33;
      if (pinching) {
        if (!pinchStartRef.current) { pinchStartRef.current=Date.now(); pinchFiredRef.current=false; }
        const held=Date.now()-pinchStartRef.current;
        setPinchHoldMs(held);
        if (held>=PINCH_HOLD_MS && !pinchFiredRef.current && h.h1PinchMid) {
          pinchFiredRef.current=true;
          setPinchPoint({id:Date.now(),normX:1-h.h1PinchMid.x,normY:h.h1PinchMid.y});
          log.info('Pinch fired');
        }
      } else {
        if (pinchStartRef.current) { pinchStartRef.current=null; pinchFiredRef.current=false; setPinchHoldMs(0); }
      }

      // MODEL SWITCH
      const switching=h.gesture==='NEXT_MODEL'||h.gesture==='PREV_MODEL';
      if (switching) {
        if (!switchStartRef.current) { switchStartRef.current=Date.now(); switchFiredRef.current=false; }
        const held=Date.now()-switchStartRef.current;
        setThumbPinkyHoldMs(held);
        if (held>=SWITCH_HOLD_MS && !switchFiredRef.current) {
          switchFiredRef.current=true;
          switchModel(h.gesture==='NEXT_MODEL'?1:-1);
        }
      } else {
        if (switchStartRef.current) { switchStartRef.current=null; setThumbPinkyHoldMs(0); }
      }

      // SCALPEL TRAIL
      if (h.gesture==='SCALPEL'&&h.scalpelHand?.indexTip) {
        const tip=h.scalpelHand.indexTip;
        const pt={x:1-tip.x,y:tip.y};
        const last=scalpelLastRef.current;
        if (!last||Math.abs(pt.x-last.x)>0.003||Math.abs(pt.y-last.y)>0.003) {
          scalpelLastRef.current=pt; setScalpelTrail(t=>[...t.slice(-100),pt]);
        }
        if (scalpelFadeRef.current) { clearTimeout(scalpelFadeRef.current); scalpelFadeRef.current=null; }
      } else {
        scalpelLastRef.current=null;
        if (!scalpelFadeRef.current && scalpelTrailRef.current.length>0) {
          scalpelFadeRef.current=setTimeout(()=>{setScalpelTrail([]);scalpelFadeRef.current=null;},1000);
        }
      }

      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  }, []); // eslint-disable-line

  const buildVoiceCtx = useCallback(() => {
    const sp = selectedPartRef.current;
    const m  = activeModelRef.current;
    if (sp) {
      // Tanlangan qism + uning ma'lumoti
      const partInfo = getPartDetail?.()?.info || '';
      return `Tanlangan qism: "${sp.label}".${partInfo ? ' ' + partInfo : ''} Model: ${m.label}.`;
    }
    return `Model: ${m.label}. ${m.aiContext}`;
  }, []);

  useEffect(() => {
    if (!hand.isTracking) { prevPalmRef.current=null; return; }
    const { gesture, h1PalmCenter, zoomDelta } = hand;
    switch(gesture) {
      case 'EXPLODE_TOGGLE':
        prevPalmRef.current=null;
        if (!explodeTogRef.current) { explodeTogRef.current=true; setExplodeOpen(o=>!o); }
        break;
      case 'ROTATE':
        // Qism tanlangan bo'lsa aylanmaydi
        if (selectedPartRef.current) { prevPalmRef.current=null; break; }
        if (prevPalmRef.current) {
          const dx=h1PalmCenter.x-prevPalmRef.current.x;
          const dy=h1PalmCenter.y-prevPalmRef.current.y;
          if (Math.abs(dx)>0.002||Math.abs(dy)>0.002)
            setRotation(r=>({y:r.y+ROTATION_SIGN*dx*8,x:r.x+ROTATION_SIGN*dy*5}));
        }
        prevPalmRef.current={...h1PalmCenter};
        break;
      case 'ZOOM':
        prevPalmRef.current=null;
        if (Math.abs(zoomDelta)>0.001) setScale(s=>Math.min(MAX_SCALE,Math.max(MIN_SCALE,s+zoomDelta)));
        break;
      case 'VOICE_GESTURE':
        prevPalmRef.current=null;
        if (!voiceActiveRef.current) { voiceActiveRef.current=true; voice.startListening(buildVoiceCtx()); }
        break;
      case 'DESELECT':
        prevPalmRef.current=null;
        if (!deselectRef.current) { deselectRef.current=true; doDeselect(); }
        break;
      case 'SCALPEL': case 'NEXT_MODEL': case 'PREV_MODEL':
        prevPalmRef.current=null; break;
      case 'RESET':
        setRotation({x:0,y:0}); setScale(1.0);
        setHighlightPart(null); setSelectedPart(null); setSelectedMeshRawData(null); setScalpelTrail([]);
        prevPalmRef.current=null; break;
      default:
        if (voiceActiveRef.current) { voiceActiveRef.current=false; voice.stopListening(); }
        explodeTogRef.current=false; deselectRef.current=false; prevPalmRef.current=null;
    }
  }, [hand.gesture, hand.h1PalmCenter, hand.zoomDelta, hand.isTracking]);

  useEffect(()=>{ if(voice.highlightPart) setHighlightPart(voice.highlightPart); },[voice.highlightPart]);

  const handlePartHover = useCallback((key,label)=>{setHoverLabel(label||null);},[]);

  // onPartClick now receives rawData as 3rd argument
  const handlePartClick = useCallback((key, label, rawData) => {
    log.info('Part select:', key, label);
    if (selectedPart?.key === key) { doDeselect(); return; }
    setSelectedPart({key,label});
    setHighlightPart(key);
    if (rawData) setSelectedMeshRawData(rawData);
    else setSelectedMeshRawData(null);
  }, [selectedPart, doDeselect]);

  const handleMicToggle = useCallback(()=>{
    if (voice.isListening) { voiceActiveRef.current=false; voice.stopListening(); }
    else voice.startListening(buildVoiceCtx());
  },[voice, buildVoiceCtx]);

  const handleModelSwitch = useCallback((id)=>{
    const idx=MODELS.findIndex(m=>m.id===id);
    if (idx>=0) {
      setActiveModelIdx(idx); setRotation({x:0,y:0}); setScale(1.0);
      setHighlightPart(null); setSelectedPart(null); setSelectedMeshRawData(null);
      setExplodeOpen(false); prevPalmRef.current=null;
    }
  },[]);

  const handleInfoAskAI = useCallback(()=>{ voice.startListening(buildVoiceCtx()); },[voice, buildVoiceCtx]);

  const getPartDetail = () => {
    if (!selectedPart) return { name:'', info:'' };
    const m=activeModel;
    if (m.meshNames) {
      const idx=parseInt((selectedPart.key).replace(/\D/g,''));
      const entry=m.meshNames[isNaN(idx)?-1:idx];
      if (entry) return { name:entry.name, info:entry.info };
    }
    const part=m.parts?.[selectedPart.key];
    if (part) return { name:part.label, info:part.info||'' };
    return { name:selectedPart.label, info:'' };
  };
  const partDetail=getPartDetail();
  const canExplode=activeModel.isExplodable||activeModel.isProcedural;

  const handleGuideDone = () => setShowGuide(false);

  return (
    <div style={{width:'100vw',height:'100vh',background:'radial-gradient(ellipse at 30% 40%, #081828 0%, #050d1a 100%)',position:'relative',overflow:'hidden'}}>

      {showGuide && <GuidePage onDone={handleGuideDone}/>}
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:72}}>
        <ModelScene
          modelCfg={activeModel} rotation={rotation} scale={scale}
          highlightPart={highlightPart}
          onPartHover={handlePartHover} onPartClick={handlePartClick}
          hoverLabel={hoverLabel} explodeOpen={explodeOpen}
          selectedMeshKey={selectedPart?.key}
          meshRotation={{x:0,y:0}} pinchPoint={pinchPoint}
        />
      </div>

      <HandOverlay landmarks={hand.landmarks} gesture={hand.gesture} pinchHoldMs={pinchHoldMs} hand1PinchMid={hand.h1PinchMid} scalpelHand={hand.scalpelHand} scalpelTrail={scalpelTrail} thumbPinkyHoldMs={thumbPinkyHoldMs}/>

      {/* Part detail — mini 3D + info */}
      <PartDetailView
        partName={selectedPart ? partDetail.name : null}
        partInfo={partDetail.info}
        onClose={doDeselect}
        onAskAI={handleInfoAskAI}
        meshRawData={selectedMeshRawData}
      />

      {/* Logo + Quiz tugmasi */}
      <div style={{position:'fixed',top:18,left:20,zIndex:100,transition:'opacity 0.3s',opacity:selectedPart?0:1,pointerEvents:selectedPart?'none':'auto',display:'flex',alignItems:'center',gap:14}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'0.22em',color:'#00d4ff',fontFamily:'monospace',textShadow:'0 0 18px rgba(0,212,255,0.4)'}}>AIcenna</div>
          <div style={{fontSize:10,color:'rgba(0,212,255,0.45)',letterSpacing:'0.14em',fontFamily:'monospace'}}>3D ANATOMIYA · AI</div>
        </div>
        {onOpenQuiz && (
          <button onClick={() => setShowQuizSelect(true)} style={{
            background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.35)',
            borderRadius:10,padding:'6px 14px',color:'#ffd700',
            fontSize:12,fontFamily:'monospace',cursor:'pointer',
            display:'flex',alignItems:'center',gap:6,
            transition:'all 0.2s',whiteSpace:'nowrap',
          }}
            onMouseOver={e=>e.currentTarget.style.background='rgba(255,215,0,0.2)'}
            onMouseOut={e=>e.currentTarget.style.background='rgba(255,215,0,0.1)'}
          >
            🧠 Quiz
          </button>
        )}
      </div>

      {/* Top center */}
      <div style={{position:'fixed',top:18,left:'50%',transform:'translateX(-50%)',zIndex:100,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
        <div style={{background:'rgba(0,212,255,0.07)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:20,padding:'5px 16px',fontSize:12,color:'rgba(0,212,255,0.75)',fontFamily:'monospace'}}>
          {activeModel.icon} {activeModel.label.toUpperCase()}
          {selectedPart&&<span style={{color:'#ffd700',marginLeft:8}}>★ {partDetail.name||selectedPart.label}</span>}
        </div>
        <div style={{background:'rgba(0,0,0,0.4)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'4px 10px',fontSize:11,color:'rgba(255,255,255,0.4)',fontFamily:'monospace'}}>
          ×{scale.toFixed(2)}
        </div>
        {canExplode&&(
          <button onClick={()=>setExplodeOpen(o=>!o)} style={{background:explodeOpen?'rgba(255,165,0,0.18)':'rgba(0,212,255,0.07)',border:`1px solid ${explodeOpen?'#ffa500':'rgba(0,212,255,0.3)'}`,borderRadius:12,padding:'4px 14px',fontSize:11,color:explodeOpen?'#ffa500':'rgba(0,212,255,0.7)',fontFamily:'monospace',cursor:'pointer',transition:'all 0.2s'}}>
            {explodeOpen?'🔴 Yig':'💥 Ajrat'} [E]
          </button>
        )}
        {selectedPart&&(
          <button onClick={doDeselect} style={{background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.4)',borderRadius:12,padding:'4px 12px',fontSize:11,color:'#ffd700',fontFamily:'monospace',cursor:'pointer'}}>
            ✕ [Esc]
          </button>
        )}
        {hand.gesture==='VOICE_GESTURE'&&<div style={{background:'rgba(255,68,68,0.15)',border:'1px solid #ff4444',borderRadius:12,padding:'4px 12px',fontSize:11,color:'#ff8888',fontFamily:'monospace'}}>☝️+🖐 Tinglanmoqda...</div>}
        {hand.gesture==='DESELECT'&&<div style={{background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.4)',borderRadius:12,padding:'4px 12px',fontSize:11,color:'#ffd700',fontFamily:'monospace'}}>🤙 Bekor qilindi</div>}
        {hand.gesture==='EXPLODE_TOGGLE'&&<div style={{background:'rgba(255,165,0,0.15)',border:'1px solid #ffa500',borderRadius:12,padding:'4px 12px',fontSize:11,color:'#ffa500',fontFamily:'monospace'}}>✊ {explodeOpen?"Yig'ilmoqda":'Ajralmoqda'}</div>}
        {hand.gesture==='SCALPEL'&&<div style={{background:'rgba(255,30,30,0.15)',border:'1px solid #ff3030',borderRadius:12,padding:'4px 12px',fontSize:11,color:'#ff6666',fontFamily:'monospace'}}>🔪 Scalpel</div>}
      </div>

      {/* Hints */}
      <div style={{position:'fixed',top:18,right:270,zIndex:100,fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.18)',textAlign:'right',lineHeight:2.0}}>
        🖐 Kaft → aylantir<br/>
        🤏 Pinch 0.4s → tanlash<br/>
        🤙 O'rta+bosh → bekor<br/>
        ✊ Musht → ajrat/yig'<br/>
        ☝️+🖐 → ovoz<br/>
        ⌨ E ajrat · R reset · Esc bekor
      </div>

      <CameraFeed videoRef={videoRef} landmarks={hand.landmarks} gesture={hand.gesture} pinchNorm={hand.h1PinchNorm} isTracking={hand.isTracking} handsCount={hand.handsCount} fps={hand.fps} error={hand.error} status={hand.status}/>
      <ModelSwitcher models={MODELS} activeId={activeModel.id} onSwitch={handleModelSwitch}/>
      <VoiceAssistant
        isListening={voice.isListening} isTranscribing={voice.isTranscribing}
        isWaitingConfirm={voice.isWaitingConfirm} isLoading={voice.isLoading}
        isSpeaking={voice.isSpeaking} pendingTranscript={voice.pendingTranscript}
        transcript={voice.transcript} answer={voice.answer}
        history={voice.history} error={voice.error}
        onMicToggle={handleMicToggle} onStopSpeaking={voice.stopSpeaking}
        onConfirm={voice.confirmAndSend} onDiscard={voice.discardTranscript}
      />
      <LogViewer/>

      {/* Quiz turi tanlash modali */}
      {showQuizSelect && (
        <div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,0.78)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={()=>setShowQuizSelect(false)}>
          <div style={{background:'rgba(4,14,36,0.98)',border:'1px solid rgba(0,212,255,0.25)',borderRadius:22,padding:'30px 28px',width:400,maxWidth:'92vw'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:'center',marginBottom:22}}>
              <div style={{fontSize:32,marginBottom:8}}>🧠</div>
              <h2 style={{color:'#f0f6ff',fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:900,margin:'0 0 6px'}}>Quiz Turini Tanlang</h2>
              <p style={{color:'rgba(200,220,255,0.45)',fontSize:12,fontFamily:'monospace',margin:0}}>Bilimingizni qanday sinashni tanlang</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <button
                onClick={()=>{setShowQuizSelect(false);onOpenQuiz('open');}}
                style={{padding:'18px 12px',borderRadius:14,border:'1px solid rgba(0,212,255,0.3)',background:'rgba(0,212,255,0.06)',color:'#e8f0ff',cursor:'pointer',textAlign:'center',transition:'all 0.2s',fontFamily:'inherit'}}
                onMouseOver={e=>e.currentTarget.style.background='rgba(0,212,255,0.15)'}
                onMouseOut={e=>e.currentTarget.style.background='rgba(0,212,255,0.06)'}>
                <div style={{fontSize:34,marginBottom:8}}>📝</div>
                <div style={{fontSize:14,fontWeight:700,color:'#00d4ff',marginBottom:6}}>Ochiq Test</div>
                <div style={{fontSize:11,color:'rgba(200,220,255,0.5)',lineHeight:1.6}}>10 ta savol<br/>Variantlardan tanlash<br/>30 soniya/savol</div>
              </button>
              <button
                onClick={()=>{setShowQuizSelect(false);onOpenQuiz('closed');}}
                style={{padding:'18px 12px',borderRadius:14,border:'1px solid rgba(139,92,246,0.3)',background:'rgba(139,92,246,0.06)',color:'#e8f0ff',cursor:'pointer',textAlign:'center',transition:'all 0.2s',fontFamily:'inherit'}}
                onMouseOver={e=>e.currentTarget.style.background='rgba(139,92,246,0.15)'}
                onMouseOut={e=>e.currentTarget.style.background='rgba(139,92,246,0.06)'}>
                <div style={{fontSize:34,marginBottom:8}}>🎙️</div>
                <div style={{fontSize:14,fontWeight:700,color:'#a78bfa',marginBottom:6}}>Yopiq Test</div>
                <div style={{fontSize:11,color:'rgba(200,220,255,0.5)',lineHeight:1.6}}>5 ta savol<br/>O'z so'zingiz bilan<br/>AI foizda baholaydi</div>
              </button>
            </div>
            <button onClick={()=>setShowQuizSelect(false)} style={{marginTop:16,width:'100%',padding:'8px',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.35)',fontSize:12,cursor:'pointer',fontFamily:'monospace'}}>
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}