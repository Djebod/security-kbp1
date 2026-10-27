type Props = { name: string; className?: string };

/** Ikon garis sederhana (tanpa library) */
export default function Icon({ name, className = "h-5 w-5" }: Props) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "home": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>;
    case "scan": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M4 12h16"/></svg>;
    case "clipboard": return <svg viewBox="0 0 24 24" className={className} {...p}><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/></svg>;
    case "check": return <svg viewBox="0 0 24 24" className={className} {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>;
    case "search": return <svg viewBox="0 0 24 24" className={className} {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>;
    case "box": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="m3 8 9-4 9 4-9 4-9-4Z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></svg>;
    case "key": return <svg viewBox="0 0 24 24" className={className} {...p}><circle cx="8" cy="14" r="4"/><path d="m11 11 9-9M15 7l2 2M18 4l2 2"/></svg>;
    case "fire": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-2 1-3 0 2 1 3 2 3 0-3-1-6 1-9Z"/><path d="M8 13c-1.5 1-2 2.5-2 4a6 6 0 0 0 12 0c0-1.5-.5-3-2-4"/></svg>;
    case "plus": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "back": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="m14 6-6 6 6 6"/></svg>;
    case "logout": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/></svg>;
    case "camera": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case "wa": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 20l1.3-3.8A8 8 0 1 1 8.3 19L4 20Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2L9 9.5Z"/></svg>;
    case "menu": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "flash": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>;
    case "x": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "alert": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5M12 18h.01"/></svg>;
    case "external": return <svg viewBox="0 0 24 24" className={className} {...p}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>;
    case "info": return <svg viewBox="0 0 24 24" className={className} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>;
    default: return <svg viewBox="0 0 24 24" className={className} {...p}><circle cx="12" cy="12" r="8"/></svg>;
  }
}
