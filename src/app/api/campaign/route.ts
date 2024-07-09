import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CREATED, NOT_FOUND, OK } from "http-status";
import handleApiError from "@/app/utils/handleApiError";
import handleZodError from "@/app/utils/handleZodError";

interface Quota {
  id: string;
  quantity: number;
}

const campaignSchema = z.object({
  code: z.string().min(6, "Code must have at least 6 characters"),
  title: z.string().min(6, "Title must have at least 6 characters"),
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quotaPrice: z.number().min(0.01, "Price must be at least 0.01"),
  drawDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid draw date",
  }),
  quotaId: z.string().uuid("quotaId must be a uuid string"),
});

async function findQuotaById(id: string): Promise<Quota | null> {
  return prisma.quota.findUnique({ where: { id } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = campaignSchema.parse(body);

    const {
      code,
      description,
      drawDate,
      imageUrl,
      quotaPrice,
      title,
      quotaId,
    } = parsedBody;

    const quotaExists = await findQuotaById(quotaId);

    if (!quotaExists) {
      return NextResponse.json(
        { error: "Quantity doesn't exists" },
        { status: 400 }
      );
    }

    const newCampaign = await prisma.campaign.create({
      data: {
        code,
        description,
        drawDate,
        imageUrl,
        quotaPrice,
        title,
        quotaId,
      },
    });

    return NextResponse.json(newCampaign, { status: CREATED });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return handleApiError(error, "Failed to create campaign");
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          quota: {
            select: {
              quantity: true,
            },
          },
        },
      });

      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: NOT_FOUND });
      }

      return NextResponse.json(campaign, { status: OK });
    }

    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 25;

    const [campaigns, totalCampaigns] = await Promise.all([
      prisma.campaign.findMany({
        orderBy: { title: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          quota: {
            select: {
              quantity: true,
            },
          },
        },
      }),
      prisma.campaign.count(),
    ]);

    return NextResponse.json(
      {
        data: campaigns,
        total: totalCampaigns,
        page,
        pageSize,
        totalPages: Math.ceil(totalCampaigns / pageSize),
      },
      { status: OK }
    );
  } catch (error) {
    return handleApiError(error, "Failed to fetch campaigns");
  }
}
