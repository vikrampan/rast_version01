export const LoadingSpinner = () => (
    <div className="flex min-h-screen items-center justify-center bg-[#181818]" role="status">
      <div className="relative w-32 h-32" aria-label="Loading">
        <div className="absolute inset-0 rounded-full border-4 border-[#282828]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-[#FFC857] animate-spin"></div>
      </div>
    </div>
  );