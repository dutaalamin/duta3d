import { ref, watch, onMounted } from "vue";
import { resources } from "../utils/resources";
import gsap from "gsap";

export const preloaderVisible = ref(true);

export const usePreloader = () => {
  const resourcesProgress = ref(0);

  onMounted(() => {
    resources.on("progress", (newProgress) => {
      resourcesProgress.value = newProgress;
    });
  });

  // The preloader renders the logo at full brightness and does not visualise
  // progress — there is no bar or fill animation. It stays on screen until
  // every asset is ready, then fades out.
  watch(resourcesProgress, (newProgress) => {
    if (newProgress < 1) return;

    const preloader = document.querySelector(".preloader") as HTMLElement | null;

    gsap.delayedCall(0.2, () => {
      document.body.classList.remove("is-loading");
      preloader?.classList.add("preloader-hidden");
      preloaderVisible.value = false;
    });
  });
};
