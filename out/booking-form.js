// Client-side JS to submit booking and notify iframe to refresh
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  const iframe = document.getElementById('dashboardFrame');

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.textContent = 'Uploading...';

    const formData = new FormData(form);
    const payload = {};
    for (const [k, v] of formData.entries()) {
      payload[k] = v === '' ? null : v;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        status.textContent = 'Error: ' + (err.error || res.statusText);
        return;
      }
      const body = await res.json();
      status.textContent = 'Uploaded ✓';
      form.reset();

      // Ask iframe to refresh bookings (postMessage)
      try {
        iframe.contentWindow.postMessage({ type: 'refresh_bookings' }, window.location.origin);
      } catch (e) { /* ignore cross-origin errors */ }
    } catch (err) {
      status.textContent = 'Network error';
    }

    setTimeout(() => (status.textContent = ''), 3000);
  });
});