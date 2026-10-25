/* Offline join form: formats the answers so a visitor can copy and email them.
   Replace with a Tally / Framaforms embed when one is set up. */
(function () {
  var form = document.getElementById('joinform');
  if (!form) { return; }
  var statusEl = document.getElementById('f-status');
  var fallback = document.getElementById('fallback');
  var draftEl = document.getElementById('draft');

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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = read();
    if (!d.name || !d.email || d.email.indexOf('@') < 0) {
      statusEl.textContent = 'A name and a valid email, please.';
      return;
    }
    draftEl.textContent = [
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
    statusEl.textContent = '';
    fallback.hidden = false;
    fallback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  var copyBtn = document.getElementById('copy-draft');
  var copyStatus = document.getElementById('copy-status');
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
})();
