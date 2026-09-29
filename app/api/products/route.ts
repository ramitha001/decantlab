import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  search: z.string().trim().max(80).optional(),
  type: z.enum(["FULL_BOTTLE", "DECANT"]).optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(24),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product filters", details: parsed.error.flatten() }, { status: 400 });
  }

  const { search, type, gender, limit } = parsed.data;
  const products = await prisma.product.findMany({
    where: {
      published: true,
      type,
      gender,
      ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { family: { contains: search, mode: "insensitive" } }, { brand: { name: { contains: search, mode: "insensitive" } } }] } : {}),
    },
    include: { brand: true, images: { orderBy: { sortOrder: "asc" } }, variants: { where: { active: true }, orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ products });
}