import { defineDotprompt } from "@genkit-ai/dotprompt";
import z from "zod";

export function getInsightGenSystemPrompt() {
  return defineDotprompt(
    {
      input: {
        schema: z.object({
          query: z.string(),
        }),
      },
      output: {
        format: "text",
      },
    },
    `{{role "user"}}
    {{query}}
    `
  );
}
