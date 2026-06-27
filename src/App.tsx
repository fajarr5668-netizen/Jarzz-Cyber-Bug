/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import yukiAvatar from './assets/images/yuki_suou_1782563013821.jpg';

// Interfaces
interface BugFeature {
  id: number;
  name: string;
  badge: string;
  svg: React.ReactNode;
}

interface SenderOption {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function App() {
  // Page routing state: splash -> portal -> dashboard
  const [page, setPage] = useState<'splash' | 'portal' | 'create_account' | 'dashboard'>('splash');
  const [portalSubPage, setPortalSubPage] = useState<'main' | 'login' | 'create_account'>('main');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCreatePassword, setShowCreatePassword] = useState<boolean>(false);

  // Audio configuration state
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // CRT Screen effect state
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Splash countdown & progress
  const [splashProgress, setSplashProgress] = useState<number>(0);
  const [splashCountdown, setSplashCountdown] = useState<number>(6);

  // Login credentials state
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Create account fields (cosmetic only)
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Dashboard states
  const [imageError, setImageError] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<string>('83184031695');
  const [targetType, setTargetType] = useState<'NOMOR' | 'GROUP'>('NOMOR');
  const [selectedBugId, setSelectedBugId] = useState<number>(1);
  const [selectedSenderId, setSelectedSenderId] = useState<string>('tiktok');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYS_AUTH] INITIALIZING SECURE BYPASS DECRYPTOR...',
    '[SYS_AUTH] PORT INJECTION HANDSHAKE INITIATED ON PORT: 443...',
    '[SYS_AUTH] LOADING EXPLOIT CODESETS...',
    '[SYS_AUTH] SYSTEM STATUS: READY FOR INJECTION'
  ]);

  // System statistics/clock
  const [systemTime, setSystemTime] = useState<string>('12:00:00 UTC');
  const [cpuUsage, setCpuUsage] = useState<number>(31);
  const [memUsage, setMemUsage] = useState<number>(44);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Helper: Play specialized audio effects via Web Audio API
  const playBeep = (type: 'click' | 'success' | 'error' | 'execute' | 'keypress' | 'sharingan') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'sharingan') {
        // Dramatic low frequency sub-bass sound paired with metallic sweeping chakra resonance
        const oscSub = ctx.createOscillator();
        const gainSub = ctx.createGain();
        oscSub.type = 'sawtooth';
        oscSub.frequency.setValueAtTime(55, ctx.currentTime); // A1
        oscSub.frequency.exponentialRampToValueAtTime(27.5, ctx.currentTime + 2.0); // A0
        gainSub.gain.setValueAtTime(0.2, ctx.currentTime);
        gainSub.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
        oscSub.connect(gainSub);
        gainSub.connect(ctx.destination);

        const oscChime = ctx.createOscillator();
        const gainChime = ctx.createGain();
        oscChime.type = 'sine';
        oscChime.frequency.setValueAtTime(750, ctx.currentTime);
        oscChime.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.2);
        gainChime.gain.setValueAtTime(0.08, ctx.currentTime);
        gainChime.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        oscChime.connect(gainChime);
        gainChime.connect(ctx.destination);

        oscSub.start();
        oscChime.start();
        oscSub.stop(ctx.currentTime + 2.1);
        oscChime.stop(ctx.currentTime + 1.6);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'keypress') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.setValueAtTime(95, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      } else if (type === 'execute') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(920, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.62);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Live clock and stat oscillation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(11, 19) + ' UTC';
      setSystemTime(timeStr);

      // Random hardware status oscillation
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 5 ? 5 : next > 95 ? 90 : next;
      });
      setMemUsage((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next < 20 ? 20 : next > 85 ? 80 : next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Splash screen progress effect (6 seconds) with automated sound playing on tick
  useEffect(() => {
    if (page !== 'splash') return;

    let startTime = Date.now();
    const duration = 6000; // 6 seconds

    // Play eye sound immediately on load
    setTimeout(() => {
      playBeep('sharingan');
    }, 400);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setSplashProgress(pct);

      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setSplashCountdown(remaining);

      // Play continuous sound midway through charging
      if (Math.floor(pct) === 50) {
        playBeep('sharingan');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        triggerPageTransition('portal');
      }
    }, 30);

    return () => clearInterval(interval);
  }, [page]);

  // Handle auto scroll for terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Page switcher with fade-out and fade-in animations
  const triggerPageTransition = (newPage: 'splash' | 'portal' | 'create_account' | 'dashboard') => {
    setFadeState('out');
    setTimeout(() => {
      setPage(newPage);
      setFadeState('in');
      setShowLoginModal(false);
      playBeep('click');
    }, 300); // match duration of transitions
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'jarzcyberverse' && password === 'jarzzbug989') {
      setLoginError('');
      addTerminalLog('[SESSION] ACCESS GRANTED. SYSTEM UNLOCKED SUCCESSFULLY.');
      playBeep('success');
      triggerPageTransition('dashboard');
    } else {
      setLoginError('USERNAME ATAU PASSWORD SALAH');
      playBeep('error');
    }
  };

  // Create account handler
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim() && newPassword.trim()) {
      if (newPassword !== confirmPassword) {
        setLoginError('PASSWORD TIDAK COCOK');
        playBeep('error');
        return;
      }
      setLoginError('');
      // Simulate account creation and auto-login
      setUsername(newUsername);
      setPassword(newPassword);
      addTerminalLog('[SESSION] ACCOUNT CREATED. REGISTERING USER TO CORE ENGINE...');
      addTerminalLog('[SESSION] ACCESS GRANTED. SYSTEM UNLOCKED SUCCESSFULLY.');
      playBeep('success');
      triggerPageTransition('dashboard');
    } else {
      setLoginError('USERNAME DAN PASSWORD WAJIB DIISI');
      playBeep('error');
    }
  };

  // Terminal log appender
  const addTerminalLog = (message: string) => {
    setTerminalLogs((prev) => [...prev, message]);
  };

  // Execution handler
  const handleExecute = () => {
    const selectedBugName = bugFeatures.find((b) => b.id === selectedBugId)?.name || 'UNKNOWN';
    const selectedSenderName = senderOptions.find((s) => s.id === selectedSenderId)?.name || 'UNKNOWN';

    addTerminalLog(`[EXEC_RUN] INJECTING PORT PROTOCOLS VIA SENDER [${selectedSenderName.toUpperCase()}]`);
    addTerminalLog(`[EXEC_RUN] TRANSMITTING ${selectedBugName} BURST PACKETS TO ID: ${targetNumber}`);
    addTerminalLog(`[EXEC_RUN] BYPASS COMPLETE. VECTOR HAS BEEN TRANSMITTED.`);

    playBeep('execute');
    setIsExecuting(true);
  };

  // Keypad click appends digits
  const handleKeypadPress = (num: string) => {
    playBeep('keypress');
    if (num === '⌫') {
      setTargetNumber((prev) => prev.slice(0, -1));
      addTerminalLog(`[KEYPAD] BACKSPACE RECEIVED`);
    } else {
      setTargetNumber((prev) => prev + num);
      addTerminalLog(`[KEYPAD] APPENDED [${num}] -> TARGET: ${targetNumber}${num}`);
    }
  };

  // SVGs for Bug Features (perfectly styled vectors matching descriptions)
  const bugFeatures: BugFeature[] = [
    {
      id: 1,
      name: 'BULDOZER',
      badge: 'CSP:KM',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      )
    },
    {
      id: 2,
      name: 'CRASH CLICK',
      badge: 'CSP:KM',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v4M12 17h.01"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      )
    },
    {
      id: 3,
      name: 'FORCLOSE',
      badge: 'CSP:KM',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l2 5 4-12 2 5h4"/>
        </svg>
      )
    },
    {
      id: 4,
      name: 'ANDROID FREEZER',
      badge: 'EXTREME',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4 12h4M16 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>
          <path d="M12 8v8"/>
        </svg>
      )
    },
    {
      id: 5,
      name: 'SUPER CRASH',
      badge: 'VIP',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
          <path d="M12 12v4"/>
          <path d="M12 8h.01"/>
        </svg>
      )
    },
    {
      id: 6,
      name: 'SYSTEM PANIC',
      badge: 'DANGER',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v5M12 16h.01"/>
        </svg>
      )
    },
    {
      id: 7,
      name: 'VIP BUG',
      badge: 'PREMIUM',
      svg: (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" stroke="#00a8ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17.5 6.5 21 8 13.5 3 9l6.5-.5L12 2z"/>
        </svg>
      )
    }
  ];

  const senderOptions: SenderOption[] = [
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      subtitle: '@fixsgeloo',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      )
    },
    { 
      id: 'private', 
      name: 'PRIVATE', 
      subtitle: '1 AKTIF',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    { 
      id: 'global', 
      name: 'GLOBAL', 
      subtitle: 'TIDAK ADA',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#7b2ffc]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`min-h-screen bg-[#060811] text-[#e2cbff] flex flex-col relative overflow-hidden select-none pb-8 ${crtEnabled ? 'scanline' : ''}`}>
      {/* Immersive Moving Grid Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0"></div>

      {/* Retro scanline CRT mesh filter overlay */}
      {crtEnabled && <div className="absolute inset-0 crt-overlay pointer-events-none z-50"></div>}

      {/* Cyberdeck Floating Nodes Accent */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#00a8ff]/5 rounded-full filter blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-[#7b2ffc]/5 rounded-full filter blur-3xl pointer-events-none z-0"></div>

      {/* MAIN CONTAINER FRAME WITH FADE EFFECTS */}
      <main className={`flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 transition-all duration-300 ${
        fadeState === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
      }`}>

        {/* ==================== 1. SPLASH SCREEN WITH YUKI SUOU ==================== */}
        {page === 'splash' && (
          <div id="splash_screen" className="w-full max-w-md p-8 bg-[#090b14]/95 border border-[#7b2ffc]/30 rounded-2xl glow-purple-strong flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-lg">
            {/* Corner Bracket Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#7b2ffc]/40"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#7b2ffc]/40"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#7b2ffc]/40"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#7b2ffc]/40"></div>

            {/* Glowing Yuki Suou circle portrait */}
            <div className="relative mb-8 mt-4 flex justify-center items-center">
              <div className="absolute w-36 h-36 bg-[#7b2ffc]/15 rounded-full blur-xl animate-pulse"></div>
              
              {/* Spinning/pulsing neon hex ring */}
              <div className="absolute w-32 h-32 border-2 border-dashed border-[#00a8ff]/60 rounded-full animate-spin-slow"></div>
              <div className="absolute w-28 h-28 border border-[#7b2ffc] rounded-full animate-pulse"></div>

              {/* Central high-quality Yuki avatar */}
              <img 
                src={yukiAvatar} 
                alt="Yuki Sou" 
                className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover z-10 glow-blue shadow-[0_0_15px_rgba(0,168,255,0.4)]"
              />
            </div>

            {/* App Branding */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-[0.25em] text-white text-glow-blue font-mono uppercase">
                JARZ CYBER BUG
              </h1>
              <p className="text-[9px] tracking-[0.4em] text-[#a881f8] font-mono uppercase mt-2 font-bold">
                GAME BOOSTER SYSTEM
              </p>
              <p className="text-[8px] tracking-[0.3em] text-[#a881f8]/60 font-mono mt-1">
                JARZCOMMUNITY PACK - V1.11
              </p>
            </div>

            {/* Fulfills: Dynamic loading text above the progress bar */}
            <div className="w-full text-center text-[10px] font-mono text-[#00a8ff] tracking-widest uppercase mb-2 animate-pulse">
              {splashProgress < 20 && "LOADING BOOST ENGINE..."}
              {splashProgress >= 20 && splashProgress < 40 && "CALIBRATING CPU CORE..."}
              {splashProgress >= 40 && splashProgress < 60 && "OPTIMIZING NETWORK..."}
              {splashProgress >= 60 && splashProgress < 80 && "LOADING GPU DRIVER..."}
              {splashProgress >= 80 && splashProgress < 95 && "SCANNING INSTALLED GAMES..."}
              {splashProgress >= 95 && "SYSTEM READY"}
            </div>

            {/* Fulfills: Loading bar filling in 6 seconds */}
            <div className="w-full bg-[#05060c] border border-[#7b2ffc]/40 h-2.5 rounded-full overflow-hidden p-[1px] mb-3 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
              <div 
                className="bg-gradient-to-r from-[#7b2ffc] to-[#00a8ff] h-full transition-all duration-100 shadow-[0_0_12px_rgba(0,168,255,0.8)] rounded-full"
                style={{ width: `${splashProgress}%` }}
              ></div>
            </div>

            {/* Progress Counters */}
            <div className="w-full flex justify-between text-[8px] font-mono text-[#a881f8]/70 tracking-widest px-1">
              <span>LOADING SYSTEM: {Math.floor(splashProgress)}%</span>
              <span>INITIALIZING IN {splashCountdown}S</span>
            </div>

            {/* Override Bypass */}
            <button
              onClick={() => triggerPageTransition('portal')}
              className="mt-8 text-[8px] text-[#a881f8]/30 hover:text-cyan-400 tracking-[0.2em] uppercase cursor-pointer hover:underline transition-colors"
            >
              [BYPASS_OVERRIDE_LOADER]
            </button>
          </div>
        )}

        {/* ==================== 2. PORTAL & REGISTRATION TERMINAL ==================== */}
        {page === 'portal' && (
          <div 
            id="portal_screen" 
            className={`w-full max-w-md p-8 bg-[#0a0d16]/95 border rounded-2xl flex flex-col relative backdrop-blur-lg transition-all duration-300 ${
              portalSubPage === 'create_account' 
                ? 'border-purple-500/50 glow-purple-strong shadow-[0_0_25px_rgba(180,76,255,0.3)]' 
                : 'border-[#00a8ff]/40 glow-blue shadow-[0_0_25px_rgba(0,168,255,0.25)]'
            }`}
          >
            {/* Corner Bracket Accents */}
            <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 transition-colors duration-300 ${portalSubPage === 'create_account' ? 'border-purple-500' : 'border-cyan-400'}`}></div>
            <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 transition-colors duration-300 ${portalSubPage === 'create_account' ? 'border-purple-500' : 'border-cyan-400'}`}></div>
            <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 transition-colors duration-300 ${portalSubPage === 'create_account' ? 'border-purple-500' : 'border-cyan-400'}`}></div>
            <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 transition-colors duration-300 ${portalSubPage === 'create_account' ? 'border-purple-500' : 'border-cyan-400'}`}></div>
            
            {/* Decorative Samurai/Blade artwork header simulator (matching Video/Screenshot 3) */}
            <div className="relative w-full h-36 bg-[#121625] rounded-xl overflow-hidden border border-[#00a8ff]/30 mb-6 flex flex-col items-center justify-center">
              {/* Background gradient block */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060811] via-transparent to-transparent z-10"></div>
              {/* High fidelity image backdrop for anime stylized look */}
              <img 
                src={yukiAvatar} 
                alt="Backdrop artwork" 
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <div className="absolute top-2.5 right-2.5 text-[8px] font-mono tracking-widest text-[#ef4444] bg-[#ef4444]/15 px-2 py-0.5 rounded border border-[#ef4444]/40 font-bold uppercase animate-pulse">
                PREMIUM
              </div>

              {/* Pill Container */}
              <div className="z-20 bg-[#0a0d16]/95 border border-cyan-500/50 px-5 py-2 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <h2 className="text-base font-extrabold tracking-[0.15em] text-white font-mono uppercase text-glow-blue">
                  JARZ CYBER BUG
                </h2>
              </div>
              <p className="z-20 text-[9px] tracking-[0.25em] text-[#a881f8] font-mono uppercase mt-2">
                YUKI SOU // ELITE OPERATOR
              </p>
            </div>

            {/* Sub-Header: Only visible in Main Portal or as Sub-Header */}
            {portalSubPage === 'main' && (
              <div className="text-center mb-6">
                <span className="text-[10px] tracking-[0.35em] text-cyan-400 font-mono uppercase font-bold text-glow-blue">
                  SECURE • FAST • RELIABLE
                </span>
              </div>
            )}

            {/* ==================== SUBPAGE 1: MAIN OPTIONS ==================== */}
            {portalSubPage === 'main' && (
              <div className="space-y-4">
                {/* Action Button: ENTER DASHBOARD */}
                <button
                  type="button"
                  onClick={() => { setPortalSubPage('login'); setLoginError(''); playBeep('click'); }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs tracking-[0.2em] font-bold py-4 rounded-full transition-all cursor-pointer glow-blue text-center uppercase flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
                >
                  <span>ENTER DASHBOARD</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                {/* Secondary Option: CREATE ACCOUNT button */}
                <button
                  type="button"
                  onClick={() => { setPortalSubPage('create_account'); setLoginError(''); playBeep('click'); }}
                  className="w-full bg-[#0a0d16] border border-[#00a8ff]/40 text-[#00a8ff] hover:bg-[#00a8ff]/10 hover:text-white font-mono text-xs tracking-[0.2em] font-bold py-4 rounded-full transition-all cursor-pointer text-center uppercase"
                >
                  CREATE ACCOUNT
                </button>

                {/* Features Info Box */}
                <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-[#00a8ff]/20 text-center font-mono text-[8px] text-[#a881f8]/70 tracking-widest uppercase">
                  <div className="flex flex-col items-center p-2 bg-[#121625]/40 rounded-lg border border-[#00a8ff]/10">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#00a8ff" fill="none" strokeWidth="2" className="mb-1">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>SECURE</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-[#121625]/40 rounded-lg border border-[#00a8ff]/10">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#00a8ff" fill="none" strokeWidth="2" className="mb-1">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>FAST</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-[#121625]/40 rounded-lg border border-[#00a8ff]/10">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#00a8ff" fill="none" strokeWidth="2" className="mb-1">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>SUPPORT</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== SUBPAGE 2: LOGIN FORM ==================== */}
            {portalSubPage === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold font-mono tracking-widest text-cyan-400 text-glow-blue uppercase flex items-center justify-center space-x-2">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>ENTER DASHBOARD</span>
                  </h3>
                </div>

                {/* Username Input */}
                <div className="space-y-1.5 font-mono">
                  <label className="text-[9px] tracking-widest text-[#a881f8] block uppercase font-bold">
                    USERNAME:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-cyan-400 font-bold select-none text-xs">&gt;</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                      className="w-full bg-[#060811] border border-[#00a8ff]/30 rounded-lg py-2.5 pl-8 pr-4 text-xs font-mono text-[#e2cbff] focus:outline-none focus:border-cyan-400 transition-all tracking-wide"
                      placeholder="Username"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Password Input with Visibility Eye Toggle */}
                <div className="space-y-1.5 font-mono">
                  <label className="text-[9px] tracking-widest text-[#a881f8] block uppercase font-bold">
                    PASSWORD:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-cyan-400 font-bold select-none text-xs">&gt;</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                      className="w-full bg-[#060811] border border-[#00a8ff]/30 rounded-lg py-2.5 pl-8 pr-10 text-xs font-mono text-[#e2cbff] focus:outline-none focus:border-cyan-400 transition-all tracking-wide"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => { setShowPassword(!showPassword); playBeep('click'); }}
                      className="absolute right-3 top-2.5 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Box */}
                {loginError && (
                  <div className="p-2.5 border border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444] font-mono text-[9px] tracking-widest text-center uppercase rounded-md animate-bounce">
                    ERROR: {loginError}
                  </div>
                )}

                {/* MASUK BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs tracking-[0.2em] font-bold py-3.5 rounded-xl transition-all cursor-pointer glow-blue text-center uppercase flex items-center justify-center space-x-2 mt-2"
                >
                  <span>MASUK</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                {/* KEMBALI BUTTON */}
                <button
                  type="button"
                  onClick={() => { setPortalSubPage('main'); setLoginError(''); playBeep('click'); }}
                  className="w-full bg-transparent border border-[#00a8ff]/30 text-cyan-400 hover:bg-[#00a8ff]/10 font-mono text-xs tracking-widest py-3 font-bold cursor-pointer transition-all uppercase rounded-xl flex items-center justify-center space-x-2"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" className="rotate-180">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span>KEMBALI</span>
                </button>
              </form>
            )}

            {/* ==================== SUBPAGE 3: CREATE ACCOUNT FORM ==================== */}
            {portalSubPage === 'create_account' && (
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold font-mono tracking-widest text-purple-400 text-glow-purple uppercase flex items-center justify-center space-x-2">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    <span>CREATE ACCOUNT</span>
                  </h3>
                </div>

                {/* Username Input */}
                <div className="space-y-1.5 font-mono">
                  <label className="text-[9px] tracking-widest text-[#a881f8] block uppercase font-bold">
                    USERNAME:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-purple-400 font-bold select-none text-xs">&gt;</span>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => { setNewUsername(e.target.value); setLoginError(''); }}
                      className="w-full bg-[#060811] border border-purple-500/30 rounded-lg py-2.5 pl-8 pr-4 text-xs font-mono text-[#e2cbff] focus:outline-none focus:border-purple-400 transition-all tracking-wide"
                      placeholder="Username"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 font-mono">
                  <label className="text-[9px] tracking-widest text-[#a881f8] block uppercase font-bold">
                    PASSWORD:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-purple-400 font-bold select-none text-xs">&gt;</span>
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setLoginError(''); }}
                      className="w-full bg-[#060811] border border-purple-500/30 rounded-lg py-2.5 pl-8 pr-10 text-xs font-mono text-[#e2cbff] focus:outline-none focus:border-purple-400 transition-all tracking-wide"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => { setShowCreatePassword(!showCreatePassword); playBeep('click'); }}
                      className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      {showCreatePassword ? (
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5 font-mono">
                  <label className="text-[9px] tracking-widest text-[#a881f8] block uppercase font-bold">
                    CONFIRM PASSWORD:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-purple-400 font-bold select-none text-xs">&gt;</span>
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setLoginError(''); }}
                      className="w-full bg-[#060811] border border-purple-500/30 rounded-lg py-2.5 pl-8 pr-10 text-xs font-mono text-[#e2cbff] focus:outline-none focus:border-purple-400 transition-all tracking-wide"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </div>

                {/* Error Box */}
                {loginError && (
                  <div className="p-2.5 border border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444] font-mono text-[9px] tracking-widest text-center uppercase rounded-md">
                    ERROR: {loginError}
                  </div>
                )}

                {/* MASUK BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-[#7b2ffc] hover:from-purple-500 hover:to-[#8c43ff] text-white font-mono text-xs tracking-[0.2em] font-bold py-3.5 rounded-xl transition-all cursor-pointer glow-purple text-center uppercase flex items-center justify-center space-x-2 mt-2 shadow-[0_4px_15px_rgba(123,47,252,0.3)]"
                >
                  <span>MASUK</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                {/* Divider with label: GET KEY */}
                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-dashed border-purple-500/30"></div>
                  <span className="px-3 text-[9px] font-mono text-purple-400/80 tracking-widest uppercase">GET KEY</span>
                  <div className="flex-1 border-t border-dashed border-purple-500/30"></div>
                </div>

                <p className="text-[9px] font-mono text-[#a881f8]/80 text-center tracking-widest uppercase">
                  Belum punya akses? Ambil key dulu
                </p>

                {/* GET KEY SEKARANG BUTTON with lock/key SVG */}
                <a
                  href="https://wa.me/6282124349140"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep('success')}
                  className="w-full flex items-center justify-center space-x-2.5 bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-500/60 hover:from-purple-900 hover:to-indigo-900 text-[#e2cbff] font-mono text-xs tracking-[0.18em] font-bold py-3 rounded-xl transition-all cursor-pointer glow-purple text-center uppercase"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="#d8b4fe" fill="none" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>GET KEY SEKARANG</span>
                </a>

                {/* KEMBALI BUTTON */}
                <button
                  type="button"
                  onClick={() => { setPortalSubPage('main'); setLoginError(''); playBeep('click'); }}
                  className="w-full bg-transparent border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-mono text-xs tracking-widest py-3 font-bold cursor-pointer transition-all uppercase rounded-xl flex items-center justify-center space-x-2"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" className="rotate-180">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span>KEMBALI</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* ==================== 4. DASHBOARD VIEW (Fulfills Jarz Cyber Bug, matching Screenshot 1 & 2) ==================== */}
        {page === 'dashboard' && (
          <div className="w-full max-w-6xl flex flex-col space-y-4">
            
            {/* CORE STATISTICS ROW - PLACED PROMINENTLY UNDER THE HEADER (Mimicking Screenshot 2) */}
            <div className="grid grid-cols-3 gap-4 w-full">
              {/* Stat 1: TOTAL BUGS */}
              <div className="bg-[#0a0d16]/90 border border-[#00a8ff]/30 p-4.5 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)] hover:border-[#00a8ff]/60 transition-colors relative group">
                <div className="p-2 rounded-full bg-[#00a8ff]/10 text-cyan-400 border border-[#00a8ff]/20 mb-2">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M12 2v9M8 5h8" />
                  </svg>
                </div>
                <span className="text-[10px] tracking-[0.18em] text-[#a881f8]/60 uppercase mb-0.5 font-mono">TOTAL BUGS</span>
                <span className="text-xl font-bold font-mono text-white tracking-widest">1</span>
              </div>

              {/* Stat 2: SUCCESS RATE */}
              <div className="bg-[#0a0d16]/90 border border-[#00a8ff]/30 p-4.5 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)] hover:border-[#00a8ff]/60 transition-colors relative">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="text-[10px] tracking-[0.18em] text-[#a881f8]/60 uppercase mb-0.5 font-mono">SUCCESS RATE</span>
                <span className="text-base font-bold font-mono text-emerald-400 text-glow-green tracking-widest animate-pulse">GACOR</span>
              </div>

              {/* Stat 3: STATUS */}
              <div className="bg-[#0a0d16]/90 border border-[#00a8ff]/30 p-4.5 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)] hover:border-[#00a8ff]/60 transition-colors relative">
                <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="text-[10px] tracking-[0.18em] text-[#a881f8]/60 uppercase mb-0.5 font-mono">STATUS</span>
                <span className="text-base font-bold font-mono text-cyan-400 text-glow-blue tracking-widest uppercase">ACTIVE</span>
              </div>
            </div>

            {/* GRID LAYOUT: LEFT SIDEBAR PROFILE & KEYPAD / RIGHT INJECTOR MAIN (cols: 12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* LEFT SIDEBAR COLUMN (cols: 5) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                
                {/* PROFILE AVATAR / CARD INFO */}
                <div className="p-4 bg-[#0a0d16]/90 border border-[#00a8ff]/30 rounded-xl relative overflow-hidden backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      {/* Avatar picture of Yuki Suou */}
                      <div className="relative">
                        <img
                          src={yukiAvatar}
                          alt="Yuki Sou"
                          className="w-16 h-16 rounded-full border-2 border-[#00a8ff] object-cover glow-blue shadow-[0_0_15px_rgba(0,168,255,0.3)]"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-[#3af253] border-2 border-[#0a0d16] rounded-full shadow-[0_0_8px_rgba(58,242,83,0.8)]"></div>
                      </div>

                      <div className="space-y-0.5 font-mono">
                        <h3 className="text-base font-bold tracking-widest text-[#e2cbff] text-glow-blue uppercase">
                          JARZ CYBER BUG
                        </h3>
                        <p className="text-[10px] tracking-[0.1em] text-[#00a8ff] uppercase">
                          YUKI SOU // ELITE OPERATOR
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className="font-mono text-[10px] px-2.5 py-1 border border-[#00a8ff]/40 text-[#00a8ff] tracking-widest font-bold bg-[#00a8ff]/10 rounded-md shadow-[0_0_8px_rgba(0,168,255,0.15)]">
                        V2.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* VISUAL MONITOR DISPLAY UNIT featuring "NE" with animating sparkles (from Screenshot 2) */}
                <div className="p-6 bg-[#03050a] border border-[#00a8ff]/25 rounded-xl flex flex-col items-center justify-center relative overflow-hidden h-48 shadow-[inset_0_0_20px_rgba(0,168,255,0.1)]">
                  {/* Digital tracking code design accents */}
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-[#00a8ff]/40">DISP_MONITOR_SYS.12</div>
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[#00a8ff]/40">ONLINE // CHANNELS OK</div>
                  
                  {/* Animating cyber stars */}
                  <div className="absolute top-6 left-12 text-cyan-500/40 animate-star-pulse">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 right-12 text-cyan-500/40 animate-star-pulse delay-700">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                      <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                    </svg>
                  </div>

                  {/* Centered big stylized "NE" logo with dramatic sparkle */}
                  <div className="text-center relative">
                    <h1 className="text-6xl font-bold tracking-widest text-slate-100 font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      NE
                    </h1>
                    
                    {/* The glowing star spark beneath "NE" */}
                    <div className="mt-2 text-glow-blue text-white animate-bounce flex justify-center">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="text-slate-100">
                        <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* SENDER PROTOCOL SELECTOR */}
                <div className="p-4 bg-[#0a0d16]/90 border border-[#00a8ff]/30 rounded-xl flex flex-col space-y-3 backdrop-blur-md">
                  <span className="text-[10px] tracking-widest text-[#a881f8]/80 font-mono uppercase font-bold flex items-center space-x-1.5">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>PILIH SENDER</span>
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {senderOptions.map((sender) => (
                      <button
                        key={sender.id}
                        onClick={() => { setSelectedSenderId(sender.id); playBeep('click'); }}
                        className={`flex items-center justify-between p-3.5 rounded-lg border transition-all text-left font-mono cursor-pointer ${
                          selectedSenderId === sender.id
                            ? 'border-cyan-400 bg-[#00a8ff]/15 text-white glow-blue shadow-[0_0_12px_rgba(0,168,255,0.2)]'
                            : 'border-[#00a8ff]/20 bg-[#060811] text-[#a881f8]/70 hover:border-[#00a8ff]/40 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {sender.icon}
                          <span className="text-xs tracking-widest font-bold uppercase">{sender.name}</span>
                        </div>
                        <span className="text-[10px] opacity-80 tracking-widest">{sender.subtitle}</span>
                      </button>
                    ))}
                  </div>

                  {/* Kelola Sender Action Button */}
                  <button 
                    onClick={() => { playBeep('click'); addTerminalLog('[SENDER] OPENING MANAGE SENDER GATEWAY...'); }}
                    className="w-full flex items-center justify-center space-x-2 py-2 border border-[#00a8ff]/25 hover:border-[#00a8ff]/50 bg-[#060811]/60 text-[#00a8ff] hover:text-white rounded-lg transition-colors font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>KELOLA SENDER</span>
                  </button>
                </div>

              </div>

              {/* RIGHT MAIN TERMINAL BLOCK COLUMN (cols: 7) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                
                {/* NOMOR TARGET INPUT CONTROL WITH SLICK SELECTORS */}
                <div className="p-4 bg-[#0a0d16]/90 border border-[#00a8ff]/30 rounded-xl flex flex-col space-y-3 backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)]">
                  <div className="flex items-center space-x-2 font-mono text-[10px] tracking-widest text-[#a881f8] font-bold">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2.5">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    <span>NOMOR TARGET</span>
                  </div>

                  {/* Toggle Selector mimicking the beautiful screenshot perfectly */}
                  <div className="grid grid-cols-2 gap-3.5 bg-[#060811] p-1.5 rounded-xl border border-[#00a8ff]/20 font-mono text-xs tracking-widest">
                    <button
                      onClick={() => { setTargetType('NOMOR'); playBeep('click'); }}
                      className={`py-2 px-4 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                        targetType === 'NOMOR'
                          ? 'bg-[#00a8ff] text-white shadow-[0_0_15px_rgba(0,168,255,0.45)]'
                          : 'bg-transparent text-[#a881f8]/70 hover:bg-[#00a8ff]/10 hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                      <span>NOMOR</span>
                    </button>
                    <button
                      onClick={() => { setTargetType('GROUP'); playBeep('click'); }}
                      className={`py-2 px-4 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                        targetType === 'GROUP'
                          ? 'bg-[#00a8ff] text-white shadow-[0_0_15px_rgba(0,168,255,0.45)]'
                          : 'bg-transparent text-[#a881f8]/70 hover:bg-[#00a8ff]/10 hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                      <span>GROUP</span>
                    </button>
                  </div>

                  {/* Target Text Input */}
                  <div className="relative font-mono">
                    <span className="absolute left-4 top-3 text-[#00a8ff]/60 font-bold select-none text-xs">+</span>
                    <input
                      type="text"
                      value={targetNumber}
                      onChange={(e) => { setTargetNumber(e.target.value); playBeep('keypress'); }}
                      className="w-full bg-[#060811] border border-[#00a8ff]/30 pl-8 pr-4 py-3 text-xs font-mono text-[#e2cbff] tracking-widest focus:outline-none focus:border-cyan-400 transition-all rounded-lg"
                      placeholder="83184031695"
                    />
                  </div>
                </div>

                {/* LIST OF BUGS (7 FEATURES) */}
                <div className="p-4 bg-[#0a0d16]/90 border border-[#00a8ff]/30 rounded-xl flex flex-col space-y-3.5 backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)]">
                  <span className="text-[10px] tracking-widest text-[#a881f8]/80 font-mono uppercase font-bold flex items-center space-x-1.5">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2.5">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span>PILIH BUG</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {bugFeatures.map((bug) => (
                      <button
                        key={bug.id}
                        onClick={() => { setSelectedBugId(bug.id); playBeep('click'); }}
                        className={`flex flex-col items-start p-3.5 rounded-xl border transition-all text-left font-mono cursor-pointer relative overflow-hidden ${
                          selectedBugId === bug.id
                            ? 'border-cyan-400 bg-[#00a8ff]/15 text-white shadow-[0_0_12px_rgba(0,168,255,0.15)] glow-cyan'
                            : 'border-[#00a8ff]/25 bg-[#060811] text-[#a881f8]/70 hover:border-[#00a8ff]/40 hover:text-white'
                        }`}
                      >
                        {/* Selector check indicator */}
                        {selectedBugId === bug.id && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" fill="none" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}

                        <div className={`p-2 rounded-full border mb-3 ${selectedBugId === bug.id ? 'border-cyan-400/50 bg-[#060811]/90' : 'border-[#00a8ff]/20 bg-[#0a0d16]'}`}>
                          {bug.svg}
                        </div>

                        <span className="text-xs font-bold tracking-widest truncate uppercase text-white mb-1">{bug.name}</span>
                        <span className="text-[8px] tracking-[0.2em] text-[#00a8ff] font-bold uppercase py-0.5 px-1.5 bg-[#00a8ff]/10 rounded border border-[#00a8ff]/20">
                          {bug.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TARGET PHONE DIGIT KEYPAD AND BACKSPACE (Sleek Phone Style) */}
                <div className="p-4 bg-[#0a0d16]/90 border border-[#00a8ff]/30 rounded-xl flex flex-col space-y-3 backdrop-blur-md shadow-[0_4px_15px_rgba(0,168,255,0.05)]">
                  <span className="text-[10px] tracking-widest text-[#a881f8]/80 font-mono uppercase font-bold">
                    TARGET DIALPAD CONTROLLER:
                  </span>
                  
                  {/* Keypad Layout */}
                  <div className="grid grid-cols-4 gap-2 font-mono">
                    {[
                      { val: '1', label: '' },
                      { val: '2', label: 'ABC' },
                      { val: '3', label: 'DEF' },
                      { val: '4', label: 'GHI' },
                      { val: '5', label: 'JKL' },
                      { val: '6', label: 'MNO' },
                      { val: '7', label: 'PQRS' },
                      { val: '8', label: 'TUV' },
                      { val: '9', label: 'WXYZ' },
                      { val: '*', label: '' },
                      { val: '0', label: '+' },
                      { val: '⌫', label: 'BACK' }
                    ].map((key) => (
                      <button
                        key={key.val}
                        onClick={() => handleKeypadPress(key.val)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                          key.val === '⌫' 
                            ? 'border-red-500/30 hover:border-red-500/60 bg-red-950/15 hover:bg-red-900/10 text-red-400' 
                            : 'border-[#00a8ff]/20 hover:border-cyan-400 bg-[#060811] hover:bg-[#00a8ff]/10 text-white'
                        } active:scale-95`}
                      >
                        <span className="text-sm font-bold tracking-widest">{key.val}</span>
                        {key.label && <span className="text-[7px] text-[#00a8ff]/60 uppercase tracking-wider">{key.label}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TERMINAL FEEDBACK DECK */}
                <div className="p-4 bg-[#04060c] border border-[#00a8ff]/20 rounded-xl flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-[9px] tracking-widest text-cyan-400 font-mono border-b border-[#00a8ff]/15 pb-2">
                    <span>LIVE SYSTEM CONSOLE REPORT</span>
                    <button 
                      onClick={() => { setTerminalLogs([]); playBeep('click'); }}
                      className="hover:text-white underline text-[8px] uppercase cursor-pointer"
                    >
                      [RESET_LOGS]
                    </button>
                  </div>

                  <div className="h-[90px] overflow-y-auto font-mono text-[9px] tracking-widest space-y-1 text-slate-400 leading-relaxed scrollbar-thin">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="flex space-x-1.5">
                        <span className="text-cyan-500 select-none">&gt;&gt;</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                    <div ref={terminalEndRef}></div>
                  </div>
                </div>

                {/* EXECUTE INTERCEPT TRIGGER ACTION BUTTON */}
                <button
                  onClick={handleExecute}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-sm tracking-[0.25em] font-bold py-4.5 rounded-full transition-all cursor-pointer glow-blue shadow-[0_4px_25px_rgba(0,168,255,0.35)] relative overflow-hidden group uppercase"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span>EXECUTE TERMINAL INJECTION</span>
                </button>

                {/* Fulfills: "di create akun sama Dashboard ada tombol masuk" */}
                {/* Logout back to portal */}
                <div className="pt-2">
                  <button
                    onClick={() => triggerPageTransition('portal')}
                    className="w-full py-3.5 bg-transparent border border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10 font-mono text-xs tracking-widest font-bold rounded-full transition-all cursor-pointer uppercase text-center"
                  >
                    KEMBALI KE PORTAL / MASUK LAGI
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER SYSTEM CREDIT BAR */}
      <footer className="w-full mt-auto text-center font-mono text-[9px] tracking-[0.25em] text-[#00a8ff]/40 relative z-10 px-4">
        JARZZ PURPLE VERSE ENGINE // LICENSED FOR ELITE TASKERS ONLY // SECURE CHANNELS INTEGRATED
      </footer>

      {/* ==================== 5. MODAL OVERLAY: EXPLOIT INJECTION IN PROGRESS ==================== */}
      {isExecuting && (
        <div className="fixed inset-0 bg-[#060811]/95 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          {/* Glowing Retro Terminal Modal Chassis */}
          <div className="w-full max-w-md p-6 bg-[#0a0d16] border-2 border-cyan-400 glow-blue relative rounded-2xl flex flex-col text-center">
            {/* Corner Bracket Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

            {/* Custom high-tech indicator animation (No emojis used!) */}
            <div className="flex justify-center mb-4 space-x-2">
              <span className="w-2.5 h-2.5 bg-cyan-400 animate-ping inline-block rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-cyan-400 animate-ping inline-block rounded-full delay-150"></span>
              <span className="w-2.5 h-2.5 bg-cyan-400 animate-ping inline-block rounded-full delay-300"></span>
            </div>

            <h3 className="text-xl font-bold font-mono tracking-widest text-cyan-400 text-glow-blue uppercase">
              EKSEKUSI BERJALAN
            </h3>

            <div className="my-6 border-y border-[#00a8ff]/30 py-4 font-mono text-[11px] tracking-widest text-[#e2cbff] leading-relaxed uppercase">
              Menjalankan {bugFeatures.find((b) => b.id === selectedBugId)?.name || 'UNKNOWN'} ke nomor {targetNumber}
            </div>

            <div className="text-[9px] font-mono text-[#00a8ff] mb-6 tracking-wider leading-relaxed text-left bg-[#03050a] p-3 max-h-[100px] overflow-y-auto rounded-lg border border-[#00a8ff]/20">
              [CMD_STREAM] TRANSMITTING HIGH-POWER SIGNAL INTERCEPTORS...<br/>
              [CMD_STREAM] BYPASS COMPLETE. EXPLOIT VECTOR INJECTED.<br/>
              [CMD_STREAM] TARGET LOGGING REPORT - PENDING FEEDBACK.
            </div>

            {/* Fulfills: OKE Button */}
            <button
              onClick={() => { setIsExecuting(false); playBeep('click'); }}
              className="w-full bg-[#0a0d16] border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-white font-mono text-xs tracking-widest py-3 font-bold cursor-pointer transition-all uppercase rounded-xl"
            >
              OKE
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
