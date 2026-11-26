import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy,
  serverTimestamp, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// Firebase Web App configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh58Iiih6jdwszemhndMLjtn-77oHQ8dk",
  authDomain: "bhhhf-e129f.firebaseapp.com",
  projectId: "bhhhf-e129f",
  storageBucket: "bhhhf-e129f.firebasestorage.app",
  messagingSenderId: "355338950069",
  appId: "1:355338950069:web:f3f1861eea5cde4d58b5fc",
  measurementId: "G-TMG4BX6LD5"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
let currentUser = null;


(() => {
      'use strict';

      /* -------------------------------------------------------
         A. WEB AUDIO API ROMANTIC SYNTHESIZER (AUTO-PLAY ON UNLOCK)
      -------------------------------------------------------- */
      class RomanticMusicEngine {
        constructor() {
          this.ctx = null;
          this.isPlaying = false;
          this.mode = 'birthday'; // 'birthday' | 'nocturne'
          this.timerId = null;
          this.step = 0;

          // "Happy Birthday to You" in F Major (Warm Music-Box + Harp)
          this.birthdaySequence = [
            { f: 261.63, d: 0.38 }, { f: 261.63, d: 0.22 }, { f: 293.66, d: 0.6 },
            { f: 261.63, d: 0.6 },  { f: 349.23, d: 0.6 },  { f: 329.63, d: 1.1 },
            { f: 261.63, d: 0.38 }, { f: 261.63, d: 0.22 }, { f: 293.66, d: 0.6 },
            { f: 261.63, d: 0.6 },  { f: 392.00, d: 0.6 },  { f: 349.23, d: 1.1 },
            { f: 261.63, d: 0.38 }, { f: 261.63, d: 0.22 }, { f: 523.25, d: 0.6 },
            { f: 440.00, d: 0.6 },  { f: 349.23, d: 0.6 },  { f: 329.63, d: 0.6 }, { f: 293.66, d: 1.0 },
            { f: 466.16, d: 0.38 }, { f: 466.16, d: 0.22 }, { f: 440.00, d: 0.6 },
            { f: 349.23, d: 0.6 },  { f: 392.00, d: 0.6 },  { f: 349.23, d: 1.35 }
          ];

          // Dreamy Nocturne Arpeggio
          this.nocturneSequence = [
            { f: 293.66, d: 0.55 }, { f: 369.99, d: 0.55 }, { f: 440.00, d: 0.55 }, { f: 587.33, d: 0.85 },
            { f: 329.63, d: 0.55 }, { f: 392.00, d: 0.55 }, { f: 493.88, d: 0.55 }, { f: 659.25, d: 0.85 },
            { f: 246.94, d: 0.55 }, { f: 369.99, d: 0.55 }, { f: 440.00, d: 0.55 }, { f: 554.37, d: 0.85 },
            { f: 220.00, d: 0.55 }, { f: 329.63, d: 0.55 }, { f: 440.00, d: 0.55 }, { f: 587.33, d: 1.05 }
          ];
        }

        unlockAudioContext() {
          if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
          }
          if (this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }

        playBellNote(freq, duration = 0.6, gainPeak = 0.085) {
          if (!this.ctx || !this.isPlaying) return;
          const now = this.ctx.currentTime;

          // Fundamental warm music-box sine
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, now);

          // Soft octave shimmer harmonic
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 2, now);

          const harmonicGain = this.ctx.createGain();
          harmonicGain.gain.setValueAtTime(0.18, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.65);

          osc1.connect(gain);
          osc2.connect(harmonicGain);
          harmonicGain.connect(gain);
          gain.connect(this.ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + duration + 0.7);
          osc2.stop(now + duration + 0.7);
        }

        playChime(freq = 659.25) {
          this.unlockAudioContext();
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.05, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        }

        start() {
          this.unlockAudioContext();
          if (this.isPlaying) return;
          this.isPlaying = true;
          this.step = 0;
          this.scheduleNext();
          this.updateUI();
        }

        stop() {
          this.isPlaying = false;
          if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
          }
          this.updateUI();
        }

        toggle() {
          if (this.isPlaying) this.stop();
          else this.start();
        }

        switchMode() {
          this.mode = this.mode === 'birthday' ? 'nocturne' : 'birthday';
          this.step = 0;
          const label = document.getElementById('songModeLabel');
          if (label) {
            label.textContent = this.mode === 'birthday' ? '🎂 Birthday Song' : '🌙 Nocturne';
          }
          if (this.isPlaying) {
            clearTimeout(this.timerId);
            this.scheduleNext();
          }
        }

        scheduleNext() {
          if (!this.isPlaying) return;
          const seq = this.mode === 'birthday' ? this.birthdaySequence : this.nocturneSequence;
          const note = seq[this.step % seq.length];
          this.playBellNote(note.f, note.d);
          this.step++;
          this.timerId = setTimeout(() => this.scheduleNext(), note.d * 1000);
        }

        updateUI() {
          const eq = document.getElementById('eqBars');
          const lbl = document.getElementById('musicLabel');
          if (!eq || !lbl) return;
          if (this.isPlaying) {
            eq.classList.add('eq-playing');
            lbl.textContent = 'Playing';
          } else {
            eq.classList.remove('eq-playing');
            lbl.textContent = 'Paused';
          }
        }
      }

      const musicEngine = new RomanticMusicEngine();

      /* -------------------------------------------------------
         B. AMBIENT BOKEH, PETALS, SHOOTING STARS & CURSOR STARDUST
      -------------------------------------------------------- */
      const ambientCanvas = document.getElementById('ambientCanvas');
      const aCtx = ambientCanvas.getContext('2d');
      let width = (ambientCanvas.width = window.innerWidth);
      let height = (ambientCanvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        width = ambientCanvas.width = window.innerWidth;
        height = ambientCanvas.height = window.innerHeight;
      });

      const orbs = Array.from({ length: 34 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.12,
        alpha: Math.random() * 0.55 + 0.2,
        gold: Math.random() > 0.45
      }));

      const petals = Array.from({ length: 14 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 6 + 4,
        vy: Math.random() * 0.65 + 0.3,
        vx: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02
      }));

      const stardust = [];
      const shootingStars = [];

      window.addEventListener('pointermove', (e) => {
        for (let i = 0; i < 2; i++) {
          stardust.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.1,
            vy: (Math.random() - 0.5) * 1.1 - 0.4,
            life: 1,
            size: Math.random() * 2.5 + 1,
            isHeart: Math.random() > 0.82
          });
        }
      });

      setInterval(() => {
        if (shootingStars.length < 2 && Math.random() > 0.35) {
          shootingStars.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.35,
            vx: 9 + Math.random() * 5,
            vy: 4 + Math.random() * 3,
            life: 1
          });
        }
      }, 4200);

      function renderAmbient() {
        aCtx.clearRect(0, 0, width, height);

        // Floating golden & rose bokeh orbs
        for (const o of orbs) {
          o.x += o.vx;
          o.y += o.vy;
          if (o.y < -10) { o.y = height + 10; o.x = Math.random() * width; }
          if (o.x < -10) o.x = width + 10;
          if (o.x > width + 10) o.x = -10;

          aCtx.beginPath();
          aCtx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
          aCtx.fillStyle = o.gold
            ? `rgba(255, 183, 77, ${o.alpha})`
            : `rgba(226, 149, 135, ${o.alpha})`;
          aCtx.fill();
        }

        // Soft drifting rose petals
        for (const p of petals) {
          p.x += p.vx + Math.sin(p.angle) * 0.35;
          p.y += p.vy;
          p.angle += p.spin;
          if (p.y > height + 15) { p.y = -15; p.x = Math.random() * width; }

          aCtx.save();
          aCtx.translate(p.x, p.y);
          aCtx.rotate(p.angle);
          aCtx.beginPath();
          aCtx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          aCtx.fillStyle = 'rgba(226, 149, 135, 0.22)';
          aCtx.fill();
          aCtx.restore();
        }

        // Shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.022;
          if (s.life <= 0) {
            shootingStars.splice(i, 1);
            continue;
          }
          const grad = aCtx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
          grad.addColorStop(0, `rgba(255, 224, 150, ${s.life})`);
          grad.addColorStop(1, 'rgba(255, 183, 77, 0)');
          aCtx.strokeStyle = grad;
          aCtx.lineWidth = 2;
          aCtx.beginPath();
          aCtx.moveTo(s.x, s.y);
          aCtx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
          aCtx.stroke();
        }

        // Cursor stardust
        for (let i = stardust.length - 1; i >= 0; i--) {
          const d = stardust[i];
          d.x += d.vx;
          d.y += d.vy;
          d.life -= 0.028;
          if (d.life <= 0) {
            stardust.splice(i, 1);
            continue;
          }
          aCtx.fillStyle = `rgba(255, 200, 140, ${d.life * 0.85})`;
          if (d.isHeart) {
            aCtx.font = `${Math.round(d.size * 4)}px serif`;
            aCtx.fillText('♥', d.x, d.y);
          } else {
            aCtx.beginPath();
            aCtx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
            aCtx.fill();
          }
        }

        requestAnimationFrame(renderAmbient);
      }
      renderAmbient();

      /* -------------------------------------------------------
         C. SECURITY LOCK SCREEN LOGIC (PIN: 0231)
      -------------------------------------------------------- */
      const SECRET_PIN = '0231';
      let enteredPin = '';
      let isUnlocked = false;

      const lockScreen = document.getElementById('lockScreen');
      const lockCard = document.getElementById('lockCard');
      const pinDots = document.querySelectorAll('.pin-dot');
      const pinHint = document.getElementById('pinHint');
      const lockShackle = document.getElementById('lockShackle');

      const playfulWrongHints = [
        'Almost, my love! Think of our special 4 digits 💫',
        'Not quite, Puju! Try those 4 secret numbers again 💕',
        'Close! Whisper our special code and try once more ✨'
      ];
      let wrongCount = 0;

      function updatePinDots() {
        pinDots.forEach((dot, idx) => {
          if (idx < enteredPin.length) {
            dot.classList.add('bg-amberGlow', 'border-amberGlow', 'scale-125', 'shadow-[0_0_12px_#ffb74d]');
            dot.classList.remove('bg-white/5', 'border-rosegold-300/50');
          } else {
            dot.classList.remove('bg-amberGlow', 'border-amberGlow', 'scale-125', 'shadow-[0_0_12px_#ffb74d]');
            dot.classList.add('bg-white/5', 'border-rosegold-300/50');
          }
        });
      }

      function handlePinInput(digit) {
        if (isUnlocked || enteredPin.length >= 4) return;
        // Unlock audio context immediately on first user tap so Birthday Song auto-plays smoothly
        musicEngine.playChime(523.25 + enteredPin.length * 65);

        enteredPin += digit;
        updatePinDots();

        if (enteredPin.length === 4) {
          if (enteredPin === SECRET_PIN) {
            triggerUnlock();
          } else {
            lockCard.classList.remove('animate-shake');
            void lockCard.offsetWidth;
            lockCard.classList.add('animate-shake');
            pinHint.textContent = playfulWrongHints[wrongCount % playfulWrongHints.length];
            pinHint.classList.add('text-amberGlow');
            wrongCount++;
            setTimeout(() => {
              enteredPin = '';
              updatePinDots();
            }, 420);
          }
        }
      }

      function triggerUnlock() {
        isUnlocked = true;
        pinHint.textContent = 'Unlocked! Happy Birthday, Puju ♥';
        pinHint.classList.add('text-amberGlow', 'font-semibold');

        // Animate shackle open
        lockShackle.style.transform = 'translateY(-4px) rotate(-18deg)';

        // Launch celebratory burst
        launchBurst(window.innerWidth / 2, window.innerHeight / 2, 70);

        // Automatically play "Happy Birthday to You"
        musicEngine.mode = 'birthday';
        musicEngine.start();

        setTimeout(() => {
          lockCard.style.opacity = '0';
          lockCard.style.transform = 'scale(0.92)';
          lockScreen.classList.add('unlocked');

          const nav = document.getElementById('floatingNav');
          nav.classList.remove('opacity-0', 'pointer-events-none');
        }, 550);

        setTimeout(() => {
          lockScreen.style.display = 'none';
        }, 1750);
      }

      document.querySelectorAll('.keypad-btn').forEach((btn) => {
        btn.addEventListener('click', () => handlePinInput(btn.dataset.key));
      });

      document.getElementById('clearPinBtn').addEventListener('click', () => {
        enteredPin = '';
        updatePinDots();
      });

      document.getElementById('backspacePinBtn').addEventListener('click', () => {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDots();
      });

      window.addEventListener('keydown', (e) => {
        if (isUnlocked) return;
        if (/^[0-9]$/.test(e.key)) {
          handlePinInput(e.key);
        } else if (e.key === 'Backspace') {
          enteredPin = enteredPin.slice(0, -1);
          updatePinDots();
        } else if (e.key === 'Escape') {
          enteredPin = '';
          updatePinDots();
        }
      });

      document.getElementById('musicToggleBtn').addEventListener('click', () => musicEngine.toggle());
      document.getElementById('songModeBtn').addEventListener('click', () => musicEngine.switchMode());

      /* -------------------------------------------------------
         D. BIKRAM SAMBAT CALENDAR (MANGSIR 13 SPOTLIGHT) & TIMER
      -------------------------------------------------------- */
      const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      const toNepaliNum = (num) => String(num).split('').map(d => nepaliDigits[Number(d)]).join('');

      const specialMangsirNotes = {
        1: { title: 'मंसिर १ (Mangsir 1) — Beginning of Her Month', desc: 'The crisp Himalayan winter breeze arrives, whispering that Puju’s birthday month has begun.' },
        7: { title: 'मंसिर ७ (Mangsir 7) — Starlight Evening', desc: 'A quiet reminder that every ordinary evening feels magical whenever you are near.' },
        13: { title: 'मंसिर १३ (Mangsir 13) — Puju’s Royal Birthday 👑', desc: 'The universe’s finest masterpiece was born on Mangsir 13. Today and every year, we celebrate your kindness, grace, and radiant soul.' },
        21: { title: 'मंसिर २१ (Mangsir 21) — Endless Gratitude', desc: 'Thank you for every laugh, every gentle word, and every memory we weave together.' },
        30: { title: 'मंसिर ३० (Mangsir 30) — Forever & Beyond', desc: 'Even when Mangsir ends, celebrating you remains my favorite lifelong ritual.' }
      };

      const bsGrid = document.getElementById('bsCalendarGrid');
      const startOffset = 1; // Starts on Monday
      const totalDaysInMangsir = 30;

      for (let i = 0; i < startOffset; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'h-12 sm:h-14 rounded-2xl bg-white/[0.015]';
        bsGrid.appendChild(emptyCell);
      }

      for (let day = 1; day <= totalDaysInMangsir; day++) {
        const isBirthday = day === 13;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = isBirthday
          ? 'relative h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-amberGlow/35 via-rosegold-500/30 to-amberGlow/20 border-2 border-amberGlow text-champagne-100 flex flex-col items-center justify-center animate-pulse-glow scale-105 z-10 transition-transform hover:scale-110'
          : 'relative h-12 sm:h-14 rounded-2xl bg-white/[0.035] hover:bg-rosegold-400/20 border border-white/10 hover:border-rosegold-300/40 text-champagne-100/90 flex flex-col items-center justify-center transition-all';

        btn.innerHTML = `
          <span class="font-nepali text-sm sm:text-base font-bold ${isBirthday ? 'text-amberGlow' : ''}">${toNepaliNum(day)}</span>
          <span class="text-[9px] ${isBirthday ? 'text-champagne-100 font-semibold' : 'text-champagne-300/50'}">${isBirthday ? 'Queen ♥' : day}</span>
          ${isBirthday ? '<span class="absolute -top-1.5 -right-1.5 text-xs">👑</span>' : ''}
        `;

        btn.addEventListener('click', () => {
          const note = specialMangsirNotes[day] || {
            title: `मंसिर ${toNepaliNum(day)} (Mangsir ${day}) — A Day Loving Puju`,
            desc: `Just another day in the calendar where my favorite thought is still you, Puju.`
          };
          document.getElementById('calendarNoteTitle').textContent = note.title;
          document.getElementById('calendarNoteDesc').textContent = note.desc;
          musicEngine.playChime(isBirthday ? 783.99 : 587.33);
        });

        bsGrid.appendChild(btn);
      }

      // Live Countdown / Celebration Timer for Mangsir 13 (Nov 29)
      function updateBirthdayTimer() {
        const now = new Date();
        const year = now.getFullYear();
        // Mangsir 13 corresponds to Nov 29
        let target = new Date(year, 10, 29, 0, 0, 0);
        const isTodayBirthday = now.getMonth() === 10 && now.getDate() === 29;

        const labelEl = document.getElementById('timerStatusLabel');
        if (isTodayBirthday) {
          labelEl.textContent = '🎉 Today is Mangsir 13! Celebrating Puju';
          const endOfDay = new Date(year, 10, 29, 23, 59, 59);
          const diff = Math.max(0, endOfDay - now);
          renderTimerDigits(diff);
          return;
        }

        if (now > target) {
          target = new Date(year + 1, 10, 29, 0, 0, 0);
        }
        labelEl.textContent = 'Counting to Mangsir 13 (Nov 29)';
        renderTimerDigits(target - now);
      }

      function renderTimerDigits(ms) {
        const totalSec = Math.floor(ms / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;

        document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMinutes').textContent = String(mins).padStart(2, '0');
        document.getElementById('cdSeconds').textContent = String(secs).padStart(2, '0');
      }
      updateBirthdayTimer();
      setInterval(updateBirthdayTimer, 1000);

      /* -------------------------------------------------------
         E. HEARTBEAT SYNC INTERACTIVE RITUAL
      -------------------------------------------------------- */
      const heartbeatBtn = document.getElementById('heartbeatBtn');
      const heartbeatProgress = document.getElementById('heartbeatProgress');
      const heartbeatStatus = document.getElementById('heartbeatStatus');
      const circumference = 2 * Math.PI * 34; // ~213.6
      let holdInterval = null;
      let holdProgress = 0;

      function startHeartbeatHold() {
        if (holdInterval) return;
        holdInterval = setInterval(() => {
          holdProgress = Math.min(100, holdProgress + 4);
          const offset = circumference - (holdProgress / 100) * circumference;
          heartbeatProgress.style.strokeDashoffset = offset;

          if (holdProgress % 24 === 0) {
            musicEngine.playChime(440 + holdProgress * 3);
          }

          if (holdProgress >= 100) {
            clearInterval(holdInterval);
            holdInterval = null;
            heartbeatStatus.innerHTML = '<span class="text-amberGlow font-medium">Heartbeats Synced ♥:</span> "No matter where we are, Puju, my heart beats in rhythm with yours."';
            launchBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
          }
        }, 90);
      }

      function stopHeartbeatHold() {
        if (holdInterval) {
          clearInterval(holdInterval);
          holdInterval = null;
        }
        if (holdProgress < 100) {
          holdProgress = 0;
          heartbeatProgress.style.strokeDashoffset = circumference;
        }
      }

      heartbeatBtn.addEventListener('pointerdown', startHeartbeatHold);
      window.addEventListener('pointerup', stopHeartbeatHold);

      /* -------------------------------------------------------
         F. 13 REASONS I ADORE YOU (MANGSIR 13 FLIP DECK)
      -------------------------------------------------------- */
      const thirteenReasons = [
        { emoji: '✨', title: 'Your Radiant Smile', text: 'The way your eyes light up when you laugh makes every worry in my world vanish instantly.' },
        { emoji: '🌸', title: 'Your Gentle Kindness', text: 'You care so deeply and effortlessly for the people around you—your heart is pure gold.' },
        { emoji: '🌙', title: 'Late-Night Conversations', text: 'Talking with you for hours still feels like only five minutes have passed.' },
        { emoji: '👑', title: 'Your Graceful Strength', text: 'You face every challenge with quiet poise and resilience that inspires me every single day.' },
        { emoji: '🎶', title: 'The Sound of Your Voice', text: 'Hearing your voice is my favorite part of any day—it brings instant calm to my soul.' },
        { emoji: '☀️', title: 'How You Brighten Ordinary Days', text: 'Even a simple walk or a cup of tea becomes an unforgettable memory when I am with you.' },
        { emoji: '💫', title: 'Your Playful Humor', text: 'Nobody makes me laugh the way you do—our little inside jokes are my favorite treasure.' },
        { emoji: '🌷', title: 'Your Thoughtfulness', text: 'You notice the smallest details and remember things that mean the world to me.' },
        { emoji: '🕊️', title: 'The Peace You Bring Me', text: 'Being with you feels like standing beneath a clear Himalayan sky—serene, safe, and home.' },
        { emoji: '🔥', title: 'Your Passion & Dreams', text: 'Watching you chase what you love makes me prouder of you than words could ever express.' },
        { emoji: '💌', title: 'The Way You Love', text: 'Your affection is sincere, warm, and grounding—it makes me want to be my best self.' },
        { emoji: '🏔️', title: 'Every Adventure Together', text: 'Whether exploring new places or sitting quietly side by side, you are my favorite destination.' },
        { emoji: '🎂', title: 'Because You Were Born on Mangsir 13', text: 'Out of billions of people in this universe, I am endlessly lucky that I get to love you, Puju.' }
      ];

      let currentReasonIdx = 0;
      const flipInner = document.getElementById('reasonFlipInner');

      function renderReasonCard(index) {
        flipInner.classList.remove('is-flipped');
        const item = thirteenReasons[index];
        const numStr = String(index + 1).padStart(2, '0');
        setTimeout(() => {
          document.getElementById('reasonCounter').textContent = `Reason ${numStr} / 13`;
          document.getElementById('reasonEmoji').textContent = item.emoji;
          document.getElementById('reasonFrontTitle').textContent = item.title;
          document.getElementById('reasonBackBadge').textContent = `Reason #${index + 1} of 13`;
          document.getElementById('reasonBackText').textContent = `"${item.text}"`;
        }, 140);
      }

      document.getElementById('reasonCardWrapper').addEventListener('click', () => {
        flipInner.classList.toggle('is-flipped');
        musicEngine.playChime(659.25);
      });

      document.getElementById('prevReasonBtn').addEventListener('click', () => {
        currentReasonIdx = (currentReasonIdx - 1 + thirteenReasons.length) % thirteenReasons.length;
        renderReasonCard(currentReasonIdx);
      });

      document.getElementById('nextReasonBtn').addEventListener('click', () => {
        currentReasonIdx = (currentReasonIdx + 1) % thirteenReasons.length;
        renderReasonCard(currentReasonIdx);
      });

      document.getElementById('shuffleReasonBtn').addEventListener('click', () => {
        let next = Math.floor(Math.random() * thirteenReasons.length);
        if (next === currentReasonIdx) next = (next + 1) % thirteenReasons.length;
        currentReasonIdx = next;
        renderReasonCard(currentReasonIdx);
        setTimeout(() => flipInner.classList.add('is-flipped'), 260);
      });

      /* -------------------------------------------------------
         G. INTERACTIVE WAX-SEALED LOVE LETTER & "OPEN WHEN..." CAPSULES
      -------------------------------------------------------- */
      const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
      const closedEnvelope = document.getElementById('closedEnvelope');
      const openedLetter = document.getElementById('openedLetter');
      const closeLetterBtn = document.getElementById('closeLetterBtn');

      openEnvelopeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closedEnvelope.classList.add('envelope-open');
        musicEngine.playChime(783.99);
        setTimeout(() => {
          closedEnvelope.classList.add('hidden');
          openedLetter.classList.remove('hidden');
        }, 480);
      });

      closeLetterBtn.addEventListener('click', () => {
        openedLetter.classList.add('hidden');
        closedEnvelope.classList.remove('hidden', 'envelope-open');
      });

      const capsules = [
        { title: 'Open When You Miss Me', msg: 'Close your eyes for three seconds and remember: you are always the closest person to my heart, no matter the distance.' },
        { title: 'Open When You Need a Smile', msg: 'Remember how ridiculously cute you look when you try not to laugh? Consider this your official reminder that you are my favorite human!' },
        { title: 'Open When You Feel Overwhelmed', msg: 'Take one slow, deep breath, Puju. You do not have to carry everything alone—lean on me whenever you need rest.' },
        { title: 'Open on a Quiet Midnight', msg: 'Look up at the night sky—somewhere under those exact same stars, I am grateful beyond words that you are mine.' }
      ];

      document.querySelectorAll('.capsule-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = capsules[Number(btn.dataset.capsule)];
          const box = document.getElementById('capsuleRevealBox');
          document.getElementById('capsuleTitle').textContent = item.title;
          document.getElementById('capsuleMessage').textContent = `"${item.msg}"`;
          box.classList.remove('hidden');
          musicEngine.playChime(698.46);
        });
      });

      /* -------------------------------------------------------
         H. INTERACTIVE WISHING STAR CONSTELLATION (LOCALSTORAGE)
      -------------------------------------------------------- */
      const cCanvas = document.getElementById('constellationCanvas');
      const cCtx = cCanvas.getContext('2d');
      const STARS_STORAGE_KEY = 'puju_wishing_stars_v1';

      // Heart-shaped default constellation coordinates (normalized 0..1)
      const defaultStars = [
        { id: 1, x: 0.50, y: 0.34, title: '★ North Star of Mangsir 13', wish: 'May every dream Puju whispers to the night sky find its way straight into her hands.' },
        { id: 2, x: 0.38, y: 0.24, title: '★ Star of Joy', wish: 'May your days always overflow with genuine laughter and sunlit mornings.' },
        { id: 3, x: 0.27, y: 0.36, title: '★ Star of Grace', wish: 'For the kindness and elegance you bring into every room you enter.' },
        { id: 4, x: 0.33, y: 0.56, title: '★ Star of Adventures', wish: 'To all the mountains, cafes, and sunsets we have yet to explore together.' },
        { id: 5, x: 0.50, y: 0.76, title: '★ Heart Anchor Star', wish: 'My promise to always stand beside you through every season of life.' },
        { id: 6, x: 0.67, y: 0.56, title: '★ Star of Serenity', wish: 'May peace and warmth surround you whenever the world feels busy.' },
        { id: 7, x: 0.73, y: 0.36, title: '★ Star of Radiance', wish: 'Keep shining unapologetically—your light makes my whole universe brighter.' },
        { id: 8, x: 0.62, y: 0.24, title: '★ Star of Forever', wish: 'Happy Birthday, Puju—today, tomorrow, and every Mangsir 13 to come.' }
      ];

      let wishingStars = [];
      try {
        const savedStars = JSON.parse(localStorage.getItem(STARS_STORAGE_KEY));
        wishingStars = Array.isArray(savedStars) && savedStars.length ? savedStars : defaultStars;
      } catch {
        wishingStars = defaultStars;
      }

      let activeStarId = 1;
      let pendingStarCoords = null;

      function resizeConstellation() {
        const rect = cCanvas.parentElement.getBoundingClientRect();
        cCanvas.width = rect.width;
        cCanvas.height = rect.height;
      }
      resizeConstellation();
      window.addEventListener('resize', resizeConstellation);

      function drawConstellation(time = 0) {
        const w = cCanvas.width;
        const h = cCanvas.height;
        cCtx.clearRect(0, 0, w, h);

        // Subtle connecting lines between core heart stars
        const core = wishingStars.slice(0, 8);
        if (core.length >= 8) {
          cCtx.beginPath();
          core.forEach((s, i) => {
            const px = s.x * w;
            const py = s.y * h;
            if (i === 0) cCtx.moveTo(px, py);
            else cCtx.lineTo(px, py);
          });
          cCtx.closePath();
          cCtx.strokeStyle = 'rgba(226, 149, 135, 0.25)';
          cCtx.lineWidth = 1.2;
          cCtx.stroke();
        }

        // Draw stars
        wishingStars.forEach((star, idx) => {
          const px = star.x * w;
          const py = star.y * h;
          const isSelected = star.id === activeStarId;
          const pulse = Math.sin(time * 0.003 + idx) * 2;

          // Glow halo
          const grad = cCtx.createRadialGradient(px, py, 1, px, py, isSelected ? 22 : 13 + pulse);
          grad.addColorStop(0, isSelected ? 'rgba(255, 215, 110, 0.95)' : 'rgba(255, 183, 77, 0.65)');
          grad.addColorStop(1, 'rgba(255, 183, 77, 0)');
          cCtx.fillStyle = grad;
          cCtx.beginPath();
          cCtx.arc(px, py, isSelected ? 22 : 14, 0, Math.PI * 2);
          cCtx.fill();

          // Core star dot
          cCtx.fillStyle = isSelected ? '#ffffff' : '#ffe3a8';
          cCtx.beginPath();
          cCtx.arc(px, py, isSelected ? 4.2 : 2.8, 0, Math.PI * 2);
          cCtx.fill();
        });

        requestAnimationFrame(drawConstellation);
      }
      requestAnimationFrame(drawConstellation);

      cCanvas.addEventListener('click', (e) => {
        const rect = cCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Check if user tapped near an existing star
        const hit = wishingStars.find((s) => {
          const dx = s.x * rect.width - clickX;
          const dy = s.y * rect.height - clickY;
          return Math.hypot(dx, dy) < 22;
        });

        if (hit) {
          activeStarId = hit.id;
          document.getElementById('activeStarBadge').textContent = hit.title;
          document.getElementById('activeStarText').textContent = `"${hit.wish}"`;
          musicEngine.playChime(783.99);
        } else {
          pendingStarCoords = {
            x: Number((clickX / rect.width).toFixed(3)),
            y: Number((clickY / rect.height).toFixed(3))
          };
          document.getElementById('addStarModal').classList.remove('hidden');
          document.getElementById('addStarModal').classList.add('flex');
        }
      });

      document.getElementById('addWishStarPromptBtn').addEventListener('click', () => {
        pendingStarCoords = {
          x: Number((0.2 + Math.random() * 0.6).toFixed(3)),
          y: Number((0.2 + Math.random() * 0.6).toFixed(3))
        };
        document.getElementById('addStarModal').classList.remove('hidden');
        document.getElementById('addStarModal').classList.add('flex');
      });

      document.getElementById('closeAddStarBtn').addEventListener('click', () => {
        document.getElementById('addStarModal').classList.add('hidden');
        document.getElementById('addStarModal').classList.remove('flex');
      });

      document.getElementById('addStarForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('starTitleInput').value.trim();
        const wish = document.getElementById('starWishInput').value.trim();
        if (!title || !wish) return;

        const newStar = {
          id: Date.now(),
          x: pendingStarCoords ? pendingStarCoords.x : 0.5,
          y: pendingStarCoords ? pendingStarCoords.y : 0.5,
          title: `★ ${title}`,
          wish
        };
        wishingStars.push(newStar);
        localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(wishingStars));

        activeStarId = newStar.id;
        document.getElementById('activeStarBadge').textContent = newStar.title;
        document.getElementById('activeStarText').textContent = `"${newStar.wish}"`;
        e.target.reset();
        document.getElementById('addStarModal').classList.add('hidden');
        document.getElementById('addStarModal').classList.remove('flex');
        musicEngine.playChime(880);
      });

      /* -------------------------------------------------------
         I. SHARED MEMORY VAULT (FIREBASE STORAGE + FIRESTORE)
      -------------------------------------------------------- */
      const defaultMemories = [
        {
          id: 'default-1', isDefault: true, title: 'Golden Hour Smile',
          date: 'First Favorite Snapshot',
          note: 'The exact moment I realized your smile could outshine any sunset in the world.',
          image: createArtDataUrl('#3a1426', '#1b0913', '🌅', 'Puju in Golden Light')
        },
        {
          id: 'default-2', isDefault: true, title: 'Coffee & Endless Laughter',
          date: 'Unforgettable Afternoon',
          note: 'Two cups of coffee that went cold because we could not stop talking and laughing together.',
          image: createArtDataUrl('#2b1529', '#140812', '☕', 'Warmth & Laughter')
        },
        {
          id: 'default-3', isDefault: true, title: 'Queen of Mangsir 13',
          date: 'मंसिर १३ • Birthday Edition',
          note: 'Here is to adding hundreds of real photos of our favorite adventures right into this vault.',
          image: createArtDataUrl('#47192c', '#1c0a13', '👑', 'Happy Birthday, Puju')
        }
      ];

      let customMemories = [];
      let activeLightboxMemoryId = null;
      let unsubscribeMemories = null;

      const galleryStatus = document.getElementById('memoryGalleryStatus');
      const setGalleryStatus = (message, isError = false) => {
        if (!galleryStatus) return;
        galleryStatus.textContent = message;
        galleryStatus.classList.toggle('text-red-300', isError);
        galleryStatus.classList.toggle('text-champagne-200/60', !isError);
      };

      function renderMemoryVault() {
        const grid = document.getElementById('memoryGalleryGrid');
        grid.innerHTML = '';
        const allMemories = [...customMemories, ...defaultMemories];
        const tilts = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];

        allMemories.forEach((mem, idx) => {
          const card = document.createElement('article');
          card.className = `polaroid-card rounded-2xl p-4 pb-6 cursor-pointer ${tilts[idx % tilts.length]}`;

          const imageWrap = document.createElement('div');
          imageWrap.className = 'aspect-[4/3] rounded-xl overflow-hidden bg-velvet-950 mb-4 relative';
          const image = document.createElement('img');
          image.src = mem.image;
          image.alt = mem.title || 'Shared memory';
          image.loading = 'lazy';
          image.className = 'w-full h-full object-cover';
          imageWrap.appendChild(image);

          if (!mem.isDefault) {
            const badge = document.createElement('span');
            badge.className = 'absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-velvet-950/80 text-amberGlow text-[10px] font-medium';
            badge.textContent = 'Shared Memory';
            imageWrap.appendChild(badge);
          }

          const details = document.createElement('div');
          details.className = 'px-1';
          const date = document.createElement('p');
          date.className = 'text-[11px] uppercase tracking-widest text-[#9e4756] font-semibold';
          date.textContent = mem.date || 'Our Memory';
          const title = document.createElement('h3');
          title.className = 'font-serif text-xl font-bold text-[#241219] mt-0.5';
          title.textContent = mem.title || 'Untitled memory';
          const note = document.createElement('p');
          note.className = 'text-xs text-[#241219]/75 mt-1.5 line-clamp-2 leading-relaxed';
          note.textContent = mem.note || '';
          details.append(date, title, note);
          card.append(imageWrap, details);
          card.addEventListener('click', () => openLightbox(mem));
          grid.appendChild(card);
        });
      }

      function openLightbox(mem) {
        activeLightboxMemoryId = mem.isDefault ? null : mem.id;
        document.getElementById('lightboxImg').src = mem.image;
        document.getElementById('lightboxDate').textContent = mem.date || 'Cherished Memory';
        document.getElementById('lightboxTitle').textContent = mem.title || '';
        document.getElementById('lightboxNote').textContent = mem.note || '';

        // Deletion is restricted to the uploader by Firestore rules.
        const delBtn = document.getElementById('deleteMemoryBtn');
        if (activeLightboxMemoryId && mem.ownerUid === currentUser?.uid) {
          delBtn.classList.remove('hidden');
        } else {
          delBtn.classList.add('hidden');
        }

        const modal = document.getElementById('lightboxModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }

      document.getElementById('closeLightboxBtn').addEventListener('click', () => {
        document.getElementById('lightboxModal').classList.add('hidden');
        document.getElementById('lightboxModal').classList.remove('flex');
      });

      document.getElementById('deleteMemoryBtn').addEventListener('click', async () => {
        if (!activeLightboxMemoryId) return;
        const memory = customMemories.find((item) => item.id === activeLightboxMemoryId);
        if (!memory || memory.ownerUid !== currentUser?.uid) return;
        if (!confirm('Delete this shared memory for everyone?')) return;
        try {
          await deleteDoc(doc(db, 'memories', activeLightboxMemoryId));
          if (memory.storagePath) await deleteObject(ref(storage, memory.storagePath)).catch(() => {});
          document.getElementById('lightboxModal').classList.add('hidden');
          document.getElementById('lightboxModal').classList.remove('flex');
        } catch (error) {
          console.error(error);
          alert('Could not delete this memory. Please try again.');
        }
      });

      function compressImageFile(file, maxWidth = 1400, quality = 0.82) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
              const scale = Math.min(1, maxWidth / img.width);
              const canvas = document.createElement('canvas');
              canvas.width = Math.round(img.width * scale);
              canvas.height = Math.round(img.height * scale);
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Image compression failed'));
              }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = ev.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const addMemoryModal = document.getElementById('addMemoryModal');
      document.getElementById('openAddMemoryBtn').addEventListener('click', () => {
        addMemoryModal.classList.remove('hidden');
        addMemoryModal.classList.add('flex');
      });
      document.getElementById('closeAddMemoryBtn').addEventListener('click', () => {
        addMemoryModal.classList.add('hidden');
        addMemoryModal.classList.remove('flex');
      });

      document.getElementById('addMemoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const submitButton = form.querySelector('button[type="submit"]');
        const fileInput = document.getElementById('memoryPhotoInput');
        const file = fileInput.files?.[0];
        const title = document.getElementById('memoryTitleInput').value.trim();
        const date = document.getElementById('memoryDateInput').value.trim() || 'Mangsir 13';
        const note = document.getElementById('memoryNoteInput').value.trim();

        if (!file || !title || !note) return;
        if (!file.type.startsWith('image/')) {
          alert('Please choose an image file.');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert('Please choose a photo smaller than 10 MB.');
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Uploading photo…';
        try {
          if (!currentUser) throw new Error('Authentication is not ready. Refresh and try again.');
          const imageBlob = await compressImageFile(file);
          const memoryId = `mem-${crypto.randomUUID()}`;
          const storagePath = `memoryPhotos/${currentUser.uid}/${memoryId}.jpg`;
          const imageRef = ref(storage, storagePath);
          await uploadBytes(imageRef, imageBlob, { contentType: 'image/jpeg' });
          const imageUrl = await getDownloadURL(imageRef);

          await addDoc(collection(db, 'memories'), {
            title,
            date,
            note,
            image: imageUrl,
            storagePath,
            ownerUid: currentUser.uid,
            createdAt: serverTimestamp()
          });

          form.reset();
          addMemoryModal.classList.add('hidden');
          addMemoryModal.classList.remove('flex');
          musicEngine.playChime(783.99);
          setGalleryStatus('Photo uploaded. It is now shared with everyone who visits this website.');
        } catch (err) {
          console.error(err);
          alert(`Upload failed: ${err.message || 'Please check your Firebase setup and try again.'}`);
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Save Memory Forever ✨';
        }
      });

      // Cloud backup export: downloads the memories currently loaded from Firebase.
      document.getElementById('exportMemoriesBtn').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(customMemories, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'puju-memory-vault-backup.json';
        a.click();
        URL.revokeObjectURL(url);
      });

      // The gallery listens in real time, so other visitors see uploads without refreshing.
      const startSharedGallery = () => {
        const memoriesQuery = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
        unsubscribeMemories = onSnapshot(memoriesQuery, (snapshot) => {
          customMemories = snapshot.docs.map((item) => ({ id: item.id, ...item.data(), isDefault: false }));
          renderMemoryVault();
          setGalleryStatus(`${customMemories.length} shared photo${customMemories.length === 1 ? '' : 's'} visible to all visitors.`);
        }, (error) => {
          console.error(error);
          setGalleryStatus('Could not load shared photos. Check Firestore rules and Firebase configuration.', true);
        });
      };

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser = user;
          startSharedGallery();
        } else {
          try {
            await signInAnonymously(auth);
          } catch (error) {
            console.error(error);
            setGalleryStatus('Firebase sign-in failed. Enable Anonymous Authentication in Firebase Console.', true);
          }
        }
      });

      renderMemoryVault();

      /* -------------------------------------------------------
         J. CANDLE BLOW, FIREWORKS, SKY LANTERNS & QUEEN PASS
      -------------------------------------------------------- */
      const celCanvas = document.getElementById('celebrationCanvas');
      const celCtx = celCanvas.getContext('2d');
      celCanvas.width = window.innerWidth;
      celCanvas.height = window.innerHeight;
      window.addEventListener('resize', () => {
        celCanvas.width = window.innerWidth;
        celCanvas.height = window.innerHeight;
      });

      const particles = [];
      const lanterns = [];

      function launchBurst(x, y, count = 60) {
        const colors = ['#ffb74d', '#e29587', '#fdf8f3', '#ff6b8b', '#ffd166'];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 2;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            gravity: 0.09,
            life: 1,
            decay: Math.random() * 0.015 + 0.01,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2
          });
        }
      }

      function spawnSkyLanterns(count = 14) {
        for (let i = 0; i < count; i++) {
          lanterns.push({
            x: Math.random() * celCanvas.width,
            y: celCanvas.height + 40 + Math.random() * 200,
            vy: -(Math.random() * 1.1 + 0.7),
            vx: (Math.random() - 0.5) * 0.5,
            w: 22 + Math.random() * 10,
            h: 30 + Math.random() * 12,
            sway: Math.random() * Math.PI * 2
          });
        }
      }

      function renderCelebration() {
        celCtx.clearRect(0, 0, celCanvas.width, celCanvas.height);

        // Fireworks / Confetti particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.life -= p.decay;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          celCtx.globalAlpha = p.life;
          celCtx.fillStyle = p.color;
          celCtx.beginPath();
          celCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          celCtx.fill();
        }
        celCtx.globalAlpha = 1;

        // Floating glowing sky lanterns
        for (let i = lanterns.length - 1; i >= 0; i--) {
          const l = lanterns[i];
          l.sway += 0.02;
          l.x += l.vx + Math.sin(l.sway) * 0.4;
          l.y += l.vy;
          if (l.y < -60) {
            lanterns.splice(i, 1);
            continue;
          }

          const grad = celCtx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.w * 1.4);
          grad.addColorStop(0, 'rgba(255, 230, 150, 0.95)');
          grad.addColorStop(0.6, 'rgba(255, 140, 66, 0.55)');
          grad.addColorStop(1, 'rgba(255, 140, 66, 0)');

          celCtx.fillStyle = grad;
          celCtx.beginPath();
          celCtx.arc(l.x, l.y, l.w * 1.4, 0, Math.PI * 2);
          celCtx.fill();

          celCtx.fillStyle = '#ffcf70';
          celCtx.beginPath();
          celCtx.roundRect(l.x - l.w / 2, l.y - l.h / 2, l.w, l.h, 6);
          celCtx.fill();
        }

        requestAnimationFrame(renderCelebration);
      }
      renderCelebration();

      let candleBlown = false;
      const candleFlame = document.getElementById('candleFlame');
      const smokeContainer = document.getElementById('smokeContainer');
      const blowCandleBtn = document.getElementById('blowCandleBtn');
      const relightCandleBtn = document.getElementById('relightCandleBtn');
      const wishBanner = document.getElementById('wishCelebrationBanner');

      function blowOutCandle() {
        if (candleBlown) return;
        candleBlown = true;

        candleFlame.style.opacity = '0';
        candleFlame.style.transform = 'scale(0.1)';

        // Smoke puff
        const smoke = document.createElement('div');
        smoke.className = 'smoke-puff w-5 h-5 rounded-full bg-champagne-200/50 blur-sm';
        smokeContainer.appendChild(smoke);
        setTimeout(() => smoke.remove(), 2300);

        blowCandleBtn.classList.add('hidden');
        relightCandleBtn.classList.remove('hidden');
        wishBanner.classList.remove('hidden');

        // Ensure Happy Birthday melody plays during celebration
        musicEngine.mode = 'birthday';
        if (!musicEngine.isPlaying) musicEngine.start();

        // Multi-burst fireworks + sky lanterns
        spawnSkyLanterns(18);
        launchBurst(celCanvas.width * 0.25, celCanvas.height * 0.35, 70);
        setTimeout(() => launchBurst(celCanvas.width * 0.75, celCanvas.height * 0.3, 70), 350);
        setTimeout(() => launchBurst(celCanvas.width * 0.5, celCanvas.height * 0.25, 85), 700);
      }

      blowCandleBtn.addEventListener('click', blowOutCandle);

      relightCandleBtn.addEventListener('click', () => {
        candleBlown = false;
        candleFlame.style.opacity = '1';
        candleFlame.style.transform = 'scale(1)';
        blowCandleBtn.classList.remove('hidden');
        relightCandleBtn.classList.add('hidden');
        wishBanner.classList.add('hidden');
      });

      // Microphone Blow Detection
      document.getElementById('micBlowBtn').addEventListener('click', async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const data = new Uint8Array(analyser.frequencyBinCount);

          document.getElementById('micBlowBtn').textContent = '🌬️ Blow gently now...';

          const checkBlow = () => {
            if (candleBlown) {
              stream.getTracks().forEach(t => t.stop());
              return;
            }
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            if (avg > 48) {
              blowOutCandle();
              stream.getTracks().forEach(t => t.stop());
              document.getElementById('micBlowBtn').textContent = '🎙️ Blow into Mic';
              return;
            }
            requestAnimationFrame(checkBlow);
          };
          checkBlow();
        } catch {
          blowOutCandle();
        }
      });

      // Generate & Download Golden Birthday Queen Pass PNG
      document.getElementById('downloadQueenPassBtn').addEventListener('click', () => {
        const passCanvas = document.createElement('canvas');
        passCanvas.width = 1000;
        passCanvas.height = 560;
        const ctx = passCanvas.getContext('2d');

        // Deep velvet background
        const bg = ctx.createLinearGradient(0, 0, 1000, 560);
        bg.addColorStop(0, '#160910');
        bg.addColorStop(0.5, '#2b101e');
        bg.addColorStop(1, '#12060c');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 1000, 560);

        // Gold double border
        ctx.strokeStyle = '#ffb74d';
        ctx.lineWidth = 4;
        ctx.strokeRect(28, 28, 944, 504);
        ctx.strokeStyle = 'rgba(226, 149, 135, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(42, 42, 916, 476);

        ctx.fillStyle = '#ffb74d';
        ctx.font = '600 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('OFFICIAL ROYAL BIRTHDAY VOUCHER • MANGSIR 13', 500, 105);

        ctx.fillStyle = '#fdf8f3';
        ctx.font = 'italic bold 58px Georgia, serif';
        ctx.fillText('Birthday Queen Pass: Puju', 500, 195);

        ctx.fillStyle = '#f7d9d4';
        ctx.font = '24px Georgia, serif';
        ctx.fillText('Redeemable anytime for one unforgettable dinner date,', 500, 275);
        ctx.fillText('endless warm hugs, spontaneous adventures & all my love.', 500, 315);

        ctx.fillStyle = '#ffb74d';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('VALID FOREVER • SIGNED WITH ALL MY HEART ♥', 500, 425);

        const link = document.createElement('a');
        link.download = 'Puju-Golden-Birthday-Pass-Mangsir13.png';
        link.href = passCanvas.toDataURL('image/png');
        link.click();
      });

      /* -------------------------------------------------------
         K. SCROLL REVEAL, PARALLAX ORBS & ACTIVE NAV HIGHLIGHT
      -------------------------------------------------------- */
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.14 }
      );
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => revealObserver.observe(el));

      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');

      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Parallax orbs
        document.querySelectorAll('.parallax-orb').forEach((orb) => {
          const speed = Number(orb.dataset.parallax || 0.1);
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Active dock pill
        let currentId = 'hero';
        sections.forEach((sec) => {
          if (scrollY >= sec.offsetTop - 260) {
            currentId = sec.id;
          }
        });

        navLinks.forEach((link) => {
          if (link.dataset.nav === currentId) {
            link.classList.add('text-champagne-100', 'bg-rosegold-400/25', 'border', 'border-rosegold-300/30');
            link.classList.remove('text-champagne-200/70');
          } else {
            link.classList.remove('text-champagne-100', 'bg-rosegold-400/25', 'border', 'border-rosegold-300/30');
            link.classList.add('text-champagne-200/70');
          }
        });
      }, { passive: true });
    })();