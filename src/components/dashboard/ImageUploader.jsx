import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Link2, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import { uploadImage, getUploadConfig, ACCEPTED, MAX_FILE_MB, optimized } from "../../services/cloudinary.js";

/**
 * Single-image field: drag & drop / click to upload to Cloudinary, with a
 * preview, remove button and a URL fallback when uploads aren't configured.
 */
export function ImageField({ label, hint, value, onChange, aspect = "aspect-[16/10]" }) {
  const inputRef = useRef(null);
  const [cfg, setCfg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    getUploadConfig().then(setCfg);
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setBusy(true);
    setPct(0);
    try {
      const { url } = await uploadImage(file, setPct);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      setPct(0);
    }
  };

  const uploadsOn = cfg && cfg.mode !== "off";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">{label}</span>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#77777F] transition hover:text-indigo-600"
        >
          <Link2 size={11} /> {showUrl ? "Hide URL" : "Use URL"}
        </button>
      </div>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-black/10 bg-black/[0.03]">
          <img src={optimized(value, { w: 800 })} alt={label} className={`w-full object-cover ${aspect}`} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X size={15} />
          </button>
          {uploadsOn && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-3 py-1.5 text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100"
            >
              Replace
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (uploadsOn) handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => uploadsOn && !busy && inputRef.current?.click()}
          className={`flex ${aspect} w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition ${
            drag ? "border-indigo-500 bg-indigo-50" : "border-black/15 bg-black/[0.02]"
          } ${uploadsOn ? "cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40" : "cursor-default"}`}
        >
          {busy ? (
            <>
              <Loader2 size={20} className="animate-spin text-indigo-600" />
              <span className="text-[12px] font-bold text-indigo-600">Uploading… {pct}%</span>
              <span className="h-1 w-32 overflow-hidden rounded-full bg-black/10">
                <span className="block h-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
              </span>
            </>
          ) : uploadsOn ? (
            <>
              <UploadCloud size={22} className="text-[#A1A1AA]" />
              <span className="text-[12.5px] font-bold text-[#55555E]">Click or drop an image</span>
              <span className="text-[11px] text-[#A1A1AA]">PNG, JPG or WebP · up to {MAX_FILE_MB} MB</span>
            </>
          ) : (
            <>
              <ImagePlus size={22} className="text-[#A1A1AA]" />
              <span className="px-4 text-center text-[12px] font-semibold text-[#77777F]">
                Image uploads not configured — use “Use URL” to paste a link
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {showUrl && (
        <input
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 font-mono text-[12px] outline-none transition focus:border-indigo-500"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
        />
      )}

      {error && (
        <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] font-semibold text-red-600">
          <AlertCircle size={12} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      {hint && !error && <p className="mt-1 text-[11.5px] text-[#8E8E96]">{hint}</p>}
    </div>
  );
}

/**
 * Multi-image gallery field. Uploads several files at once to Cloudinary and
 * keeps an ordered, removable thumbnail grid.
 */
export function GalleryField({ label = "Gallery images", hint, value = [], onChange }) {
  const inputRef = useRef(null);
  const [cfg, setCfg] = useState(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    getUploadConfig().then(setCfg);
  }, []);

  const images = (value || []).filter(Boolean);
  const uploadsOn = cfg && cfg.mode !== "off";

  const handleFiles = async (fileList) => {
    const files = [...(fileList || [])];
    if (!files.length) return;
    setError("");
    setBusy(files.length);
    const done = [];
    for (const f of files) {
      try {
        // Sequential keeps Cloudinary happy and progress predictable.
        // eslint-disable-next-line no-await-in-loop
        const { url } = await uploadImage(f);
        done.push(url);
      } catch (e) {
        setError(e.message);
      }
      setBusy((n) => n - 1);
    }
    if (done.length) onChange([...images, ...done]);
    setBusy(0);
  };

  const removeAt = (i) => onChange(images.filter((_, x) => x !== i));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
          {label} {images.length > 0 && <span className="text-[#A1A1AA]">({images.length})</span>}
        </span>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#77777F] transition hover:text-indigo-600"
        >
          <Link2 size={11} /> {showUrl ? "Hide URLs" : "Use URLs"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-black/10">
            <img src={optimized(src, { w: 400 })} alt={`Gallery ${i + 1}`} className="aspect-square w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => uploadsOn && inputRef.current?.click()}
          disabled={!uploadsOn || busy > 0}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] transition hover:border-indigo-400 hover:bg-indigo-50/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy > 0 ? (
            <>
              <Loader2 size={18} className="animate-spin text-indigo-600" />
              <span className="text-[10.5px] font-bold text-indigo-600">{busy} left</span>
            </>
          ) : (
            <>
              <UploadCloud size={18} className="text-[#A1A1AA]" />
              <span className="text-[10.5px] font-bold text-[#77777F]">Add photos</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {showUrl && (
        <textarea
          rows={3}
          className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-2.5 font-mono text-[12px] outline-none transition focus:border-indigo-500"
          value={images.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={"https://...\nhttps://..."}
        />
      )}

      {error && (
        <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] font-semibold text-red-600">
          <AlertCircle size={12} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      {hint && !error && <p className="mt-1.5 text-[11.5px] text-[#8E8E96]">{hint}</p>}
    </div>
  );
}
