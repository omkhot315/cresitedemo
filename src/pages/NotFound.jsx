import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import PlatformNav from "../components/common/PlatformNav.jsx";
import { SEED_BUSINESSES } from "../data/seedBusinesses.js";

/** Professional 404 — also suggests live demo destinations. */
export default function NotFound({ slug }) {
  return (
    <div className="bg-grid min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 pb-20 pt-28 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Compass size={26} />
        </span>
        <p className="mt-8 font-display text-[5.5rem] font-bold leading-none tracking-tight text-transparent sm:text-[7rem]" style={{ WebkitTextStroke: "2px #5046E5" }}>
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">This page checked out early</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#55555E]">
          {slug ? (
            <>
              There's no business website at <span className="rounded-md bg-black/5 px-2 py-0.5 font-mono text-[13px] font-semibold">/{slug}</span> yet.
              It may have been renamed — or it's waiting for you to create it.
            </>
          ) : (
            "The page you're looking for doesn't exist or may have moved."
          )}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold transition hover:border-black/30">
            <ArrowLeft size={15} /> Back home
          </Link>
          <Link to="/create" className="inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-[#4338CA]">
            {slug ? `Claim /${slug}` : "Create a website"} <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="mt-14 w-full border-t border-black/10 pt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#77777F]">Or visit one of these live sites</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SEED_BUSINESSES.map((b) => (
              <Link
                key={b.slug}
                to={`/${b.slug}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12.5px] font-semibold text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
              >
                /{b.slug}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
