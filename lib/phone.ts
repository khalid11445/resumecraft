// A number written without a country code (for example 0600000000) is read
// as a Moroccan number. Change this if your customers work in another country.
// The candidate profile has its own copy of this logic: keep both in sync.
export const DEFAULT_COUNTRY = "212";

// A WhatsApp chat link, optionally with a message already typed in.
// The site sends nothing: the link opens the chat on the user's own phone or computer.
export function whatsappLink(phone: string | null, text?: string): string | null {
  if (!phone) return null;
  const raw = phone.trim();
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (!raw.startsWith("+")) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = DEFAULT_COUNTRY + digits.slice(1);
  }
  if (digits.length < 8 || digits.length > 15) return null;

  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}