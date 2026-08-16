const collage = document.getElementById('collage');

async function loadImages(){
  // avoid cached responses when developing — add cache-busting and no-store
  const resp = await fetch('images.json?v=' + Date.now(), { cache: 'no-store' });
  const images = await resp.json();

  // support both legacy array-of-strings and object entries; use full images directly
  const normalized = images.map(it => {
    if (typeof it === 'string') return { full: it };
    return { full: it.full || it.thumb || it };
  });

  // sort descending by filename (numeric-aware)
  normalized.sort((a, b) => b.full.localeCompare(a.full, undefined, { numeric: true, sensitivity: 'base' }));

  for(const entry of normalized){
    const item = document.createElement('div');
    item.className = 'item';
    // random size
    const r = Math.random();
    if(r>0.92) item.classList.add('size-tall');
    else if(r>0.78) item.classList.add('size-large');
    else if(r>0.45) item.classList.add('size-medium');
    else item.classList.add('size-small');

    const img = document.createElement('img');
    img.src = entry.full; // use full image for grid (thumbnails removed)
    img.loading = 'lazy';
    img.alt = '';
    img.decoding = 'async';
    img.dataset.full = entry.full; // full-size path for the viewer

    // open in full viewer on click
    img.addEventListener('click', ()=>{
      openViewer(img.dataset.full || img.src);
    });

    item.appendChild(img);
    collage.appendChild(item);
  }
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
