import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";   

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();


// import { generateComponents } from "@uploadthing/react";
// import { generateReactHelpers } from "@uploadthing/react/hooks";

// import type { OurFileRouter } from "@/app/api/uploadthing/core";

// export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();

// export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();






// import { generateComponents } from "@uploadthing/react";
// import { generateReactHelpers } from "@uploadthing/react/hooks";

// import type { OurFileRouter } from "@/app/api/uploadthing/core";

// export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();

// export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();