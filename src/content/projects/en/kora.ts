import thumbnail from "../../../assets/thumbnails/kora.webp";
import type { ProjectContent } from "../../types";

export default {
  title: "Kora",
  theme: "dark",
  tags: ["react", "javascript"],
  videoBorder: false,
  live: "https://dutakora.vercel.app/",
  description: "A full-featured AI chat assistant built from scratch. Supports streaming responses typed out word by word, file attachments with in-browser parsing for PDF, Word, Excel and PowerPoint, voice input and a hands-free voice mode, message editing and regeneration, image gallery, and a Korean vocabulary game. Powered by Google Gemini with multi-model fallback and an offline question bank.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Kora Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
