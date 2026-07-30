import type { Metadata } from "next";
import { SiteQrCode } from "@/features/admin/scan/site-qr-code";

export const metadata: Metadata = {
  title: "Scan Site | AI Jewellery Admin",
};

export default function AdminScanPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Scan Site</h1>
        <p className="text-muted-foreground text-sm">
          Scan this QR code with a phone camera to open the live website.
        </p>
      </div>

      <div className="card-luxury flex flex-col items-center gap-6 p-10">
        <SiteQrCode />
      </div>
    </div>
  );
}
