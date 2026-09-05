/* Just-Start Renewal — script.js */
/* anime.min.js 로드 실패 시 CDN 폴백 */
if (!window.anime){
  document.write('<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"><\/script>');
}

function isHome(){ return document.body.id === 'tt-body-index'; }

/* ── 테마 토글 ── */
function toggleTheme(){
  var dark = document.body.classList.toggle('dark');
  var btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch(e){}
}
(function(){
  try {
    if (localStorage.getItem('theme') === 'dark'){
      document.body.classList.add('dark');
      var b = document.querySelector('.theme-toggle');
      if (b) b.textContent = '☀️';
    }
  } catch(e){}
})();

/* ── 사이드바 토글 (데스크톱 접기/펼치기 · 모바일 드로어) ── */
function toggleSb(){
  if (window.innerWidth < 1024){
    document.body.classList.toggle('drawer-open');
    var ov = document.querySelector('.overlay');
    if (ov) ov.classList.toggle('show');
  } else {
    document.body.classList.toggle('sb-closed');
    try { localStorage.setItem('sb', document.body.classList.contains('sb-closed') ? 'closed' : 'open'); } catch(e){}
  }
}
function closeDrawer(){
  document.body.classList.remove('drawer-open');
  var ov = document.querySelector('.overlay');
  if (ov) ov.classList.remove('show');
}
try {
  if (localStorage.getItem('sb') === 'closed' && window.innerWidth >= 1024){
    document.body.classList.add('sb-closed');
  }
} catch(e){}

/* ── 목록 지점으로 스크롤 (CTA 버튼) ── */
function scrollToPosts(){
  var el = document.getElementById('postList');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── 히어로 애니메이션 ── */
(function(){
  var hero = document.getElementById('hero');
  if (!hero) return;

  /* 타이틀 글자 분해 */
  document.querySelectorAll('.hero-title .line').forEach(function(line){
    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(line.childNodes, function(node){
      var cls = (node.nodeType === 1) ? 'char ' + node.className : 'char';
      Array.prototype.forEach.call(node.textContent, function(ch){
        var s = document.createElement('span');
        s.className = cls;
        s.textContent = (ch === ' ') ? '\u00A0' : ch;
        frag.appendChild(s);
      });
    });
    line.innerHTML = '';
    line.appendChild(frag);
  });

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desc = (window.__BLOG && window.__BLOG.desc) || '';
  var txt = desc || 'CodeUp 풀이부터 React, Flutter, AI까지 — 배운 것을 기록합니다.';
  var tEl = document.getElementById('typed'), tId;
  function type(){
    if (!tEl) return;
    clearInterval(tId); tEl.textContent = ''; var i = 0;
    tId = setInterval(function(){ tEl.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(tId); }, 34);
  }

  if (!window.anime || reduce){ type(); return; }

  anime.timeline({easing:'easeOutExpo'})
    .add({targets:'#hero .glow', opacity:[0,.5], duration:1400}, 0)
    .add({targets:'.fx-grid', opacity:[0,1], duration:1300}, 0)
    .add({targets:'.float-el', opacity:[0,1], scale:[.5,1], duration:900, delay:anime.stagger(80, {start:150})}, 100)
    .add({targets:'.hero-tag', opacity:[0,1], translateY:[18,0], duration:650}, 150)
    .add({targets:'.hero-title .line', opacity:[0,1], translateY:[34,0], duration:900, delay:anime.stagger(170)}, 320)
    .add({targets:'.hero-sub', opacity:[0,1], duration:450}, 1000)
    .add({targets:'.hero-cta button', opacity:[0,1], translateY:[14,0], duration:600, delay:anime.stagger(130)}, 1200)
    .add({targets:'.hero-stats .stat', opacity:[0,1], translateY:[16,0], duration:650, delay:anime.stagger(120)}, 1400)
    .add({targets:'.scroll-hint', opacity:[0,1], duration:500}, 1900);
  type();

  hero.addEventListener('mousemove', function(e){
    var r = hero.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    anime({targets:'#hero .hero-core', translateX:x*16, translateY:y*12, duration:900, easing:'easeOutQuad'});
  });
  hero.addEventListener('mouseleave', function(){
    anime({targets:'#hero .hero-core', translateX:0, translateY:0, duration:800, easing:'easeOutQuad'});
  });
})();
/* ── 카드 등장 (반복 재생 가능) ── */
(function(){
  var cards = document.querySelectorAll('#tt-body-index .post-card');
  var content = document.getElementById('postList');
  if (!content) return;
  window.__playCards = function(){
    if (window.__cardsShown || !window.anime) return;
    window.__cardsShown = true;
    anime({targets:cards, opacity:[0,1], translateY:[30,0], duration:700,
      delay:anime.stagger(90), easing:'easeOutCubic'});
  };
  if ('IntersectionObserver' in window){
    cards.forEach(function(c){ c.style.opacity = 0; });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) window.__playCards(); });
    }, {threshold:.1});
    io.observe(content);
  }
})();

