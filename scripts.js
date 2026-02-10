// scripts.js — toggles de tema, copy snippets e inicializações leves
(function(){
  // Theme toggle: use body.light to switch variables
  const btn = document.getElementById('theme-toggle');
  const body = document.body;
  const pref = localStorage.getItem('theme');
  if(pref === 'light') body.classList.add('light');

  if(btn){
    btn.addEventListener('click', () => {
      body.classList.toggle('light');
      const now = body.classList.contains('light') ? 'light' : 'dark';
      localStorage.setItem('theme', now);
    });
  }

  // Copy buttons for code snippets
  document.addEventListener('click', (e) => {
    const el = e.target;
    if(el && el.matches('.copy-btn')){
      const targetId = el.getAttribute('data-target');
      const codeEl = document.getElementById(targetId);
      if(codeEl){
        const text = codeEl.innerText || codeEl.textContent;
        navigator.clipboard.writeText(text).then(()=>{
          const prev = el.textContent;
          el.textContent = 'Copiado!';
          setTimeout(()=> el.textContent = prev || 'Copiar', 1500);
        }).catch(()=>{
          el.textContent = 'Erro';
          setTimeout(()=> el.textContent = 'Copiar', 1500);
        });
      }
    }
  });

  // Analytics loader (GA4) — replace MEASUREMENT_ID with your id
  function loadGA(measurementId){
    if(!measurementId) return;
    if(window.gaLoaded) return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} 
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId);

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(s);
    window.gaLoaded = true;
  }

  // Cookie / Consent banner
  function showCookieBanner(){
    if(localStorage.getItem('analytics_consent') !== null) return; // already decided

    const banner = document.createElement('div');
    banner.setAttribute('role','dialog');
    banner.className = 'cookie-banner fixed bottom-6 left-6 right-6 md:left-auto md:right-6 p-4 md:p-6 rounded-lg z-50 flex flex-col md:flex-row gap-4 items-center';
    banner.innerHTML = `
      <div class="cookie-message flex-1 text-sm">Usamos analytics para melhorar o site. Aceita cookies de análise?</div>
      <div class="cookie-actions">
        <button id="cookie-decline" class="cookie-btn cookie-decline">Recusar</button>
        <button id="cookie-accept" class="cookie-btn cookie-accept">Aceitar</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', ()=>{
      localStorage.setItem('analytics_consent','granted');
      // Replace with your GA4 measurement ID
      loadGA('G-XXXXXXX');
      banner.remove();
    });
    document.getElementById('cookie-decline').addEventListener('click', ()=>{
      localStorage.setItem('analytics_consent','denied');
      banner.remove();
    });
  }

  // Initialize analytics if consent already given
  if(localStorage.getItem('analytics_consent') === 'granted'){
    loadGA('G-XXXXXXX'); // replace with real ID
  } else {
    // show banner after small delay
    window.addEventListener('load', ()=> setTimeout(showCookieBanner, 900));
  }

})();
