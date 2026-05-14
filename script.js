const $=(q,root=document)=>root.querySelector(q);const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const lessons=window.LESSONS||[];const resources=window.RESOURCES||{};
const grid=$('#lessonGrid');
function lessonCard(l){return `<article class="lesson-card" data-phase="${l.phase}" id="lesson-${l.n}"><div class="lesson-meta"><span>${String(l.n).padStart(2,'0')}차시</span><span>${l.phase}</span><span>40~50분</span></div><h3>${l.title}</h3><p>${l.mission}</p><div class="lesson-output"><strong>오늘 만들 것</strong><br>${l.making}</div><div class="lesson-tags">${l.concepts.split(' · ').map(t=>`<span>${t}</span>`).join('')}</div><div class="lesson-actions"><a class="button ghost" href="lessons/lesson-${String(l.n).padStart(2,'0')}.html">본문 페이지</a><button class="button primary open-lesson" data-id="${l.n}">빠른 보기</button></div></article>`}
if(grid) grid.innerHTML=lessons.map(lessonCard).join('');
$$('.lesson-toolbar button').forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.filter;$$('.lesson-toolbar button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$$('.lesson-card').forEach(c=>{c.style.display=(f==='all'||c.dataset.phase===f)?'flex':'none'})}));
function fullLesson(l){return `<p class="eyebrow">${String(l.n).padStart(2,'0')}차시 · ${l.phase}</p><h2>${l.title}</h2><p class="hero-text">${l.mission}</p><div class="modal-section"><h4>오늘 만들 것</h4><p>${l.making}</p></div><div class="modal-section"><h4>핵심 개념</h4><p>${l.concepts}</p></div><div class="modal-section"><h4>수업 본문</h4><ol>${l.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div><div class="modal-section"><h4>학생 미션</h4><p>오늘은 완벽한 정답보다 “직접 바꿔보고, 결과를 관찰하고, 친구와 차이를 설명하는 것”이 중요합니다. 팀별로 기준값·색상·메시지를 다르게 정하고 왜 그렇게 정했는지 기록하세요.</p></div><div class="modal-section"><h4>생각 질문</h4><p>${l.question}</p></div><div class="modal-section"><h4>저장할 산출물</h4><p>${l.output}</p></div><div class="modal-section"><h4>막히면 먼저 확인하기</h4><ul><li>케이블 방향과 포트가 맞나요?</li><li>파일 이름과 데이터 열 이름이 교재와 같은가요?</li><li>오류 메시지의 첫 줄과 마지막 줄을 읽었나요?</li><li>AI를 사용했다면 답을 그대로 붙이지 않고 검증했나요?</li></ul></div>`}
const modal=$('#lessonModal'),modalContent=$('#modalContent');
document.addEventListener('click',e=>{const b=e.target.closest('.open-lesson');if(b){const l=lessons.find(x=>x.n==b.dataset.id);modalContent.innerHTML=fullLesson(l);enhanceCodeBlocks(modalContent);modal.classList.add('show');modal.setAttribute('aria-hidden','false')}if(e.target.matches('.modal-close')||e.target===modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}});
const rg=$('#resourceGrid');if(rg) rg.innerHTML=Object.entries(resources).map(([name,body])=>`<article class="resource-card"><h3>${name}</h3><p>웹 GitHub에서 같은 경로로 파일을 만들고 아래 내용을 붙여 넣으세요.</p><pre><code>${body.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</code></pre></article>`).join('');
function escapeHtml(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function highlightCode(raw){
  let s=escapeHtml(raw);
  const placeholders=[];
  const hold=(html)=>{const id=`@@H${placeholders.length}@@`;placeholders.push(html);return id};
  s=s.replace(/(&quot;[^\n]*?&quot;|'[^\n]*?')/g,m=>hold(`<span class="tok-str">${m}</span>`));
  s=s.replace(/(#.*)$/gm,m=>hold(`<span class="tok-comment">${m}</span>`));
  s=s.replace(/\b(from|import|as|def|return|if|elif|else|for|while|try|except|finally|with|in|and|or|not|True|False|None|class|break|continue)\b/g,'<span class="tok-key">$1</span>');
  s=s.replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="tok-num">$1</span>');
  s=s.replace(/\b(print|sleep|Pin|NeoPixel|read_csv|dataframe|metric|line_chart|bar_chart|groupby|set_index|mean|sum|len|range)\b/g,'<span class="tok-fn">$1</span>');
  placeholders.forEach((v,i)=>{s=s.replace(`@@H${i}@@`,v)});
  return s;
}
function enhanceCodeBlocks(root=document){
  $$('pre',root).forEach((pre,idx)=>{
    if(pre.closest('.code-shell')) return;
    const code=pre.querySelector('code'); if(!code) return;
    const raw=code.textContent;
    const lang=/^\s*(from|import|def|while|if|st\.|df\s*=|#)/m.test(raw)?'Python':(/^\s*[{\[]/.test(raw)?'JSON':(raw.includes(',')?'CSV':'Code'));
    code.innerHTML=highlightCode(raw);
    const shell=document.createElement('div'); shell.className='code-shell';
    const bar=document.createElement('div'); bar.className='code-toolbar';
    bar.innerHTML=`<span class="code-dots"><i></i><i></i><i></i></span><strong>${lang}</strong><button type="button" class="copy-code">복사</button>`;
    pre.parentNode.insertBefore(shell,pre); shell.appendChild(bar); shell.appendChild(pre);
    bar.querySelector('.copy-code').addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(raw); const b=bar.querySelector('.copy-code'); b.textContent='복사됨'; b.classList.add('copied'); setTimeout(()=>{b.textContent='복사'; b.classList.remove('copied')},1400)}
      catch{const b=bar.querySelector('.copy-code'); b.textContent='복사 실패'; setTimeout(()=>b.textContent='복사',1400)}
    });
  });
}
function enhanceRgbMixers(root=document){
  $$('.rgb-mixer',root).forEach(mixer=>{
    const preview=$('.rgb-preview',mixer), out=$('.rgb-output code',mixer), btn=$('.copy-rgb',mixer);
    const update=()=>{
      const vals={};
      $$('input[type="range"]',mixer).forEach(input=>{vals[input.dataset.channel]=Number(input.value); input.nextElementSibling.textContent=input.value});
      const rgb=`${vals.r}, ${vals.g}, ${vals.b}`;
      preview.style.background=`rgb(${rgb})`;
      preview.style.boxShadow=`0 24px 70px rgba(${vals.r},${vals.g},${vals.b},.35)`;
      out.textContent=`team_color = (${rgb})`;
    };
    $$('input[type="range"]',mixer).forEach(input=>input.addEventListener('input',update));
    btn?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(out.textContent);btn.textContent='복사됨';setTimeout(()=>btn.textContent='RGB 코드 복사',1300)}catch{btn.textContent='복사 실패';setTimeout(()=>btn.textContent='RGB 코드 복사',1300)}});
    update();
  });
}
enhanceCodeBlocks();
enhanceRgbMixers();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.08});
$$('.lesson-card,.visual-card,.kit-card,.quick-card,.journey-step,.resource-card').forEach(el=>observer.observe(el));
