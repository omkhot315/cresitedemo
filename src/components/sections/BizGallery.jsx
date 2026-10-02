import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";

/** Gallery — clean grid with feature tile, or moody masonry for the gym. */
export default function BizGallery() {
  const { business, skin } = useBiz();
  const images = (business.gallery || []).filter(Boolean);
  if (!images.length) return null;

  const masonry = skin.galleryVariant === "masonry";

  return (
    <SectionShell id="gallery" tone={masonry ? "base" : "alt"}>
      <SectionHead id="gallery" />

      {masonry ? (
        <div className="columns-2 gap-4 md:columns-3">
          {images.map((src, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <div className="mb-4 break-inside-avoid overflow-hidden" style={{ borderRadius: "var(--r)" }}>
                <img
                  src={src}
                  alt={`${business.name} gallery ${i + 1}`}
                  loading="lazy"
                  className="w-full grayscale-[35%] transition duration-700 hover:scale-105 hover:grayscale-0"
                />
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.slice(0, 7).map((src, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05} className={i === 0 ? "col-span-2 row-span-2 h-full" : ""}>
              <div className="group h-full w-full overflow-hidden" style={{ borderRadius: "var(--r)" }}>
                <img
                  src={src}
                  alt={`${business.name} gallery ${i + 1}`}
                  loading="lazy"
                  className={`w-full object-cover transition duration-700 group-hover:scale-[1.06] ${
                    i === 0 ? "h-full" : "aspect-square"
                  }`}
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
