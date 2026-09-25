/* BrinqPlay - JavaScript centralizado
   O visual original foi preservado. Este arquivo concentra apenas comportamento e LocalStorage.
*/
const STORAGE = {
  cart: 'brinqplay_cart',
  users: 'brinqplay_users',
  session: 'brinqplay_session',
  order: 'brinqplay_last_order'
};

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const getJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const defaultCart = [
  { id:'super-robo', name:'Super Robô Programável STEAM Explorer', price:249.90, qty:1 },
  { id:'castelo-magico', name:'Kit Castelo Mágico Blocos Criativos 750 Peças', price:189.90, qty:2 },
  { id:'misterio-floresta', name:'Jogo de Tabuleiro Mistério na Floresta', price:119.90, qty:1 }
];
function getCart(){
  const cart=getJSON(STORAGE.cart,null);
  if(!Array.isArray(cart)){ setJSON(STORAGE.cart,defaultCart); return structuredClone(defaultCart); }
  return cart;
}
function saveCart(cart){ setJSON(STORAGE.cart,cart); updateCartBadge(cart); }
function cartCount(cart=getCart()){ return cart.reduce((s,p)=>s+(Number(p.qty)||0),0); }
function cartSubtotal(cart=getCart()){ return cart.reduce((s,p)=>s+(Number(p.price)||0)*(Number(p.qty)||0),0); }
function updateCartBadge(cart=getCart()){
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartCount(cart));
}

function toast(message){
  const el=document.getElementById('cart-toast'), text=document.getElementById('toast-text');
  if(!el||!text) return;
  text.textContent=message;
  el.classList.remove('translate-y-24','opacity-0'); el.classList.add('translate-y-0','opacity-100');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>{el.classList.remove('translate-y-0','opacity-100');el.classList.add('translate-y-24','opacity-0');},2600);
}

function addToCart(btn){
  const id=btn.dataset.productId, name=btn.dataset.name||'Brinquedo', price=Number(btn.dataset.price||0);
  const cart=getCart(); const item=cart.find(p=>p.id===id);
  if(item) item.qty+=1; else cart.push({id,name,price,qty:1});
  saveCart(cart); toast('"'+name+'" foi para o carrinho!');
  btn.classList.add('scale-95'); setTimeout(()=>btn.classList.remove('scale-95'),150);
}

function initCatalog(){
  document.querySelectorAll('.add-to-cart-btn').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();addToCart(btn);}));
  document.querySelectorAll('.wishlist-btn').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault(); const icon=btn.querySelector('.material-symbols-outlined');
    const filled=icon?.style.fontVariationSettings?.includes("'FILL' 1");
    if(filled){icon.style.fontVariationSettings="'FILL' 0";btn.classList.remove('text-error');btn.classList.add('text-on-surface-variant');}
    else{icon.style.fontVariationSettings="'FILL' 1";btn.classList.remove('text-on-surface-variant');btn.classList.add('text-error');toast('Adicionado à sua Lista de Desejos!');}
  }));
  const pills=document.querySelectorAll('.cat-pill'); pills.forEach(pill=>pill.addEventListener('click',()=>{
    pills.forEach(p=>{p.classList.remove('bg-primary-container','text-on-primary');p.classList.add('bg-surface-container-low','text-on-surface');});
    pill.classList.remove('bg-surface-container-low','text-on-surface');pill.classList.add('bg-primary-container','text-on-primary');
  }));
  document.getElementById('clear-filters-btn')?.addEventListener('click',()=>{document.querySelectorAll('#filter-sidebar input[type="checkbox"]').forEach(c=>c.checked=false);const r=document.querySelector('#filter-sidebar input[name="price-filter"]');if(r)r.checked=true;toast('Filtros restaurados!');});
  document.getElementById('mobile-filter-trigger')?.addEventListener('click',()=>{const s=document.getElementById('filter-sidebar');if(!s)return;s.classList.toggle('hidden');if(!s.classList.contains('hidden'))s.scrollIntoView({behavior:'smooth'});});
  document.getElementById('load-more-btn')?.addEventListener('click',e=>{const b=e.currentTarget;b.innerHTML='<span class="material-symbols-outlined animate-spin text-[18px]">autorenew</span> Carregando...';setTimeout(()=>{b.innerHTML='<span class="material-symbols-outlined text-[18px]">check</span> Todos os 142 itens carregados';b.disabled=true;b.classList.add('opacity-70','cursor-not-allowed');const c=document.getElementById('item-count');if(c)c.textContent='142';toast('Todos os brinquedos foram carregados.');},800);});
}

