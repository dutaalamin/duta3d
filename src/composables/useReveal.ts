import { onMounted, onUnmounted, ref } from "vue";

/**
 * Menampilkan elemen dengan animasi halus saat masuk ke layar.
 * Tambahkan class `reveal` pada elemen yang ingin dianimasikan.
 */
export function useReveal(delay = 0) {
  const revealRef = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const el = revealRef.value;
    if (!el) return;

    const targets = el.classList.contains("reveal")
      ? [el]
      : Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    if (!targets.length) return;

    targets.forEach((target, i) => {
      target.style.transitionDelay = `${delay + i * 90}ms`;
    });

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-tampil");
          observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((target) => observer?.observe(target));
  });

  onUnmounted(() => {
    observer?.disconnect();
    observer = null;
  });

  return { revealRef };
}
