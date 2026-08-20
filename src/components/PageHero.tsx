import { motion } from "framer-motion";

export default function PageHero({
  label,
  title,
  subtitle,
  image,
}: {
  label: string;
  title: string;
  subtitle?: string;
  image: string;
}) {
  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-steel-dark/85 via-steel-dark/70 to-steel-dark/85" />
      <div className="relative z-10 container-x">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-brand-glow uppercase tracking-[0.28em] text-xs md:text-sm font-bold"
        >
          {label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="display text-white text-4xl md:text-6xl mt-4 max-w-4xl"
        >
          {title}
        </motion.h1>
        <span className="mt-5 block rule-red" />
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/85 text-lg mt-5 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
