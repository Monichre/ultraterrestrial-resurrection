export function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-16%20at%205.27.45%E2%80%AFAM-9rutrF6EysiJq9OKZ2l22jJFe8wI7m.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.15,
        mixBlendMode: "screen",
      }}
    />
  )
}

