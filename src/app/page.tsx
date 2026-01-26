"use client";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Footer } from "@/components/shared/footer";
import { GlassPanel } from "@/components/shared/glass";
import { Navbar } from "@/components/shared/navbar";
import { SectionTitle } from "@/components/shared/section-title";
import Wrapper from "@/components/shared/Wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart3, CalendarCheck, Clock, Users } from "lucide-react";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex flex-col">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-accent/30 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <Wrapper className="py-8 lg:py-12 grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Left Column: Auth Panel */}
          <div className="lg:col-span-5 w-full order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassPanel className="p-8 w-full" variant="strong">
                <div className="mb-6">
                  <SectionTitle
                    title="Welcome To Z-Consult"
                    subtitle="Sign in to manage your clinic's appointments and staff queues efficiently."
                  />
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6  rounded-lg cursor-pointer">
                    <TabsTrigger
                      value="login"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer font-medium"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="rounded-lg  data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer font-medium"
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
          <div className="lg:col-span-7 flex flex-col gap-10 pt-4 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
                Appointments & Queues — <br />
                <span className="text-primary">Managed Effortlessly.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                A smart capacity management system designed for modern clinics.
                Handle staff availability, detect conflicts, and manage waiting
                queues in real-time without the chaos.
              </p>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                delay={0.3}
                icon={<CalendarCheck className="w-6 h-6 text-primary" />}
                title="Smart Scheduling"
                description="Book appointments with conflict detection. Never double-book a slot again."
              />
              <FeatureCard
                delay={0.4}
                icon={<Users className="w-6 h-6 text-primary" />}
                title="Staff Capacity"
                description="Set daily limits (e.g., 'Farhan 3/5'). Auto-lock staff when capacity is reached."
              />
              <FeatureCard
                delay={0.5}
                icon={<Clock className="w-6 h-6 text-primary" />}
                title="Live Queue"
                description="Manage walk-ins with a real-time waiting list. Assign patients to staff instantly."
              />
              <FeatureCard
                delay={0.6}
                icon={<BarChart3 className="w-6 h-6 text-primary" />}
                title="Dashboard Metrics"
                description="Track today's totals, active queues, and staff load at a glance."
              />
            </div>
          </div>
        </Wrapper>
      </main>

      <Footer />
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
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white/40 border border-white/60 dark:bg-white/5 dark:border-white/10 shadow-sm backdrop-blur-sm hover:shadow-md grid place-items-center text-center transition-all cursor-default"
    >
      <div className="mb-4 bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-normal">
        {description}
      </p>
    </motion.div>
  );
}
