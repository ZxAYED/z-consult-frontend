"use client";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Footer } from "@/components/shared/footer";
import { GlassPanel } from "@/components/shared/glass";
import { Navbar } from "@/components/shared/navbar";
import Wrapper from "@/components/shared/Wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart3, CalendarCheck, Clock, Users } from "lucide-react";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-[linear-gradient(180deg,rgba(248,251,245,1)_0%,rgba(255,255,255,1)_55%)]">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-12%] left-[-8%] w-[55%] h-[55%] bg-primary/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-12%] right-[-8%] w-[55%] h-[55%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute top-[12%] right-[18%] w-[28%] h-[28%] bg-accent/50 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,20,12,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,20,12,0.05)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40 [mask-image:radial-gradient(120%_60%_at_50%_0%,#000_20%,transparent_70%)]" />
      </div>
      <Navbar />
      <Wrapper>
        {/* Main Content */}
        <main className="relative z-10 flex-1">
          <Wrapper className="py-10 lg:py-14 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start max-w-none ">
            {/* Left Column: Auth Panel */}
            <div className="lg:col-span-5 w-full order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GlassPanel
                  className="p-7 lg:p-8 w-full shadow-[0_18px_50px_-30px_rgba(12,24,12,0.55)] border-0"
                  variant="strong"
                >
                  <div className="mb-6 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Clinic Ops Suite
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground ">
                        Welcome to Z-Consult
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-sm">
                        Sign in to align schedules, staffing, and walk-ins
                        without the waiting room bottlenecks.
                      </p>
                    </div>
                  </div>

                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 rounded-2xl bg-white/70 p-1 shadow-sm">
                      <TabsTrigger
                        value="login"
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer font-medium text-muted-foreground data-[state=active]:text-foreground"
                      >
                        Login
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer font-medium text-muted-foreground data-[state=active]:text-foreground"
                      >
                        Register
                      </TabsTrigger>
                    </TabsList>

                    <motion.div
                      key="login-content"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="login" className="mt-0">
                        <LoginForm />
                      </TabsContent>
                    </motion.div>

                    <motion.div
                      key="register-content"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="register" className="mt-0">
                        <RegisterForm />
                      </TabsContent>
                    </motion.div>
                  </Tabs>
                </GlassPanel>

                <p className="text-center text-xs text-muted-foreground mt-6">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </motion.div>
            </div>

            {/* Right Column: Product Details */}
            <div className="lg:col-span-7 flex flex-col gap-8 pt-2 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-4xl  md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05] mb-6 ">
                  Appointments and queues,
                  <br />
                  <span className="text-primary mt-2">
                    Orchestrated in one place.
                  </span>
                </h1>
              </motion.div>

              {/* Feature Grid */}
              <div id="features" className="grid md:grid-cols-2 gap-6">
                <FeatureCard
                  delay={0.3}
                  icon={<CalendarCheck className="w-6 h-6 text-primary" />}
                  title="Conflict-aware scheduling"
                  description="Auto-check availability across teams so every slot stays balanced."
                />
                <FeatureCard
                  delay={0.4}
                  icon={<Users className="w-6 h-6 text-primary" />}
                  title="Capacity guardrails"
                  description="Lock schedules when limits are reached and guide load across staff."
                />
                <FeatureCard
                  delay={0.5}
                  icon={<Clock className="w-6 h-6 text-primary" />}
                  title="Walk-in flow"
                  description="Route arrivals into open rooms fast with a live queue view."
                />
                <FeatureCard
                  delay={0.6}
                  icon={<BarChart3 className="w-6 h-6 text-primary" />}
                  title="Shift pulse"
                  description="Scan current workload, bottlenecks, and room utilization at a glance."
                />
              </div>
            </div>
          </Wrapper>
        </main>

        <Footer />
      </Wrapper>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden p-6 rounded-2xl bg-white/70 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.3)] grid place-items-center text-center cursor-default"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.15),transparent_60%)]  transition-opacity duration-300 opacity-100" />
      <div className="relative z-10 grid place-items-center text-center">
        <div className="mb-4 bg-primary/10 w-11 h-11 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
