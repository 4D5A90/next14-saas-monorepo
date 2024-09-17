import { z } from "zod";

export const paginationSchema = z.object({
	page: z.number().int().optional(),
	perPage: z.number().int().optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
