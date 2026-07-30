"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteQrCode() {
  const [result, setResult] = useState<{ siteUrl: string; qrDataUrl: string } | null>(null);

  useEffect(() => {
    const origin = window.location.origin;
    QRCode.toDataURL(origin, {
      width: 280,
      margin: 2,
      color: { dark: "#831843", light: "#ffffff" },
    }).then((qrDataUrl) => setResult({ siteUrl: origin, qrDataUrl }));
  }, []);

  if (!result) {
    return (
      <div className="flex size-[280px] items-center justify-center">
        <RefreshCw className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.qrDataUrl}
        alt={`QR code linking to ${result.siteUrl}`}
        width={280}
        height={280}
        className="rounded-2xl border border-border p-2"
      />
      <p className="text-muted-foreground text-sm break-all">{result.siteUrl}</p>
      <Button render={<a href={result.qrDataUrl} download="ai-jewellery-site-qr.png" />}>
        <Download className="size-4" />
        Download QR Code
      </Button>
    </div>
  );
}
