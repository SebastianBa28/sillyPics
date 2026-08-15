const collage = document.getElementById('collage');

async function loadImages(){
  // avoid cached responses when developing — add cache-busting and no-store
  const resp = await fetch('images.json?v=' + Date.now(), { cache: 'no-store' });
  const images = await resp.json();
  // sort descending by filename (numeric-aware, case-insensitive)
  images.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));

  for(const src of images){
    const item = document.createElement('div');
    item.className = 'item';
    // random size
    const r = Math.random();
    if(r>0.92) item.classList.add('size-tall');
    else if(r>0.78) item.classList.add('size-large');
    else if(r>0.45) item.classList.add('size-medium');
    else item.classList.add('size-small');

    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.alt = '';
    img.decoding = 'async';

    // open in full viewer on click
    img.addEventListener('click', ()=>{
      openViewer(src);
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
