"use server";

import { timingSafeEqual } from "node:crypto";

export type DiaryAccessState = {
  status: "idle" | "incorrect" | "unavailable" | "unlocked";
  message: string;
};

const initialState: DiaryAccessState = { status: "idle", message: "" };

export async function verifyDiaryAccess(
  _previousState: DiaryAccessState,
  formData: FormData,
): Promise<DiaryAccessState> {
  const expectedCode = process.env.DIARY_ACCESS_CODE;
  const submittedCode = formData.get("accessCode");

  if (!expectedCode || !/^\d{8}$/.test(expectedCode)) {
    console.error("DIARY_ACCESS_CODE must be configured as an eight-digit server environment variable.");
    return {
      status: "unavailable",
      message: "Notebook access is temporarily unavailable. Please try again later.",
    };
  }

  if (typeof submittedCode !== "string" || !/^\d{8}$/.test(submittedCode)) {
    return { status: "incorrect", message: "That combination didn't open the notebook. Please try again." };
  }

  const submittedBuffer = Buffer.from(submittedCode, "utf8");
  const expectedBuffer = Buffer.from(expectedCode, "utf8");
  const matches =
    submittedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(submittedBuffer, expectedBuffer);

  if (!matches) {
    return { status: "incorrect", message: "That combination didn't open the notebook. Please try again." };
  }

  return { ...initialState, status: "unlocked" };
}
