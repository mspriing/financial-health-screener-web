/** The one signature visual, used in exactly two places per the approved design:
 * the top bar wordmark (static, small) and the Home hero (animated, longer). */

const HEARTBEAT_PATH =
  "M0,24 L60,24 L68,14 L76,34 L84,24 L170,24 L178,4 L186,44 L194,24 L202,14 L210,24 " +
  "L300,24 L308,14 L316,34 L324,24 L410,24 L418,4 L426,44 L434,24 L442,14 L450,24 L460,24";

export function TraceMarkSmall({ className = "" }: { className?: string }) {
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" className={className} aria-hidden="true">
      <path
        d="M0,7 L7,7 L8.5,3 L10,11 L11.5,7 L14,7 L15.5,1 L17,13 L18.5,7 L26,7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TraceMarkHero() {
  const tile = (key: string) => (
    <svg key={key} viewBox="0 0 460 48" width={460} height={48} className="flex-none block">
      <path
        d={HEARTBEAT_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <div
      className="mx-auto mt-8 overflow-hidden text-blue"
      style={{
        width: "min(440px, 86%)",
        height: 46,
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
      }}
      aria-hidden="true"
    >
      <div className="flex w-max animate-[trace-scroll_9s_linear_infinite]">
        {tile("a")}
        {tile("b")}
      </div>
      <style>{`@keyframes trace-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
