import { useMemo } from "react";

export function useImageFileOrUrl(image?: string | File): string {
  return useMemo(() => {
    if (!image) {
      return "";
    }
    return typeof image === "string" ? image : URL.createObjectURL(image);
  }, [image]);
}
