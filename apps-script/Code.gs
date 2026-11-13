/**
 * Receives sign-ups from the website and appends them to this spreadsheet.
 *
 * Setup (about five minutes):
 *   1. Go to https://sheets.new and name the sheet e.g. "Sign-ups".
 *   2. Extensions -> Apps Script. Delete whatever is in Code.gs and paste this file.
 *   3. Set NOTIFY_EMAIL below if you want an email for each sign-up.
 *   4. Deploy -> New deployment -> gear icon -> Web app.
 *        Execute as:        Me
 *        Who has access:    Anyone                  <-- must be "Anyone", not "Anyone with Google account"
 *      Deploy, authorise when asked (click Advanced -> Go to ... (unsafe) on the warning screen -
 *      that warning appears for every personal script; it is your own code).
 *   5. Copy the Web app URL. It ends in /exec. Paste it into FORM_ENDPOINT in build.py.
 *
 * After any change to this script you must Deploy -> Manage deployments -> edit -> New version,
 * otherwise the old version keeps running.
 */

var SHEET_NAME = 'Sign-ups';
var NOTIFY_EMAIL = '';   // e.g. 'maja.ivkovic@ymail.com' — leave empty for no email

var HEADERS = ['Received', 'Name', 'Email', 'Institution', 'Country',
               'Teaches', 'Career stage', 'Would like next', 'Message'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }
  try {
    var data = JSON.parse(e.postData.contents);

    if (!data.name || !data.email || data.email.indexOf('@') < 0) {
      return json({ ok: false, error: 'missing name or email' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date(),
      String(data.name || ''),
      String(data.email || ''),
      String(data.institution || ''),
      String(data.country || ''),
      String(data.field || ''),
      String(data.stage || ''),
      (data.platforms || []).join(', '),
      String(data.message || '')
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New sign-up: ' + data.name,
        body: [
          data.name + ' <' + data.email + '>',
          'Institution: ' + (data.institution || '-'),
          'Country: ' + (data.country || '-'),
          'Teaches: ' + (data.field || '-'),
          'Career stage: ' + (data.stage || '-'),
          'Would like next: ' + ((data.platforms || []).join(', ') || '-'),
          '',
          data.message || ''
        ].join('\n')
      });
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, message: 'Sign-up endpoint is live.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
