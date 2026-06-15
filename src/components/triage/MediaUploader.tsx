import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video as VideoIcon, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  sessionId: string;
  paths: string[];
  onAdd: (path: string) => void;
  onRemove: (path: string) => void;
  /** Mínimos exigidos para Step 4b (tela / display). */
  minPhotos?: number;
  minVideos?: number;
  /** Limite de duração de vídeo, em segundos. */
  maxVideoSeconds?: number;
}

const MAX_PHOTO_MB = 5;
const MAX_VIDEO_MB = 50;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,video/webm";

/** Aceita File e devolve `{ kind, mb, duration? }` ou erro humano. */
async function inspect(file: File, maxVideoSeconds: number) {
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) return { error: "Formato não suportado." };

  const mb = file.size / (1024 * 1024);
  if (isImage && mb > MAX_PHOTO_MB) return { error: `Foto acima de ${MAX_PHOTO_MB}MB.` };
  if (isVideo && mb > MAX_VIDEO_MB) return { error: `Vídeo acima de ${MAX_VIDEO_MB}MB.` };

  if (isVideo) {
    const duration = await new Promise<number>((resolve) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolve(v.duration || 0);
      v.onerror = () => resolve(0);
      v.src = URL.createObjectURL(file);
    });
    if (duration > maxVideoSeconds + 0.5) {
      return { error: `Vídeo acima de ${maxVideoSeconds}s.` };
    }
    return { kind: "video" as const, mb, duration };
  }
  return { kind: "image" as const, mb };
}

export function MediaUploader({
  sessionId,
  paths,
  onAdd,
  onRemove,
  minPhotos = 3,
  minVideos = 1,
  maxVideoSeconds = 30,
}: MediaUploaderProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const photos = paths.filter((p) => /\.(jpe?g|png|webp|heic)$/i.test(p));
  const videos = paths.filter((p) => /\.(mp4|mov|webm|m4v)$/i.test(p));

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setError(null);
      setBusy(true);
      try {
        for (const file of Array.from(files)) {
          const info = await inspect(file, maxVideoSeconds);
          if ("error" in info) {
            setError(info.error);
            continue;
          }
          const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
          const key = `${sessionId}/${crypto.randomUUID()}-${safeName}`;
          const { error: upErr } = await supabase.storage
            .from("triage-media")
            .upload(key, file, { contentType: file.type, upsert: false });
          if (upErr) {
            setError(`Falha no upload: ${upErr.message}`);
            continue;
          }
          onAdd(key);
        }
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [sessionId, onAdd, maxVideoSeconds],
  );

  const photosOk = photos.length >= minPhotos;
  const videosOk = videos.length >= minVideos;

  return (
    <div className="space-y-4">
      {/* AVISO IMPOSITIVO — vermelho intenso (memória do projeto) */}
      <div
        role="alert"
        className="rounded-xl border-2 border-destructive bg-destructive/10 p-4 text-sm text-destructive"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          <div className="space-y-1">
            <p className="font-extrabold uppercase tracking-wide">
              AVISO: Faça um vídeo completo do aparelho mostrando o dano e a etiqueta traseira.
            </p>
            <p className="font-bold">
              VÍDEOS COM BARULHO OU ÁUDIOS SERÃO IGNORADOS E O ATENDIMENTO CANCELADO.
            </p>
            <p className="text-xs opacity-90">
              Grave em local silencioso, sem fala, música ou TV de fundo. Mostre a tela ligada (se possível),
              o defeito e a etiqueta com número de série.
            </p>
          </div>
        </div>
      </div>

      {/* Botão de upload */}
      <label
        htmlFor="triage-media-input"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center transition hover:bg-primary/10",
          busy && "pointer-events-none opacity-60",
        )}
      >
        {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6 text-primary" />}
        <span className="text-sm font-semibold">
          {busy ? "Enviando..." : "Toque para selecionar fotos e vídeo"}
        </span>
        <span className="text-xs text-muted-foreground">
          Fotos JPG/PNG (até {MAX_PHOTO_MB}MB) · Vídeo MP4/MOV até {maxVideoSeconds}s ({MAX_VIDEO_MB}MB)
        </span>
        <input
          ref={inputRef}
          id="triage-media-input"
          type="file"
          className="sr-only"
          multiple
          accept={ACCEPTED}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Progresso de obrigatoriedade */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div
          className={cn(
            "rounded-lg border p-3 text-center",
            photosOk ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300" : "border-border bg-muted/30",
          )}
        >
          <ImageIcon className="mx-auto mb-1 h-4 w-4" />
          <span className="font-semibold">{photos.length}/{minPhotos}</span> fotos
        </div>
        <div
          className={cn(
            "rounded-lg border p-3 text-center",
            videosOk ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300" : "border-border bg-muted/30",
          )}
        >
          <VideoIcon className="mx-auto mb-1 h-4 w-4" />
          <span className="font-semibold">{videos.length}/{minVideos}</span> vídeo
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Lista dos arquivos enviados (mostra path sem expor URL — bucket é privado) */}
      {paths.length > 0 && (
        <ul className="space-y-1.5 text-xs">
          {paths.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2"
            >
              <span className="truncate font-mono">{p.split("/").pop()}</span>
              <button
                type="button"
                onClick={() => onRemove(p)}
                className="text-muted-foreground transition hover:text-destructive"
                aria-label={`Remover ${p}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
