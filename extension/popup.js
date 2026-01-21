// Quick Notes - Auto-save notepad

document.addEventListener('DOMContentLoaded', () => {
  // Clear badge when popup opens
  chrome.runtime.sendMessage({ action: 'clearBadge' }).catch(() => {});

  const textarea = document.getElementById('notes');
  const charCount = document.getElementById('charCount');
  const status = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const addDate = document.getElementById('addDate');
  const addTime = document.getElementById('addTime');
  const addDivider = document.getElementById('addDivider');

  // Verify all elements exist
  if (!textarea || !charCount || !status || !statusText || !copyBtn || !clearBtn || !addDate || !addTime || !addDivider) {
    console.error('Quick Notes: Missing required DOM elements');
    return;
  }

  let saveTimeout = null;
  let isSaving = false;

  // Load saved notes
  chrome.storage.local.get(['notes'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Quick Notes: Failed to load notes:', chrome.runtime.lastError);
      statusText.textContent = 'Load error';
      return;
    }
    if (result.notes) {
      textarea.value = result.notes;
      updateCharCount();
    }
    textarea.focus();
  });

  // Save notes to storage
  function saveNotes(callback) {
    isSaving = true;
    chrome.storage.local.set({ notes: textarea.value }, () => {
      isSaving = false;
      if (chrome.runtime.lastError) {
        console.error('Quick Notes: Failed to save notes:', chrome.runtime.lastError);
        statusText.textContent = 'Save error';
        status.classList.remove('saved');
      } else {
        statusText.textContent = 'Saved';
        status.classList.add('saved');
      }
      if (callback) callback();
    });
  }

  // Auto-save on input
  textarea.addEventListener('input', () => {
    updateCharCount();

    // Debounce save
    if (saveTimeout) clearTimeout(saveTimeout);

    statusText.textContent = 'Saving...';
    status.classList.remove('saved');

    saveTimeout = setTimeout(() => {
      saveNotes();
    }, 300);
  });

  // Update character count
  function updateCharCount() {
    charCount.textContent = textarea.value.length;
  }

  // Copy to clipboard
  copyBtn.addEventListener('click', async () => {
    const textToCopy = textarea.value.trim();
    if (!textToCopy) {
      // Visual feedback for empty content
      copyBtn.textContent = 'Empty';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1000);
      return;
    }

    try {
      await navigator.clipboard.writeText(textarea.value);
      showCopySuccess();
    } catch (err) {
      // Fallback for older browsers or permission issues
      try {
        const selection = window.getSelection();
        const range = document.createRange();

        // Create a temporary element to copy from (preserves user's cursor position)
        const tempEl = document.createElement('textarea');
        tempEl.value = textarea.value;
        tempEl.style.position = 'fixed';
        tempEl.style.left = '-9999px';
        document.body.appendChild(tempEl);
        tempEl.select();
        document.execCommand('copy');
        document.body.removeChild(tempEl);

        // Restore focus to original textarea
        textarea.focus();
        showCopySuccess();
      } catch (fallbackErr) {
        console.error('Quick Notes: Copy failed:', fallbackErr);
        copyBtn.textContent = 'Failed';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 1500);
      }
    }
  });

  function showCopySuccess() {
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
    }, 1500);
  }

  // Clear notes
  clearBtn.addEventListener('click', () => {
    // If already empty, just show feedback
    if (!textarea.value) {
      statusText.textContent = 'Already empty';
      textarea.focus();
      return;
    }

    if (!confirm('Clear all notes?')) return;

    textarea.value = '';
    updateCharCount();
    chrome.storage.local.set({ notes: '' }, () => {
      if (chrome.runtime.lastError) {
        console.error('Quick Notes: Failed to clear notes:', chrome.runtime.lastError);
        statusText.textContent = 'Clear error';
      } else {
        statusText.textContent = 'Cleared';
        status.classList.add('saved');
      }
    });
    textarea.focus();
  });

  // Insert date
  addDate.addEventListener('click', () => {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    insertText(`[${date}]\n`);
  });

  // Insert time
  addTime.addEventListener('click', () => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    insertText(`[${time}] `);
  });

  // Insert divider
  addDivider.addEventListener('click', () => {
    insertText('\n-------------------\n');
  });

  // Helper to insert text at cursor
  function insertText(text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    textarea.value = before + text + after;
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();

    // Trigger save
    textarea.dispatchEvent(new Event('input'));
  }

  // Keyboard shortcuts
  textarea.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to force save immediately
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // Clear any pending debounced save
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
      }
      // Force immediate save
      statusText.textContent = 'Saving...';
      status.classList.remove('saved');
      saveNotes();
    }
  });
});
