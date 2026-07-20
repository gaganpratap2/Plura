import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticateUser = async () => {
  // Clerk's auth() is async in current versions
  const { userId } = await auth();

  // If you throw, the user will not be able to upload
  if (!userId) throw new UploadThingError("Unauthorized");

  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId };
};

// Shared types for the onUploadComplete callback args, since generic
// inference through the builder chain isn't resolving in this project
// (see: mismatched/duplicate uploadthing package versions).
type UploadMetadata = { userId: string };
type UploadedFile = { ufsUrl: string; key: string; name: string };

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: UploadMetadata;
        file: UploadedFile;
      }) => {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
      },
    ),
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: UploadMetadata;
        file: UploadedFile;
      }) => {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
      },
    ),
  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: UploadMetadata;
        file: UploadedFile;
      }) => {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
      },
    ),
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: UploadMetadata;
        file: UploadedFile;
      }) => {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
      },
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

















// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { auth } from "@clerk/nextjs/server";

// const f = createUploadthing();

// const authenticateUser = async () => {
//   // Clerk's auth() is async in current versions
//   const { userId } = await auth();

//   // If you throw, the user will not be able to upload
//   if (!userId) throw new UploadThingError("Unauthorized");

//   // Whatever is returned here is accessible in onUploadComplete as `metadata`
//   return { userId };
// };

// // FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//   // Define as many FileRoutes as you like, each with a unique routeSlug
//   subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .middleware(authenticateUser)
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.ufsUrl);
//     }),
//   avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .middleware(authenticateUser)
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.ufsUrl);
//     }),
//   agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .middleware(authenticateUser)
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.ufsUrl);
//     }),
//   media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .middleware(authenticateUser)
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.ufsUrl);
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;