function renderCart(){
  const cart=getCart(); updateCartBadge(cart);
  document.querySelectorAll('[data-cart-item]').forEach(card=>{
    const item=cart.find(p=>p.id===card.dataset.cartItem); if(!item){card.remove();return;}
    const q=card.querySelector('[data-cart-qty]'); if(q)q.textContent=item.qty;
    const line=card.querySelector('[data-cart-line-total]'); if(line)line.textContent=money(item.price*item.qty);
    const installment=card.querySelector('[data-cart-line-total]')?.parentElement?.querySelector('p.font-label-sm');
    if(installment) installment.textContent=`${item.qty}x ${money(item.price)}`;
  });
  const sub=cartSubtotal(cart); const subEl=document.querySelector('[data-cart-subtotal]'); if(subEl)subEl.textContent=money(sub);
  // Preserve the original cart visual calculation: gift wrapping + shipping remain as designed in the page.
}
function initCart(){
  renderCart();
  document.querySelectorAll('[data-cart-action="increase"]').forEach(b=>b.addEventListener('click',()=>changeQty(b,1)));
  document.querySelectorAll('[data-cart-action="decrease"]').forEach(b=>b.addEventListener('click',()=>changeQty(b,-1)));
  document.querySelectorAll('[data-cart-action="remove"]').forEach(b=>b.addEventListener('click',()=>removeItem(b)));
  document.querySelector('[data-cart-action="clear"]')?.addEventListener('click',()=>{saveCart([]);renderCart();toast('Carrinho limpo!');});
}
function changeQty(button,delta){const card=button.closest('[data-cart-item]');const id=card?.dataset.cartItem;if(!id)return;const cart=getCart();const item=cart.find(p=>p.id===id);if(!item)return;item.qty=Math.max(1,item.qty+delta);saveCart(cart);renderCart();}
function removeItem(button){const card=button.closest('[data-cart-item]');const id=card?.dataset.cartItem;if(!id)return;saveCart(getCart().filter(p=>p.id!==id));renderCart();toast('Item removido do carrinho.');}

