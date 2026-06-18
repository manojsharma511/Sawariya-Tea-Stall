/**
 * Custom loader component displaying an animated tea cup with rising steam.
 */
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      {/* Tea Cup Steam Animation */}
      <div className="relative w-16 h-20 flex flex-col items-center justify-end">
        {/* Steam Lines */}
        <div className="absolute top-2 left-[30%] w-0.5 h-6 bg-saffron/40 rounded-full animate-steam" />
        <div className="absolute top-0 left-[50%] w-0.5 h-7 bg-saffron/50 rounded-full animate-steam-delay" />
        <div className="absolute top-3 left-[70%] w-0.5 h-5 bg-saffron/30 rounded-full animate-steam-delay-2" />

        {/* Tea Cup Body */}
        <div className="relative w-12 h-10 bg-gradient-to-b from-saffron to-accent rounded-b-2xl border-t border-saffron/20 flex items-center justify-center shadow-lg">
          {/* Handle */}
          <div className="absolute right-[-8px] top-[20%] w-4 h-5 border-2 border-l-0 border-accent rounded-r-full" />
          {/* Cup Accent */}
          <div className="w-8 h-1 bg-white/20 rounded-full" />
        </div>
        
        {/* Saucer */}
        <div className="w-16 h-1 bg-secondary rounded-full mt-1 opacity-80" />
      </div>

      <h3 className="font-heading text-lg font-bold text-secondary mt-4">
        Brewing Your Experience...
      </h3>
      <p className="font-hindi text-sm text-primary-dark mt-1 animate-pulse">
        चाय पक रही है... ☕
      </p>
    </div>
  );
}
