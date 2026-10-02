/**
 * Indian phone input with a permanent +91 prefix.
 *
 * The prefix is visual and cannot be deleted. The value passed to the parent is
 * either an empty string or a complete-looking "+91 9876543210" value, so an
 * untouched field never creates a broken call/WhatsApp link.
 */

export const INDIA_CODE = "+91";

/** Return the 10 local digits from a stored Indian phone value. */
export function localPhoneDigits(value = "") {
  let digits = String(value).replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(-10);
  return digits.slice(0, 10);
}

/** Full stored value, or empty while no local digits have been entered. */
export function toIndianPhone(localDigits = "") {
  const digits = localPhoneDigits(localDigits);
  return digits ? `${INDIA_CODE} ${digits}` : "";
}

export function isCompleteIndianPhone(value = "") {
  return localPhoneDigits(value).length === 10;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "98765 43210",
  className = "",
  inputClassName = "",
  style,
  required = false,
  ariaLabel = "Phone number",
  disabled = false,
}) {
  const local = localPhoneDigits(value);

  return (
    <div
      className={`flex w-full items-center overflow-hidden rounded-xl border bg-white transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 ${className}`}
      style={style}
    >
      <span className="flex h-full shrink-0 items-center border-r border-black/10 bg-black/[0.035] px-3 py-3 text-sm font-semibold text-[#55555E]">
        {INDIA_CODE}
      </span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={local}
        onChange={(e) => onChange?.(toIndianPhone(e.target.value))}
        placeholder={placeholder}
        maxLength={16}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-black/25 ${inputClassName}`}
      />
    </div>
  );
}