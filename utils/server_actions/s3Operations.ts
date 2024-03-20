"use server";

import { env } from "../functions";
import { authUsingCookie } from "./auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({
  region: env("AWS_BUCKET_REGION")!,
  credentials: {
    accessKeyId: env("AWS_BUCKET_KEY")!,
    secretAccessKey: env("AWS_BUCKET_SECRET_KEY")!,
  },
});

/**
 * This function generates a signed URL for the user to uplaod a file to s3 bucket
 * The URL contains data about file, that can be used to verify file's integrity
 * @param key the name of file
 * @param fileType the type of file e.g. image, video
 * @param size the size of file in bytes
 */
export async function generateSignedURL(
  key: string,
  fileType: string,
  size: number
): Promise<ServerActionRes> {
  try {
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
    ];
    //check for supported file-type
    if (!imageTypes.includes(fileType))
      throw new Error("File Type not supported");

    //verify user's credentials
    const { status, error, data } = await authUsingCookie();
    if (status === "fail")
      throw new Error(error || "Something went wrong while authenticatin user");

    //verify user's role[This might be removed in the future to enable users to tupload their profile pics]
    const { user }: { user: User | undefined } = data;
    if (user?.role !== "admin")
      throw new Error("User is not allowed to perform this action.");

    const putObjectCommand = new PutObjectCommand({
      Bucket: env("AWS_BUCKET_NAME"),
      Key: key,
      ContentType: fileType,
      ContentLength: size,
    });
    const signedUrl = await getSignedUrl(s3, putObjectCommand);
    return { status: "success", data: { url: signedUrl }, error: null };
  } catch (err: any) {
    return { status: "fail", error: err.message, data: null };
  }
}
