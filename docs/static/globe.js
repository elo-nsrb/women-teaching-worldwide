/* Rotating dot globe. Pure canvas, no libraries. */
(function () {
  var cv = document.getElementById('globe');
  if (!cv || !cv.getContext) { return; }
  var ctx = cv.getContext('2d');
  var N = 560, pts = [], i, y, r, th;
  for (i = 0; i < N; i++) {
    y = 1 - (i / (N - 1)) * 2;
    r = Math.sqrt(Math.max(0, 1 - y * y));
    th = Math.PI * (3 - Math.sqrt(5)) * i;
    pts.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r, hi: (i % 47 === 3) });
  }
  var rot = 0.4;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw() {
    var size = cv.clientWidth || 300;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(size * dpr)) {
      cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    var cs = Math.cos(rot), sn = Math.sin(rot);
    var cx = size / 2, cy = size / 2, R = size * 0.43;
    var style = getComputedStyle(document.documentElement);
    var base = (style.getPropertyValue('--globe-dot') || '#0E6A5B').trim();
    var hot = (style.getPropertyValue('--coral') || '#E25B38').trim();
    var list = [], p, x, z;
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      x = p.x * cs - p.z * sn; z = p.x * sn + p.z * cs;
      list.push({ sx: cx + x * R, sy: cy - p.y * R, t: (z + 1) / 2, hi: p.hi });
    }
    list.sort(function (a, b) { return a.t - b.t; });
    for (i = 0; i < list.length; i++) {
      p = list[i];
      ctx.globalAlpha = p.hi ? (0.30 + p.t * 0.70) : (0.10 + p.t * 0.55);
      ctx.fillStyle = p.hi ? hot : base;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, (p.hi ? 3.1 : 1.7) * (0.55 + p.t * 0.75), 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  draw();
  if (!reduce) { (function loop() { rot += 0.0017; draw(); requestAnimationFrame(loop); })(); }
  window.addEventListener('resize', draw);
})();
