import { z } from "zod";

export const zRequestInfo = z.object({
    headers: z.record(z.string(), z.string()),
})