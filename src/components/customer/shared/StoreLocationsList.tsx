import {
  getOtherStores,
  getPrimaryStore,
  type StoreLocation,
} from "@/lib/site/contact";

type StoreLocationsListProps = {
  variant?: "compact" | "full";
  showMapNote?: boolean;
};

function StoreBlock({
  store,
  badge,
  compact,
}: {
  store: StoreLocation;
  badge?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "rounded-xl bg-surface/80 p-4"}>
      <p className="text-sm font-semibold text-slate-900">
        {store.name}
        {badge && (
          <span className="ml-2 text-xs font-medium text-brand">{badge}</span>
        )}
      </p>
      <address className="mt-1 space-y-0.5 text-sm not-italic leading-relaxed text-slate-600">
        {store.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    </div>
  );
}

export function StoreLocationsList({
  variant = "full",
  showMapNote = false,
}: StoreLocationsListProps) {
  const primary = getPrimaryStore();
  const others = getOtherStores();
  const compact = variant === "compact";

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {showMapNote && (
        <p className="text-xs text-slate-500">
          Map shows our {primary.name} location. Visit any of our Lagos stores
          below.
        </p>
      )}
      <StoreBlock
        store={primary}
        badge={showMapNote ? "on map" : undefined}
        compact={compact}
      />
      {others.length > 0 && (
        <div className={compact ? "space-y-4" : "space-y-4 border-t border-slate-100 pt-5"}>
          {!compact && (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Also at
            </p>
          )}
          {others.map((store) => (
            <StoreBlock key={store.id} store={store} compact={compact} />
          ))}
        </div>
      )}
    </div>
  );
}
