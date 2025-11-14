// JS for the dashboard iframe (dashboard.html)
async function fetchEntries() {
  const list = document.getElementById('entries');
  const status = document.getElementById('entriesStatus');
  status.textContent = 'Loading...';
  try {
    const res = await fetch('/api/entries');
    if (!res.ok) {
      status.textContent = 'Failed to load';
      return;
    }
    const body = await res.json();
    list.innerHTML = '';
    if (!body.entries || body.entries.length === 0) {
      list.innerHTML = '<li>No entries yet</li>';
    } else {
      body.entries.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.created_at} — ${e.title}` + (e.value !== null ? ` — ${e.value}` : '');
        list.appendChild(li);
      });
    }
    status.textContent = '';
  } catch (err) {
    status.textContent = 'Network error';
  }
}

// Listen for messages from parent (to refresh)
window.addEventListener('message', (ev) => {
  // Basic same-origin check
  try {
    if (ev.origin !== window.location.origin) return;
  } catch (e) { /* ignore */ }

  if (ev.data && ev.data.type === 'refresh_entries') {
    fetchEntries();
  }
});

// Initial fetch
fetchEntries();