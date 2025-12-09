"use client";

import Image from "next/image";
import Hero from "@/public/hero.svg";
import { motion } from "motion/react";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <Image src={Hero} alt="Hero Image" className="w-[100vw] object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <motion.div
        className="absolute transform text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h1 className="text-8xl font-bold">Decor Haven</h1>
        <p className="mt-4 text-4xl">Rent the magic, keep the memories</p>
      </motion.div>
    </div>
  );
};

export default Landing;
