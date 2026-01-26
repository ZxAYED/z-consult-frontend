'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface QueueItem {
    position: number;
    patientName: string;
    service: string;
    waitTime: string;
    status: 'Waiting' | 'In Progress';
}

const initialQueue: QueueItem[] = [
    { position: 1, patientName: 'Alice Wonderland', service: 'General Consultation', waitTime: '5 mins', status: 'In Progress' },
    { position: 2, patientName: 'Bob Builder', service: 'Checkup', waitTime: '15 mins', status: 'Waiting' },
    { position: 3, patientName: 'Charlie Chaplin', service: 'General Consultation', waitTime: '30 mins', status: 'Waiting' },
];

export default function QueuePage() {
    const [queue, setQueue] = useState<QueueItem[]>(initialQueue);

    const handleAssign = () => {
        const next = queue.find(q => q.status === 'Waiting');
        if (next) {
            setQueue(queue.map(q => q.position === next.position ? { ...q, status: 'In Progress' } : q));
            toast.success(`Assigned ${next.patientName} to staff`);
        } else {
            toast.info('No waiting patients in queue');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Queue Management</h2>
                <Button onClick={handleAssign} size="lg">
                    Assign From Queue
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Active Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Position</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Est. Wait</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queue.map((item) => (
                                    <TableRow key={item.position}>
                                        <TableCell className="font-medium text-lg">#{item.position}</TableCell>
                                        <TableCell>{item.patientName}</TableCell>
                                        <TableCell>{item.service}</TableCell>
                                        <TableCell>{item.waitTime}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'In Progress' ? 'default' : 'secondary'}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Queue Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center p-4 border rounded-lg bg-slate-50">
                            <div className="text-sm text-muted-foreground">Current Wait Time</div>
                            <div className="text-3xl font-bold text-slate-900">15 min</div>
                        </div>
                         <div className="text-center p-4 border rounded-lg bg-slate-50">
                            <div className="text-sm text-muted-foreground">Total Waiting</div>
                            <div className="text-3xl font-bold text-slate-900">
                                {queue.filter(q => q.status === 'Waiting').length}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
