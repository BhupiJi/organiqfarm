/* assets/script.js - small interactions */
document.addEventListener('DOMContentLoaded',function(){
  // mobile nav toggle
  const btn = document.querySelector('#mobileBtn');
  const nav = document.querySelector('#nav');
  if(btn && nav){
    btn.addEventListener('click',()=>nav.classList.toggle('open'));
  }

  // smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const target=document.querySelector(a.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    })
  });

  // simple date formatter for posts (if any element has data-date)
  document.querySelectorAll('[data-date]').forEach(el=>{
    const d = new Date(el.dataset.date);
    el.textContent = d.toLocaleDateString(undefined,{year:'numeric',month:'short'});
  });
});
