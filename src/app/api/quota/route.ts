import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CREATED, OK } from "http-status";
import handleApiError from "@/app/utils/handleApiError";
import handleZodError from "@/app/utils/handleZodError";

interface Quota {
  id: string;
  quantity: number;
}

async function findQuantity(quantity: number): Promise<Quota | null> {
  return prisma.quota.findUnique({ where: { quantity } });
}

const quotaSchema = z.object({
  quantity: z.number().min(100, "Quantity must be greater or equal than 100"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = quotaSchema.parse(body);

    const { quantity } = parsedBody;

    const quantityExists = await findQuantity(quantity);

    if (quantityExists) {
      return NextResponse.json(
        { error: "Quantity already exists" },
        { status: 400 }
      );
    }

    const newQuantity = await prisma.quota.create({ data: { quantity } });

    return NextResponse.json(newQuantity, { status: CREATED });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleApiError(error, "Failed to create quota");
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 25;

    const [quotas, totalQuotas] = await Promise.all([
      prisma.quota.findMany({
        orderBy: { quantity: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quota.count(),
    ]);

    return NextResponse.json(
      {
        data: quotas,
        total: totalQuotas,
        page,
        pageSize,
        totalPages: Math.ceil(totalQuotas / pageSize),
      },
      { status: OK }
    );
  } catch (error) {
    return handleApiError(error, "Failed to fetch quota");
  }
}