function switchAuthTab(tab){
  const loginTab=document.getElementById('tab-login'), signupTab=document.getElementById('tab-signup'), login=document.getElementById('container-login'), signup=document.getElementById('container-signup');
  if(!loginTab||!signupTab||!login||!signup)return;
  if(tab==='login'){loginTab.className='flex-1 py-3 text-center rounded-xl font-label-lg text-label-lg transition-all duration-200 bg-surface-container-lowest text-on-surface shadow-sm font-bold flex items-center justify-center space-x-2';signupTab.className='flex-1 py-3 text-center rounded-xl font-label-lg text-label-lg transition-all duration-200 text-on-surface-variant hover:text-on-surface font-semibold flex items-center justify-center space-x-2';login.classList.remove('hidden');signup.classList.add('hidden');}
  else{signupTab.className='flex-1 py-3 text-center rounded-xl font-label-lg text-label-lg transition-all duration-200 bg-surface-container-lowest text-on-surface shadow-sm font-bold flex items-center justify-center space-x-2';loginTab.className='flex-1 py-3 text-center rounded-xl font-label-lg text-label-lg transition-all duration-200 text-on-surface-variant hover:text-on-surface font-semibold flex items-center justify-center space-x-2';signup.classList.remove('hidden');login.classList.add('hidden');}
}
function togglePasswordVisibility(fieldId,btn){const input=document.getElementById(fieldId),icon=btn.querySelector('.material-symbols-outlined');if(input.type==='password'){input.type='text';icon.textContent='visibility_off';}else{input.type='password';icon.textContent='visibility';}}
function initAuth(){
  const forms=document.querySelectorAll('form');
  forms.forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    const submit=e.submitter?.textContent||'';
    if(submit.includes('Criar Conta')){
      const name=document.getElementById('signup-name')?.value.trim(),email=document.getElementById('signup-email')?.value.trim().toLowerCase(),pass=document.getElementById('signup-pass')?.value;
      if(!name||!email||!pass){toast('Preencha os campos obrigatórios.');return;}
      const users=getJSON(STORAGE.users,[]); if(users.some(u=>u.email===email)){toast('Este e-mail já está cadastrado.');return;}
      users.push({name,email,pass});setJSON(STORAGE.users,users);setJSON(STORAGE.session,{name,email});toast('Conta criada com sucesso!');setTimeout(()=>location.href='index.html',700);
    }else{
      const email=document.getElementById('login-email')?.value.trim().toLowerCase(),pass=document.getElementById('login-password')?.value;const users=getJSON(STORAGE.users,[]);const user=users.find(u=>u.email===email&&u.pass===pass);
      if(!user){toast('E-mail ou senha incorretos.');return;}setJSON(STORAGE.session,{name:user.name,email:user.email});toast('Login realizado com sucesso!');setTimeout(()=>location.href='index.html',700);
    }
  }));
}

function selectPayment(method){
  const tabs={pix:document.getElementById('tab-pix'),card:document.getElementById('tab-card'),boleto:document.getElementById('tab-boleto')};
  const panes={pix:document.getElementById('pane-pix'),card:document.getElementById('pane-card'),boleto:document.getElementById('pane-boleto')};
  Object.keys(tabs).forEach(k=>{if(!tabs[k]||!panes[k])return;tabs[k].className='flex flex-col sm:flex-row items-center justify-center gap-1.5 py-space-sm px-space-xs rounded-lg font-label-md text-label-md transition-all text-on-surface-variant hover:text-on-surface';panes[k].classList.add('hidden');});
  if(tabs[method]&&panes[method]){tabs[method].className='flex flex-col sm:flex-row items-center justify-center gap-1.5 py-space-sm px-space-xs rounded-lg font-label-md text-label-md transition-all bg-surface-container-lowest text-primary-container shadow-sm font-bold';panes[method].classList.remove('hidden');}
}
function copyPixCode(){const input=document.getElementById('pix-input');if(!input)return;input.select();input.setSelectionRange(0,99999);navigator.clipboard?.writeText(input.value);const btn=document.getElementById('btn-copy-pix');if(!btn)return;const original=btn.innerHTML;btn.innerHTML='<span class="material-symbols-outlined text-[16px]">check</span><span>Copiado!</span>';btn.classList.add('bg-secondary');setTimeout(()=>{btn.innerHTML=original;btn.classList.remove('bg-secondary');},2000);}
function initCheckout(){updateCartBadge();document.querySelector('[data-action="confirm-order"]')?.addEventListener('click',()=>{const cart=getCart();if(!cart.length){toast('Seu carrinho está vazio.');return;}setJSON(STORAGE.order,{items:cart,total:cartSubtotal(cart),createdAt:new Date().toISOString()});toast('Pedido confirmado!');});}

function setupNavigation(){
  document.querySelectorAll('a[data-path]').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href');if(href&&href!=='#'){return;}e.preventDefault();}));
}

document.addEventListener('DOMContentLoaded',()=>{
  updateCartBadge(); setupNavigation();
  if(document.querySelector('.add-to-cart-btn'))initCatalog();
  if(document.querySelector('[data-cart-item]'))initCart();
  if(document.getElementById('container-login'))initAuth();
  if(document.getElementById('tab-pix'))initCheckout();
});
