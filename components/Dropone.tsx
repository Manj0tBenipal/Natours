import { createRandomString, env } from "@/utils/functions";
import { generateSignedURL } from "@/utils/server_actions/s3Operations";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { BiFolderOpen } from "react-icons/bi";

/**
 * This component is a Drang 'n' Drop zone which uploads a selected image file
 * to s3 bucket. The URL is then passed to the setURL fuction which is recieved in props.
 */
export default function Dropone({ setUrl, }: { setUrl: (url: string) => void }) {
  const pathname = usePathname();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) alert("File not readable!");
    setFile(file);
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;
      setFileContents(binaryStr);
    };
    reader.readAsDataURL(file);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    //max file size : 10MB
    maxSize: 10485760,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [fileContents, setFileContents] = useState<
    string | ArrayBuffer | null
  >();

  const handleUpload = useCallback(async () => {
    try {
      setIsSaving(true);
      if (!file) return alert("File could not be accessed please try again!");
      const filename = createRandomString();
      //get signed URL to upload file
      const s3SignedRes = await generateSignedURL(
        filename,
        file.type,
        file.size
      );

      if (s3SignedRes.status === "fail")
        throw new Error(
          s3SignedRes?.error ||
            "Failed to initiate upload request.Server did not respond"
        );

      //upload file
      await fetch(s3SignedRes.data.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-type": file.type,
        },
      });
      setUrl(`${process.env.NEXT_PUBLIC_AWS_BUCKET_PUBLIC_URL}/${filename}`);
      alert("Saved image successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [file, setUrl]);
  return (
    <div className="relative md:grid md:grid-cols-2 gap-3 w-full h-[200px]">
      <div className="relative flex flex-col p-3 w-full items-center justify-center shadow-md rounded-2xl">
        <div
          {...getRootProps()}
          className=" flex flex-col items-center justify-center w-full h-full"
        >
          <div>
            Drag &apos;n Drop files or click here to select from storage
          </div>
          <BiFolderOpen size={32} />
          <input
            {...getInputProps()}
            accept="image/jpeg,
                    image/png,
                    image/gif,
                    image/bmp,
                    image/webp,
                    image/svg+xml"
          />
        </div>

        <Button
          variant="solid"
          color="success"
          className="text-white"
          onClick={handleUpload}
          isLoading={isSaving}
        >
          Save
        </Button>
      </div>
      <div className="w-full flex justify-center items-center shadow-md rounded-2xl">
        {fileContents ? (
          <Image
            src={fileContents.toString()}
            height={200}
            width={pathname.includes("users") ? 112 : 355}
            alt={`${pathname.includes("users") ? "User's profile" : "Tour Gallery"}`}
          />
        ) : (
          <h1>Image Preview will show here!</h1>
        )}
      </div>
    </div>
  );
}
