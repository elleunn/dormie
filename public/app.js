// Client-side: attach upload to DB on submit, refresh parent list and notify iframe
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  const listStatus = document.getElementById('listStatus');
  const tableBody = document.getElementById('bookingsTableBody'); // may be null if page uses a different template
  const listContainer = document.getElementById('bookingsListContainer'); // fallback render target
  const iframe = document.getElementById('dashboardFrame');

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.textContent = 'Uploading...';

    const formData = new FormData(form);
    const payload = {};
    for (const [k, v] of formData.entries()) {
      // send null for empty values so DB gets NULLs instead of empty strings
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

      // success: refresh bookings list in parent UI
      await fetchAndRenderBookings();

      // reset UI and notify iframe to refresh as well
      status.textContent = 'Uploaded ✓';
      form.reset();

      try {
        iframe.contentWindow.postMessage({ type: 'refresh_bookings' }, window.location.origin);
      } catch (e) { /* ignore cross-origin errors */ }

    } catch (err) {
      status.textContent = 'Network error';
      console.error(err);
    }

    setTimeout(() => (status.textContent = ''), 2500);
  });

  async function fetchAndRenderBookings() {
    listStatus.textContent = 'Loading...';
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) {
        listStatus.textContent = 'Failed to load bookings';
        return;
      }
      const data = await res.json();
      const bookings = data.bookings || [];

      // If table body exists, render into table. Otherwise fall back to a simple list in the container.
      if (tableBody) {
        tableBody.innerHTML = '';
        if (bookings.length === 0) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td colspan="13">No bookings yet</td>`;
          tableBody.appendChild(tr);
        } else {
          for (const b of bookings) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${escapeHtml(b.id)}</td>
              <td>${escapeHtml(b.date_accept)}</td>
              <td>${escapeHtml(b.status)}</td>
              <td>${escapeHtml(b.transaction_id)}</td>
              <td>${escapeHtml(b.arrived_date)} ${escapeHtml(b.arrived_time || '')}</td>
              <td>${escapeHtml(b.departure_date)} ${escapeHtml(b.departure_time || '')}</td>
              <td>${escapeHtml(b.rd_id)}</td>
              <td>${escapeHtml(b.floor_no)}</td>
              <td>${escapeHtml(b.rooms_name)}</td>
              <td>${escapeHtml(b.type)}</td>
              <td>${escapeHtml(b.bed_no)}</td>
              <td>${escapeHtml(b.remarks)}</td>
              <td>${escapeHtml(b.created_at)}</td>
            `;
            tableBody.appendChild(tr);
          }
        }
      } else if (listContainer) {
        // fallback: render a simple list (useful if your HTML doesn't include the table)
        listContainer.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'fallback-list';
        if (bookings.length === 0) {
          wrapper.innerHTML = '<div>No bookings yet</div>';
        } else {
          const ul = document.createElement('ul');
          for (const b of bookings) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>#${escapeHtml(b.id)}</strong> — ${escapeHtml(b.rooms_name) || '—'} (${escapeHtml(b.type) || '—'}) — Accepted: ${escapeHtml(b.date_accept)} — Created: ${escapeHtml(b.created_at)}`;
            ul.appendChild(li);
          }
          wrapper.appendChild(ul);
        }
        listContainer.appendChild(wrapper);
      } else {
        // Neither tableBody nor fallback container exists — log and show status
        console.warn('No bookingsTableBody or bookingsListContainer found in DOM; cannot render bookings.');
        listStatus.textContent = 'Loaded (no render target)';
        return;
      }

      listStatus.textContent = '';
    } catch (err) {
      listStatus.textContent = 'Network error';
      console.error(err);
    }
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // initial load
  fetchAndRenderBookings();
});