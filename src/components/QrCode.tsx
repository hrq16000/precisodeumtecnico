import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeProps {
  /** URL rastreável (com UTM) codificada no QR. */
  value: string;
  /** Texto alternativo acessível. */
  alt: string;
  size?: number;
  className?: string;
}

/**
 * QR code gerado no cliente a partir de um link já rastreável (UTM preservado).
 * Usado em material impresso (checklist, OS) e na página "Como avaliar".
 */
export function QrCode({ value, alt, size = 176, className }: QrCodeProps) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, { width: size, margin: 1, errorCorrectionLevel: "M" })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => setSrc(""));
    return () => {
      active = false;
    };
  }, [value, size]);

  if (!src) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      data-qr-code
      data-qr-value={value}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
