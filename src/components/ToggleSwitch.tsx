export const ToggleSwitch = ({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full  transition-transform ${
        enabled ? "bg-white translate-x-4" : "bg-gray-500 translate-x-0"
      }`}
    />
  </button>
);
