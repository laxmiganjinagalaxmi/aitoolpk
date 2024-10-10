import Image from "next/image";

export const Loader = () => {
  return (
    <div
      className="loader-container" 
      role="status"
      aria-live="polite"
    >
      <div className="loader-icon">
        <Image
          alt="Loading logo"
          fill
          sizes="(max-width: 768px) 100vw"
          src="/logo.png"
          className="image-style"
        />
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
};
