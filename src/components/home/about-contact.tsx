import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/shared/instagram-icon";
import {
  SITE_NAME,
  WHATSAPP_DISPLAY_NUMBER,
  WHATSAPP_CHAT_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/lib/constants";

export function AboutSection() {
  return (
    <div className="card-luxury mx-auto max-w-4xl p-8 text-center sm:p-12">
      <Sparkles className="mx-auto size-8 text-primary" />
      <h3 className="mt-4 font-heading text-2xl font-bold text-foreground">About {SITE_NAME}</h3>
      <p className="mt-4 text-muted-foreground">
        {SITE_NAME} is a family-run jewellery house bringing you thoughtfully handcrafted gold and diamond
        pieces. Every design blends timeless tradition with modern elegance, so you can find the perfect
        piece for weddings, festivals, or everyday shine. We believe in honest pricing, quality craftsmanship,
        and personal service — chat with us directly on WhatsApp for any piece you love.
      </p>
    </div>
  );
}

export function ContactSection() {
  return (
    <div className="bg-luxury-gradient mx-auto max-w-4xl rounded-3xl p-8 text-center text-white sm:p-12">
      <h3 className="font-heading text-2xl font-bold">Have a Question?</h3>
      <p className="mt-3 text-white/85">
        Reach out to us anytime — we&apos;re happy to help you find the perfect piece.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90"
          render={<a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
        >
          <MessageCircle />
          Call/WhatsApp {WHATSAPP_DISPLAY_NUMBER}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          render={<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
        >
          <InstagramIcon className="size-4" />
          Follow us {INSTAGRAM_HANDLE}
        </Button>
      </div>
    </div>
  );
}
