"use client";

import Link from "next/link";
import LandingDemo from "@/components/LandingDemo";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Smartphone, Globe, Layout, CheckCircle2 } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <LandingNavbar />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                v2.0 is now live
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
              >
                Your internet library, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  beautifully organized.
                </span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Save links instantly, sync across devices, and organize with ease.
                Experience the bookmark manager designed for the modern web.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  href="/login"
                  className="group h-12 px-8 rounded-full bg-black text-white flex items-center gap-2 font-medium hover:bg-gray-800 transition-all hover:pr-6"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#"
                  className="h-12 px-8 rounded-full border border-gray-200 text-gray-700 flex items-center font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  View Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full perspective-1000"
            >
              <div className="relative z-10 scale-[0.85] md:scale-100 origin-top-center hover:scale-[1.02] transition-transform duration-500">
                <LandingDemo />
              </div>
              {/* Decorative Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-100 to-violet-100 rounded-full blur-3xl -z-10 opacity-60"></div>
            </motion.div>
          </div>
        </section>

        {/* Benton Grid Features */}
        <section id="features" className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-gray-500 text-lg">
              We stripped away the clutter to focus on what matters: your content.
            </p>
          </div>

          <div id="design" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 max-w-6xl mx-auto h-auto md:h-[600px]">
            {/* Feature 1: Large Left */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-2 rounded-3xl bg-gray-50 p-8 border border-gray-100 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  <Layout className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Beautifully Simple Dashboard</h3>
                <p className="text-gray-500 max-w-sm">
                  A distraction-free interface that puts your bookmarks front and center.
                  Drag, drop, and organize with intuitive ease.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-3/4 h-3/4 translate-x-12 translate-y-12 bg-white rounded-tl-3xl shadow-xl border border-gray-100 p-6 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="h-8 w-8 rounded bg-indigo-100"></div>
                    <div className="space-y-1">
                      <div className="h-2 w-24 bg-gray-200 rounded"></div>
                      <div className="h-2 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="h-8 w-8 rounded bg-green-100"></div>
                    <div className="space-y-1">
                      <div className="h-2 w-20 bg-gray-200 rounded"></div>
                      <div className="h-2 w-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Top Right */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-1 md:row-span-1 rounded-3xl bg-indigo-600 p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <Zap className="w-8 h-8 mb-4 text-indigo-200" />
                <h3 className="text-xl font-bold mb-2">Blazing Fast</h3>
                <p className="text-indigo-100 text-sm">
                  Built on the edge. Loads in milliseconds, every time.
                </p>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
            </motion.div>

            {/* Feature 3: Bottom Right */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-1 md:row-span-1 rounded-3xl bg-gray-900 p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <Shield className="w-8 h-8 mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-gray-400 text-sm">
                  Your data is encrypted. We don't sell your browsing history.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gray-800 to-transparent rounded-tl-full opacity-50"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
            {[
              { icon: Smartphone, title: "Mobile Ready", text: "Access your links on the go with our responsive design." },
              { icon: Globe, title: "Browser Extension", text: "Save directly from your browser with one click (Coming Soon)." },
              { icon: CheckCircle2, title: "Offline Access", text: "Your library is cached locally for instant access anywhere." },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all text-center md:text-left"
              >
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 mb-4 mx-auto md:mx-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to organize your digital life?
              </h2>
              <p className="text-gray-400 text-xl mb-10">
                Join thousands of smart users who have switched to a better bookmarking experience.
              </p>
              <Link
                href="/login"
                className="inline-flex h-14 px-8 rounded-full bg-white text-black text-lg font-medium items-center hover:bg-gray-100 transition-colors"
              >
                Create free account
              </Link>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
