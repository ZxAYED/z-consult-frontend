'use client';

import { GlassPanel } from '@/components/shared/glass';
import { Users, Calendar, ListOrdered, Activity, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Appointments"
            value="12"
            subtitle="+2 from yesterday"
            icon={<Calendar className="h-5 w-5 text-primary" />}
        />
        <StatCard 
            title="Active Queue"
            value="5"
            subtitle="Wait time ~15 mins"
            icon={<ListOrdered className="h-5 w-5 text-primary" />}
        />
        <StatCard 
            title="Active Staff"
            value="3"
            subtitle="2 Doctors, 1 Nurse"
            icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard 
            title="Services Active"
            value="4"
            subtitle="Consultation, Checkup..."
            icon={<Activity className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <GlassPanel className="col-span-4 p-6" variant="soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Latest Activity</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
             {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-start gap-4 group">
                     <div className="w-2 h-2 mt-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                     <div className="flex-1 space-y-1">
                         <p className="text-sm font-medium leading-none">
                             New Appointment Created
                         </p>
                         <p className="text-xs text-muted-foreground">
                             John Doe for General Consultation
                         </p>
                     </div>
                     <div className="text-xs text-muted-foreground font-medium">Just now</div>
                 </div>
             ))}
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-3 p-6" variant="soft">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Staff Load</h3>
            </div>
            <div className="space-y-6">
                <StaffLoadItem name="Dr. Smith" role="Doctor" count={5} max={8} status="Busy" />
                <StaffLoadItem name="Dr. Jones" role="Doctor" count={2} max={8} status="Available" />
                <StaffLoadItem name="Nurse Joy" role="Nurse" count={4} max={5} status="Active" />
            </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string, value: string, subtitle: string, icon: React.ReactNode }) {
    return (
        <motion.div variants={item}>
            <GlassPanel className="p-6 hover:shadow-md transition-shadow cursor-default relative overflow-hidden group" variant="soft">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        {title}
                    </h3>
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {subtitle}
                    </p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            </GlassPanel>
        </motion.div>
    )
}

function StaffLoadItem({ name, role, count, max, status }: { name: string, role: string, count: number, max: number, status: string }) {
    const percentage = (count / max) * 100;
    
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {name[0]}
            </div>
            <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                    <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        status === 'Busy' ? "bg-orange-100 text-orange-700" :
                        status === 'Available' ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                    )}>{status}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }} 
                    />
                </div>
            </div>
        </div>
    )
}

// Helper to avoid circular dependency in client component if utils not imported
import { cn } from '@/lib/utils';
