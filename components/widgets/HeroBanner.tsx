"use client";

interface HeroBannerProps {
  userName: string;
}

export default function HeroBanner({ userName }: HeroBannerProps) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="relative min-h-[160px] rounded-2xl overflow-hidden flex items-end p-6 md:p-8"
      style={{
        background:
          "linear-gradient(135deg, #2D2D2D 0%, #3E3529 30%, #4A3F2F 50%, #3B3326 70%, #2D2D2D 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 61px), repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.15) 20px, rgba(255,255,255,0.15) 21px)",
        }}
      />

      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, rgba(139,154,107,0.6) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full">
        <p className="text-white/50 text-sm tracking-wide mb-1">
          {formattedDate}
        </p>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
          Welcome back, {userName}
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Continue where you left off
        </p>
      </div>
    </div>
  );
}
