import React from 'react'

/* ---------------------------------------------------------------------------
   Fixed atmosphere layer behind everything. All glows are radial-gradient
   fills faded by a mask (the .bloom class) — NOT filter: blur() — so they
   rasterise once and only composite while scrolling. No backdrop-filter here.
   Everything is pointer-events:none and aria-hidden.
   --------------------------------------------------------------------------- */
export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* faint steel grid */}
      <div className="absolute inset-0 grid-plate opacity-[0.5]" />

      {/* Thor-blue glow, top-left */}
      <div
        className="bloom absolute -left-24 -top-24 h-[42rem] w-[42rem] rounded-full bg-volt-500/25 animate-drift"
        style={{ animationDelay: '-3s' }}
      />
      {/* Hulk-green glow, right */}
      <div className="bloom absolute -right-32 top-1/3 h-[38rem] w-[38rem] rounded-full bg-titan-500/20 animate-drift" />
      {/* Power-red ember, bottom-left */}
      <div
        className="bloom absolute -left-20 bottom-0 h-[34rem] w-[34rem] rounded-full bg-rage-600/16 animate-drift"
        style={{ animationDelay: '-9s' }}
      />

      {/* top hairline of electric light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-volt-400/50 to-transparent" />

      {/* subtle vignette so content pops */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,transparent_55%,rgba(4,5,10,0.85))]" />
    </div>
  )
}
