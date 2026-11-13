/* Join form.
   With CONFIG["FORM_ENDPOINT"] set in build.py, answers are posted to a Google
   Apps Script web app that files them in a Google Sheet. Without it — or if the
   request fails — the visitor gets her answers formatted to copy and email. */
(function () {
  var form = document.getElementById('joinform');
  if (!form) { return; }

  var statusEl = document.getElementById('f-status');
  var submitEl = document.getElementById('f-submit');
  var fallback = document.getElementById('fallback');
  var fallbackWhy = document.getElementById('fallback-why');
  var draftEl = document.getElementById('draft');
  var endpoint = (form.getAttribute('data-endpoint') || '').trim();

  function read() {
    var fd = new FormData(form);
    return {
      name: (fd.get('name') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      institution: (fd.get('institution') || '').toString().trim(),
      country: (fd.get('country') || '').toString().trim(),
      field: (fd.get('field') || '').toString(),
      stage: (fd.get('stage') || '').toString(),
      platforms: fd.getAll('platform'),
      message: (fd.get('message') || '').toString().trim()
    };
  }

  function asText(d) {
    return [
      'I would like to join.', '',
      'Name: ' + (d.name || '—'),
      'Email: ' + (d.email || '—'),
      'Institution: ' + (d.institution || '—'),
      'Country: ' + (d.country || '—'),
      'Teaches: ' + (d.field || '—'),
      'Career stage: ' + (d.stage || '—'),
      'Would like next: ' + (d.platforms.length ? d.platforms.join(', ') : '—'),
      '', 'Notes: ' + (d.message || '—')
    ].join('\n');
  }

  function showFallback(d, why) {
    if (why && fallbackWhy) { fallbackWhy.textContent = why; }
    draftEl.textContent = asText(d);
    fallback.hidden = false;
    fallback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = read();

    if (!d.name || !d.email || d.email.indexOf('@') < 0) {
      statusEl.textContent = 'A name and a valid email, please.';
      return;
    }

    if (!endpoint) {
      statusEl.textContent = '';
      showFallback(d);
      return;
    }

    submitEl.disabled = true;
    statusEl.textContent = 'Sending…';

    // text/plain keeps this a simple request, so the browser sends no preflight —
    // Apps Script reads the body from e.postData.contents either way.
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(d)
    }).then(function (r) {
      return r.json().catch(function () { return { ok: r.ok }; });
    }).then(function (res) {
      submitEl.disabled = false;
      if (res && res.ok) {
        statusEl.textContent = "You're in — we'll email you the invitation.";
        form.reset();
      } else {
        statusEl.textContent = '';
        showFallback(d, 'We could not save your details just now. Copy them below and email them to us instead — it reaches the same place.');
      }
    }).catch(function () {
      submitEl.disabled = false;
      statusEl.textContent = '';
      showFallback(d, 'We could not save your details just now. Copy them below and email them to us instead — it reaches the same place.');
    });
  });

  var copyBtn = document.getElementById('copy-draft');
  var copyStatus = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var ok = function () { copyStatus.textContent = 'Copied.'; };
      var no = function () {
        copyStatus.textContent = 'Select the text above and copy it.';
        var rg = document.createRange(); rg.selectNodeContents(draftEl);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(rg);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(draftEl.textContent).then(ok).catch(no);
        } else { no(); }
      } catch (err) { no(); }
    });
  }
})();
