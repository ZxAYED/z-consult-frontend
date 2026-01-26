'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, ListOrdered, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments (Today)
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Queue
            </CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Wait time ~15 mins
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Staff
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 Doctors, 1 Nurse
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Services Active
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Consultation, Checkup...
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Latest Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center">
                       <div className="ml-4 space-y-1">
                           <p className="text-sm font-medium leading-none">
                               New Appointment Created
                           </p>
                           <p className="text-sm text-muted-foreground">
                               John Doe for General Consultation
                           </p>
                       </div>
                       <div className="ml-auto font-medium">Just now</div>
                   </div>
               ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Staff Load</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Dr. Smith</p>
                            <p className="text-sm text-muted-foreground">5 appointments</p>
                        </div>
                        <div className="ml-auto font-medium">Busy</div>
                    </div>
                     <div className="flex items-center">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Dr. Jones</p>
                            <p className="text-sm text-muted-foreground">2 appointments</p>
                        </div>
                        <div className="ml-auto font-medium text-green-500">Available</div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
