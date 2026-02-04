export function SaltShaker() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      width="100%"
      height="100%"
    >
      {/* Cap */}
      <rect x="18" y="6" width="28" height="10" rx="3" />
      {/* Holes in cap */}
      <circle cx="27" cy="11" r="1.5" fill="var(--base-color-50, #fff)" />
      <circle cx="33" cy="11" r="1.5" fill="var(--base-color-50, #fff)" />
      <circle cx="39" cy="11" r="1.5" fill="var(--base-color-50, #fff)" />
      {/* Neck */}
      <rect x="22" y="16" width="20" height="4" />
      {/* Body */}
      <path d="M20 20 L16 54 C16 57 19 60 24 60 L40 60 C45 60 48 57 48 54 L44 20 Z" />
      {/* Salt grains falling */}
      <circle cx="26" cy="2" r="1" opacity="0.6" />
      <circle cx="32" cy="0" r="1" opacity="0.4" />
      <circle cx="38" cy="3" r="1" opacity="0.5" />
    </svg>
  );
}
