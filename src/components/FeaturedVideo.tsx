import { useState } from "react";
import { Play } from "lucide-react";

// Click-to-play portrait video player. Shows a poster + play button until
// clicked, so visitors never download the clip unless they choose to watch.
export default function FeaturedVideo({
  src,
  poster,
  label = "Watch the project",
}: {
  src: string;
  poster: string;
  label?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[340px] aspect-[640/1138] overflow-hidden bg-steel-dark shadow-2xl ring-1 ring-white/10">
      {playing ? (
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={label}
          className="group absolute inset-0 h-full w-full"
        >
          <img src={poster} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-steel-dark/30 group-hover:bg-steel-dark/15 transition-colors" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg group-hover:scale-110 transition-transform">
              <Play size={26} fill="currentColor" className="ml-1" />
            </span>
            <span className="text-white font-semibold uppercase tracking-wide text-sm drop-shadow">{label}</span>
          </span>
        </button>
      )}
    </div>
  );
}
