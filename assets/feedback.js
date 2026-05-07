/* ============================================================
   FEEDBACK SUBMISSION HANDLER · Web3Forms integration
   No frameworks. Vanilla JS. Loaded from /assets/feedback.js.
   ============================================================ */
(function() {
  'use strict';

  var ACCESS_KEY = '877d39cf-c99e-42f8-8410-49e28a1357fd';
  var ENDPOINT = 'https://api.web3forms.com/submit';

  // Read the week date from a meta tag on the page (e.g. "Week of 4 May 2026")
  function getWeekTag() {
    var m = document.querySelector('meta[name="week-tag"]');
    return m ? m.content : 'Unknown week';
  }

  // Read the "from" picker (Matt / Harry / Both)
  function getFrom() {
    var sel = document.getElementById('from-picker');
    return sel ? sel.value : 'Unspecified';
  }

  // Send a submission to Web3Forms.
  // Returns a Promise that resolves on success, rejects on failure.
  function submitFeedback(payload) {
    var body = {
      access_key: ACCESS_KEY,
      subject: payload.subject,
      from_name: 'Meat Merchant Feedback',
      message: payload.message,
      week: getWeekTag(),
      section: payload.section,
      type: payload.type,
      submitted_by: getFrom()
    };

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function(data) {
      if (!data.success) throw new Error(data.message || 'Submission failed');
      return data;
    });
  }

  // -- Per-section feedback rows --
  // Each .feedback-row has data-section="..." identifying what it's about.
  // It contains: .fb-btn.approve, .fb-btn.note, .fb-note-form (hidden),
  // .fb-confirm.success, .fb-confirm.error
  function wireFeedbackRow(row) {
    var section = row.getAttribute('data-section') || 'Unknown section';
    var approveBtn = row.querySelector('.fb-btn.approve');
    var noteBtn = row.querySelector('.fb-btn.note');
    var noteForm = row.querySelector('.fb-note-form');
    var textarea = noteForm ? noteForm.querySelector('textarea') : null;
    var sendBtn = noteForm ? noteForm.querySelector('.fb-send') : null;
    var cancelBtn = noteForm ? noteForm.querySelector('.fb-cancel') : null;
    var successConfirm = row.querySelector('.fb-confirm.success');
    var errorConfirm = row.querySelector('.fb-confirm.error');

    function showError(msg) {
      if (!errorConfirm) return;
      errorConfirm.querySelector('.fb-error-text').textContent =
        msg || 'Something went wrong. Try again?';
      errorConfirm.classList.add('show');
      successConfirm && successConfirm.classList.remove('show');
    }

    function showSuccess(text) {
      if (!successConfirm) return;
      successConfirm.querySelector('.fb-success-text').textContent = text;
      successConfirm.classList.add('show');
      errorConfirm && errorConfirm.classList.remove('show');
      row.classList.add('done');
    }

    // Approve = one tap, no typing
    if (approveBtn) {
      approveBtn.addEventListener('click', function() {
        approveBtn.disabled = true;
        approveBtn.textContent = 'Sending…';

        submitFeedback({
          subject: 'APPROVED · ' + section + ' · ' + getWeekTag(),
          message: getFrom() + ' approved ' + section + '.',
          section: section,
          type: 'approve'
        }).then(function() {
          showSuccess('Approved by ' + getFrom() + ' ✓');
        }).catch(function(err) {
          approveBtn.disabled = false;
          approveBtn.textContent = '✓ Approve';
          showError('Couldn\'t send. Check connection?');
        });
      });
    }

    // Add note = expand inline
    if (noteBtn && noteForm) {
      noteBtn.addEventListener('click', function() {
        noteForm.classList.add('open');
        if (textarea) textarea.focus();
      });
    }

    // Cancel note = collapse inline
    if (cancelBtn && noteForm) {
      cancelBtn.addEventListener('click', function() {
        noteForm.classList.remove('open');
        if (textarea) textarea.value = '';
        errorConfirm && errorConfirm.classList.remove('show');
      });
    }

    // Send note = submit
    if (sendBtn && textarea) {
      sendBtn.addEventListener('click', function() {
        var msg = textarea.value.trim();
        if (!msg) {
          textarea.focus();
          return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending…';

        submitFeedback({
          subject: 'CHANGES · ' + section + ' · ' + getWeekTag(),
          message: 'From: ' + getFrom() + '\nSection: ' + section + '\n\n' + msg,
          section: section,
          type: 'changes'
        }).then(function() {
          showSuccess('Sent to Mel ✓');
        }).catch(function(err) {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send to Mel';
          showError('Couldn\'t send. Try again?');
        });
      });
    }

    // Retry button on error
    if (errorConfirm) {
      var retryBtn = errorConfirm.querySelector('.fb-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', function() {
          errorConfirm.classList.remove('show');
          if (approveBtn) {
            approveBtn.disabled = false;
            approveBtn.textContent = '✓ Approve';
          }
          if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send to Mel';
          }
        });
      }
    }
  }

  // -- Top approval bar --
  function wireApprovalBar() {
    var bar = document.querySelector('.approval-bar');
    if (!bar) return;

    var approveBtn = bar.querySelector('.bar-btn:not(.secondary)');
    var changesBtn = bar.querySelector('.bar-btn.secondary');
    var confirm = bar.querySelector('.bar-confirm');

    if (approveBtn) {
      approveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        approveBtn.disabled = true;
        approveBtn.textContent = 'Sending…';

        submitFeedback({
          subject: 'APPROVED · WHOLE WEEK · ' + getWeekTag(),
          message: getFrom() + ' approved the full week.',
          section: 'Whole week',
          type: 'approve'
        }).then(function() {
          if (confirm) confirm.textContent = 'Whole week approved by ' + getFrom() + ' ✓';
          bar.classList.add('done');
        }).catch(function(err) {
          approveBtn.disabled = false;
          approveBtn.textContent = 'Approve full week';
          alert('Couldn\'t send — check your connection and try again.');
        });
      });
    }

    if (changesBtn) {
      changesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Smooth-scroll to the first feedback row that matches whole-week feedback,
        // or just the first feedback row in the page.
        var firstFb = document.querySelector('.feedback-row');
        if (firstFb) {
          firstFb.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var noteBtn = firstFb.querySelector('.fb-btn.note');
          if (noteBtn) setTimeout(function() { noteBtn.click(); }, 300);
        }
      });
    }
  }

  // -- Initialise on DOM ready --
  function init() {
    document.querySelectorAll('.feedback-row').forEach(wireFeedbackRow);
    wireApprovalBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
