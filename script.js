const collage = document.getElementById('collage');

// Create actual image element for a placeholder
function renderImage(item, entry) {
  if (item.querySelector('picture')) return; // already rendered

  const picture = document.createElement('picture');
  const medium = entry.medium || entry.full;
  const webp = medium.replace(/\.[a-zA-Z0-9]+$/, '.webp');
  
  const source = document.createElement('source');
  source.type = 'image/webp';
  source.srcset = webp;

  const img = document.createElement('img');
  img.src = medium;
  img.loading = 'lazy';
  img.alt = '';
  img.decoding = 'async';
  img.dataset.full = entry.full;

  img.addEventListener('click', ()=>{
    openViewer(img.dataset.full || img.src);
  });

  picture.appendChild(source);
  picture.appendChild(img);
  item.appendChild(picture);
}

async function loadImages(){
  // avoid cached responses when developing — add cache-busting and no-store
  const resp = await fetch('images.json?v=' + Date.now(), { cache: 'no-store' });
  const images = await resp.json();

  // support both legacy array-of-strings and object entries { medium, full }
  const normalized = images.map(it => {
    if (typeof it === 'string') return { medium: it, full: it };
    return { medium: it.medium || it.thumb || it.full, full: it.full || it.medium || it };
  });

  // sort descending by filename (numeric-aware)
  normalized.sort((a, b) => b.full.localeCompare(a.full, undefined, { numeric: true, sensitivity: 'base' }));

  // Create placeholder items (fast)
  const placeholders = normalized.map((entry, idx) => {
    const item = document.createElement('div');
    item.className = 'item';
    
    // random size
    const r = Math.random();
    if(r>0.92) item.classList.add('size-tall');
    else if(r>0.78) item.classList.add('size-large');
    else if(r>0.45) item.classList.add('size-medium');
    else item.classList.add('size-small');

    collage.appendChild(item);
    return { item, entry };
  });

  // Lazy-render images as they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const placeholder = placeholders.find(p => p.item === entry.target);
        if (placeholder) {
          renderImage(placeholder.item, placeholder.entry);
          observer.unobserve(entry.target);
        }
      }
    });
  }, { rootMargin: '100px' }); // Start loading 100px before image enters viewport

  placeholders.forEach(p => observer.observe(p.item));
}

// simple viewer
let viewer;
function openViewer(src){
  if(!viewer){
    viewer = document.createElement('div');
    viewer.className = 'viewer';
    viewer.tabIndex = -1;
    const vimg = document.createElement('img');
    viewer.appendChild(vimg);
    viewer.addEventListener('click', ()=> viewer.classList.remove('show'));
    document.body.appendChild(viewer);
  }
  const vimg = viewer.querySelector('img');
  vimg.src = src;
  viewer.classList.add('show');
}

loadImages().catch(err=>{
  console.error('Failed to load images',err);
  collage.innerText = 'Failed to load images.json. Run a local server and ensure images.json exists.';
});
