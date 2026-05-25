(function(){
  const btn=document.querySelector('.menu-toggle');
  const links=document.querySelector('.navlinks');
  if(btn&&links){btn.addEventListener('click',()=>links.classList.toggle('open'));}
  document.querySelectorAll('img').forEach(img=>{ if(!img.getAttribute('alt')) img.setAttribute('alt','OMTOGEL'); });
})();
