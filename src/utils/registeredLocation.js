// The real backend doesn't reliably persist mahalla/address/lat/lng entered at
// registration (confirmed: fields sent correctly, but /auth/me returns them as
// null afterward). Until that's fixed server-side, remember what the user
// picked locally, keyed by phone, so pages like Workers can default to it.
const STORAGE_KEY = 'registered_location_v1';

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveRegisteredLocation = (phone, { viloyat, tuman, mahallaText, mahallaId }) => {
  if (!phone) return;
  try {
    const all = readAll();
    all[phone] = { viloyat, tuman, mahallaText, mahallaId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore quota / private-mode errors */
  }
};

export const getRegisteredLocation = (phone) => {
  if (!phone) return null;
  return readAll()[phone] || null;
};
