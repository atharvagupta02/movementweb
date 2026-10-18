
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-xl border border-[#DCE6E4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B4BAA] shadow-sm transition-all duration-200 hover:border-[#00C2CB] hover:bg-[#E8F0FB] active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
        <path d="M20 12H9" />
      </svg>

      Back
    </button>
  );
};

export default BackButton;
