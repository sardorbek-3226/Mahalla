// Uzbek phone number helpers. The "+998" country code is shown as a fixed
// label next to the field — the input itself only ever holds the 9 local
// digits, grouped for readability as the user types (e.g. "90 123 45 67").

// "901234567" / "+998901234567" (pasted) → "90 123 45 67"
export const formatLocalPhone = (value = '') => {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length > 9) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  let out = '';
  if (digits.length > 0) out += digits.slice(0, 2);
  if (digits.length > 2) out += ' ' + digits.slice(2, 5);
  if (digits.length > 5) out += ' ' + digits.slice(5, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);
  return out;
};

// "90 123 45 67" → "+998901234567" (what the API expects)
export const toApiPhone = (localValue = '') => {
  const digits = localValue.replace(/\D/g, '').slice(0, 9);
  return digits ? '+998' + digits : '';
};

export const isValidLocalPhone = (value = '') => /^\d{9}$/.test(value.replace(/\D/g, ''));
