import { SUB_STATUS } from "../../services/subscriptionApi.js";

/** Red/amber/green badge for a website's 1-year subscription state. */
export default function StatusBadge({ status, days }) {
  const meta = SUB_STATUS[status] || SUB_STATUS.none;
  const suffix = status === "expiring" && days !== null && days >= 0 ? ` \u00b7 ${days}d` : "";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${meta.tint}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
      {suffix}
    </span>
  );
}
