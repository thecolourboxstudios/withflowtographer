import { NextResponse } from "next/server"

export const runtime = "nodejs"

type CloudinaryResource = {
  public_id: string
  format: string
  width: number
  height: number
}

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbbzsyl8u"
  const apiKey = process.env.CLOUDINARY_API_KEY|| "124845328397661"
  const apiSecret = process.env.CLOUDINARY_API_SECRET ||"oPM1Kh6nY5nsVDLUfJhl6Y6MX3s"
  const folder = process.env.CLOUDINARY_FOLDER||"Rahul"

  if (!cloudName || !apiKey || !apiSecret || !folder) {
    return NextResponse.json(
      {
        error:
          "Missing Cloudinary env vars. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER.",
      },
      { status: 500 },
    )
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expression: `folder:${folder}/*`,
      sort_by: [{ public_id: "desc" }],
      max_results: 200,
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return NextResponse.json(
      { error: `Cloudinary search failed (${res.status}). ${text}` },
      { status: 500 },
    )
  }

  const data = (await res.json()) as { resources?: CloudinaryResource[] }
  const resources = Array.isArray(data.resources) ? data.resources : []

  return NextResponse.json({
    cloudName,
    resources: resources.map((r, i) => ({
      id: i,
      public_id: r.public_id,
      format: r.format,
      width: r.width,
      height: r.height,
    })),
  })
}