/* ── 히어로 ↔ 목록 스크롤 전환 (터미널 컨셉 · 산산조각 · 양방향) ── */
function goDown(){ if (window.__swoosh) window.__swoosh('down'); }
function goUp(){ if (window.__swoosh) window.__swoosh('up'); }

(function(){
  if (!isHome()) return;

  var THRESH = 240, busy = false, scattered = false;
  var acc = 0, accUp = 0, decayTimer = null;
  var liftEl = document.querySelector('.hero-lift');
  var listEl = document.getElementById('postList');
  var cmdEl = document.getElementById('termCmd');

  function showTerm(){
    if (!window.anime) return;
    anime({targets:'#term', opacity:[0,1], translateY:[12,0], duration:220, easing:'easeOutQuad'});
  }
  function hideTerm(){
    if (!window.anime) return;
    anime({targets:'#term', opacity:0, translateY:12, duration:220, easing:'easeInQuad'});
  }
  function typeCmd(cmd, done){
    showTerm();
    cmdEl.textContent = '';
    var i = 0;
    var iv = setInterval(function(){
      cmdEl.textContent = cmd.slice(0, ++i);
      if (i >= cmd.length){ clearInterval(iv); setTimeout(done, 170); }
    }, 26);
  }

  function scatter(){
    if (!window.anime) return;
    scattered = true;
    anime({targets:'.hero-title .char',
      translateX:function(){ return anime.random(-150,150); },
      translateY:function(){ return anime.random(-170,130); },
      rotate:function(){ return anime.random(-140,140); },
      opacity:[1,0], duration:680, delay:anime.stagger(11), easing:'easeInExpo'});
    anime({targets:'#hero .glow, #hero .float-el, #hero .fx-grid, #hero .scroll-hint', opacity:0, duration:380, easing:'easeOutQuad'});
    anime({targets:'#hero .hero-tag, #hero .hero-sub, #hero .hero-cta, #hero .hero-stats', opacity:0, translateY:-28, duration:380, easing:'easeInQuad'});
  }
  function reassemble(){
    if (!scattered || !window.anime) return;
    scattered = false;
    anime({targets:'.hero-title .char', translateX:0, translateY:0, rotate:0, opacity:1, duration:750, delay:anime.stagger(9), easing:'easeOutBack'});
    anime({targets:'#hero .glow, #hero .float-el, #hero .fx-grid', opacity:1, duration:600, easing:'easeOutQuad', delay:anime.stagger(40)});
    anime({targets:'#hero .hero-tag, #hero .hero-sub, #hero .hero-cta, #hero .hero-stats', opacity:1, translateY:0, duration:480, easing:'easeOutQuad'});
  }
  window.__swoosh = function(dir){
    if (busy) return;
    busy = true;
    if (dir === 'down'){
      acc = 0;
      if (liftEl) liftEl.style.transform = 'translateY(0)';
      if (!window.anime){
        var e0 = listEl.getBoundingClientRect().top + window.scrollY - 6;
        window.scrollTo({ top: e0, behavior: 'smooth' });
        setTimeout(function(){ busy = false; if (window.__playCards) window.__playCards(); }, 900);
        return;
      }
      typeCmd('cd ./posts', function(){
        scatter();
        var end = listEl.getBoundingClientRect().top + window.scrollY - 6;
        var o = { y: window.scrollY };
        anime({targets:o, y:end, duration:1150, easing:'easeInOutQuart',
          update:function(){ window.scrollTo(0, o.y); },
          complete:function(){ busy = false; hideTerm(); if (window.__playCards) window.__playCards(); }});
      });
    } else {
      accUp = 0;
      if (listEl) listEl.style.transform = 'translateY(0)';
      if (!window.anime){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(function(){ busy = false; }, 700);
        return;
      }
      typeCmd('cd ..', function(){
        anime({targets:'.post-card, .pager, .revenue.lower', opacity:0, translateY:-26, duration:340, delay:anime.stagger(30), easing:'easeInQuad'});
        var o = { y: window.scrollY };
        anime({targets:o, y:0, duration:750, easing:'easeInOutQuart',
          update:function(){ window.scrollTo(0, o.y); },
          complete:function(){
            busy = false; hideTerm();
            reassemble();
            window.__cardsShown = false;
            document.querySelectorAll('.post-card').forEach(function(c){ c.style.opacity = 0; });
          }});
      });
    }
  };

  function applyLift(){ if (liftEl) liftEl.style.transform = 'translateY(' + (-Math.min(acc/THRESH,1)*70) + 'px)'; }
  function applyNudge(){ if (listEl) listEl.style.transform = 'translateY(' + (Math.min(accUp/THRESH,1)*46) + 'px)'; }
  function decay(){
    if (busy) return;
    acc = 0; accUp = 0;
    if (liftEl) liftEl.style.transform = 'translateY(0)';
    if (listEl) listEl.style.transform = 'translateY(0)';
    hideTerm();
  }

  window.addEventListener('wheel', function(e){
    if (!isHome()) return;
    var y = window.scrollY;
    var listTop = listEl ? listEl.offsetTop : 0;
    if (busy){ e.preventDefault(); return; }
    if (y <= 10 && e.deltaY > 0){
      e.preventDefault();
      acc = Math.min(acc + e.deltaY, THRESH);
      if (acc >= THRESH){ window.__swoosh('down'); }
      else { applyLift(); if (acc > 40) showTerm(); }
      clearTimeout(decayTimer); decayTimer = setTimeout(decay, 300);
    } else if (y > 10 && y < listTop + 120 && e.deltaY < 0){
      e.preventDefault();
      accUp = Math.min(accUp - e.deltaY, THRESH);
      if (accUp >= THRESH){ window.__swoosh('up'); }
      else { applyNudge(); if (accUp > 40) showTerm(); }
      clearTimeout(decayTimer); decayTimer = setTimeout(decay, 300);
    } else {
      acc = 0; accUp = 0;
      if (liftEl) liftEl.style.transform = 'translateY(0)';
    }
  }, { passive: false });

  var touchY = null;
  window.addEventListener('touchstart', function(e){ touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function(e){
    if (!isHome() || busy || touchY === null) return;
    var dy = touchY - e.touches[0].clientY;
    var y = window.scrollY;
    var listTop = listEl ? listEl.offsetTop : 0;
    if (y <= 10 && dy > 45){ e.preventDefault(); window.__swoosh('down'); }
    else if (y > 10 && y < listTop + 120 && dy < -45){ e.preventDefault(); window.__swoosh('up'); }
  }, { passive: false });

  window.addEventListener('scroll', function(){
    if (isHome() && window.scrollY <= 4 && scattered && !busy) reassemble();
  });
})();