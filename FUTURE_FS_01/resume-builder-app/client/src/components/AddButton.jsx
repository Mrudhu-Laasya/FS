import "../index.css";

export default function AddButton({ children = "Add", onClick }) {
  return (
    <button type="button" className="add-button" onClick={onClick}>
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white add-button-icon"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 12h14m-7 7V5"
        />
      </svg>

      {children}
    </button>
  );
}
