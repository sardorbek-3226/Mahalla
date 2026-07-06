import { motion } from 'framer-motion';

// Shared shell for static info/legal pages: gradient hero band + centered
// content container. Keeps About / Contact / FAQ / Privacy / Terms consistent.
const ContentPage = ({ title, subtitle, icon: Icon, children, narrow }) => (
  <div>
    <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-primary-600 to-accent-700 dark:border-gray-800">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="mx-auto max-w-4xl px-4 py-14 text-center text-white sm:px-6 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {Icon && (
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Icon className="h-7 w-7" />
            </span>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/80">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>

    <div className={`mx-auto px-4 py-12 sm:px-6 ${narrow ? 'max-w-3xl' : 'max-w-5xl'}`}>
      {children}
    </div>
  </div>
);

export default ContentPage;
