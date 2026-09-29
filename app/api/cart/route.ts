import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const sessionSchema = z.string().trim().min(10).max(120);
const addSchema = z.object({ sessionId: sessionSchema, variantId: z.string().min(1), quantity: z.number().int().min(1).max(20).default(1) });
const updateSchema = z.object({ sessionId: sessionSchema, itemId: z.string().min(1), quantity: z.number().int().min(0).max(20) });

const cartInclude = { items: { include: { variant: { include: { product: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } } } } } } } as const;
type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

function serializeCart(cart: CartWithItems | null) {
  const items = cart?.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    variant: { id: item.variant.id, size: item.variant.size, sku: item.variant.sku, price: item.variant.price.toString(), stock: item.variant.stock },
    product: { slug: item.variant.product.slug, name: item.variant.product.name, brand: item.variant.product.brand.name, image: item.variant.product.images[0]?.url ?? null },
  })) ?? [];
  const subtotal = items.reduce((total, item) => total + Number(item.variant.price) * item.quantity, 0);
  return { id: cart?.id ?? null, items, subtotal: subtotal.toFixed(2) };
}

async function getCart(sessionId: string) {
  return prisma.cart.findUnique({ where: { sessionId }, include: cartInclude });
}

export async function GET(request: NextRequest) {
  const sessionId = sessionSchema.safeParse(request.nextUrl.searchParams.get("sessionId"));
  if (!sessionId.success) return NextResponse.json({ error: "A valid sessionId is required" }, { status: 400 });
  return NextResponse.json({ cart: serializeCart(await getCart(sessionId.data)) });
}

export async function POST(request: NextRequest) {
  const parsed = addSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item", details: parsed.error.flatten() }, { status: 400 });
  const { sessionId, variantId, quantity } = parsed.data;
  const variant = await prisma.productVariant.findFirst({ where: { id: variantId, active: true, product: { published: true } } });
  if (!variant) return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
  if (quantity > variant.stock) return NextResponse.json({ error: "Not enough stock available" }, { status: 409 });
  const cart = await prisma.cart.upsert({ where: { sessionId }, update: {}, create: { sessionId } });
  const current = await prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId } } });
  const totalQuantity = (current?.quantity ?? 0) + quantity;
  if (totalQuantity > variant.stock) return NextResponse.json({ error: `Only ${variant.stock} available` }, { status: 409 });
  await prisma.cartItem.upsert({ where: { cartId_variantId: { cartId: cart.id, variantId } }, update: { quantity: totalQuantity }, create: { cartId: cart.id, variantId, quantity } });
  return NextResponse.json({ cart: serializeCart(await getCart(sessionId)) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart update", details: parsed.error.flatten() }, { status: 400 });
  const { sessionId, itemId, quantity } = parsed.data;
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: { sessionId } }, include: { variant: true } });
  if (!item) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  if (quantity > item.variant.stock) return NextResponse.json({ error: `Only ${item.variant.stock} available` }, { status: 409 });
  if (quantity === 0) await prisma.cartItem.delete({ where: { id: itemId } });
  else await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return NextResponse.json({ cart: serializeCart(await getCart(sessionId)) });
}

export async function DELETE(request: NextRequest) {
  const parsed = updateSchema.pick({ sessionId: true, itemId: true }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "A valid sessionId and itemId are required" }, { status: 400 });
  await prisma.cartItem.deleteMany({ where: { id: parsed.data.itemId, cart: { sessionId: parsed.data.sessionId } } });
  return NextResponse.json({ cart: serializeCart(await getCart(parsed.data.sessionId)) });
}