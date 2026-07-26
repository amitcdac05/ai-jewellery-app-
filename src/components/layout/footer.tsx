import Link from "next/link";
import { Gem, MessageCircle, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/shared/instagram-icon";
import {
  SITE_NAME,
  SITE_TAGLINE,
  WHATSAPP_DISPLAY_NUMBER,
  WHATSAPP_CHAT_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-luxury-gradient mt-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Gem className="size-6" />
            <span className="font-heading text-xl font-semibold">{SITE_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/80">{SITE_TAGLINE}</p>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Handcrafted gold and diamond jewellery, curated for every celebration.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white/90">
            Quick Links
          </h3>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/categories" className="hover:text-white">Categories</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
          </nav>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white/90">
            Get in Touch
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <a
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MessageCircle className="size-4" />
              Call/WhatsApp {WHATSAPP_DISPLAY_NUMBER}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <InstagramIcon className="size-4" />
              Follow us {INSTAGRAM_HANDLE}
            </a>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="size-4" />
              India
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 py-5 text-center text-xs text-white/70">
        &copy; {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
