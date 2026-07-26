import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Bhopal",
    rating: 5,
    text: "Absolutely stunning collection! The gold necklace I ordered was even more beautiful in person. Quick WhatsApp response and smooth experience.",
  },
  {
    name: "Ananya Verma",
    location: "Indore",
    rating: 5,
    text: "Loved the earrings I bought for my sister's wedding. Great craftsmanship and the team was very helpful over WhatsApp with sizing questions.",
  },
  {
    name: "Ritu Malhotra",
    location: "Jabalpur",
    rating: 4,
    text: "Beautiful designs at honest prices. The bangles are gorgeous and exactly as shown in photos. Will definitely shop again.",
  },
  {
    name: "Kavita Joshi",
    location: "Bhopal",
    rating: 5,
    text: "Their trending collection is so on point. Ordered a ring and got it customized after chatting on WhatsApp. Highly recommend!",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {TESTIMONIALS.map((t) => (
        <div key={t.name} className="card-luxury flex flex-col gap-3 p-6">
          <div className="flex gap-0.5 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-4 ${i < t.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <p className="flex-1 text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
          <div>
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
