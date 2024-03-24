import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(`${request.url!}`);
  const filename = searchParams.get("filename")!;

  try {
    const blob = await put(`exams/${filename}`, request.body!, {
      access: "public"
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Failed to upload the file.", { error, filename: filename });

    return NextResponse.json(
      { message: "Failed to upload the file", error, filename: filename },
      { status: 500 }
    );
  }
}
