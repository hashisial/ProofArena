import { FileUp } from "lucide-react";

export function ProofAssetUploadBox() {
  return (
    <div className="rounded-2xl border border-dashed border-[#A16207]/35 bg-[#FFFBEB] p-5 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#A16207]">
        <FileUp aria-hidden="true" className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-black text-[#1C1917]">File upload is not connected yet</p>
      <p className="mt-2 text-sm leading-6 text-[#78716C]">
        Use a link or text proof asset for now. Storage-backed file uploads can be connected later with the existing upload architecture.
      </p>
    </div>
  );
}
