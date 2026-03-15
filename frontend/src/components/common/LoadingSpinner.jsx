const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div
        data-testid="loading-spinner"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
        }}
      >
        <div className="myfin-spinner" />
      </div>
    );
  }

  return (
    <div data-testid="loading-spinner" className="d-flex justify-content-center p-4">
      <div className="myfin-spinner" />
    </div>
  );
};

export default LoadingSpinner;