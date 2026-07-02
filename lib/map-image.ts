// Compression côté client de l'image de carte : une seule image est
// stockée dans Redis, il faut rester sous la limite de 1 Mo par requête
// d'Upstash (marge de sécurité incluse)

const MAX_DATA_URL_CHARS = 900_000;
const MAX_DIMENSION = 2048;
const MIN_DIMENSION = 320;
const JPEG_QUALITIES = [0.85, 0.7, 0.55, 0.4];

export interface CompressedMapImage {
  dataUrl: string;
  width: number;
  height: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire l'image"));
    };
    img.src = url;
  });
}

export async function fileToCompressedDataUrl(
  file: File
): Promise<CompressedMapImage> {
  const img = await loadImage(file);
  const naturalWidth = img.naturalWidth;
  const naturalHeight = img.naturalHeight;
  if (!naturalWidth || !naturalHeight) {
    throw new Error("Image invalide");
  }

  let scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(naturalWidth, naturalHeight)
  );

  // Réduit la qualité puis les dimensions jusqu'à passer sous la limite
  // (au moins une passe, même pour les très petites images)
  for (;;) {
    const width = Math.round(naturalWidth * scale);
    const height = Math.round(naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non disponible");
    ctx.drawImage(img, 0, 0, width, height);

    for (const quality of JPEG_QUALITIES) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= MAX_DATA_URL_CHARS) {
        return { dataUrl, width, height };
      }
    }

    const nextScale = scale * 0.7;
    if (Math.max(naturalWidth, naturalHeight) * nextScale < MIN_DIMENSION) {
      throw new Error("Image trop lourde même après compression");
    }
    scale = nextScale;
  }
}
