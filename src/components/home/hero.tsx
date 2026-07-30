"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const HERO_IMAGE =
  "https://res.cloudinary.com/xwt5uill/image/upload/v1785445704/ai-jewellery/products/bwgbr6ectfaoynfx5xxn.jpg";

export function Hero() {
  return (
    <section className="bg-luxury-radial relative overflow-hidden text-white">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="bg-luxury-gradient absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,white_0%,transparent_30%)] opacity-10" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur"
        >
          <Sparkles className="size-3.5" />
          Handcrafted Fine Jewellery
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          {SITE_NAME}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl text-lg text-white/85 sm:text-xl"
        >
          {SITE_TAGLINE}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-lg text-sm text-white/70"
        >
          Explore our curated collection of artificial jewellery — rings, necklaces, earrings and
          bangles crafted for every occasion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-2 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-white text-primary shadow-luxury-lg hover:bg-white/90"
            render={<Link href="/products" />}
            nativeButton={false}
          >
            Shop Now
            <ArrowRight />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            render={<Link href="/categories" />}
            nativeButton={false}
          >
            Browse Categories
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
