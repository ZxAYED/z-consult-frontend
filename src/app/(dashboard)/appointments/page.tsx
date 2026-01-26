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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
    id: number;
    patientName: string;
    date: Date;
    staff: string;
    service: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const initialAppointments: Appointment[] = [
    { id: 1, patientName: 'John Doe', date: new Date(), staff: 'Dr. Smith', service: 'General Consultation', status: 'Scheduled' },
    { id: 2, patientName: 'Jane Smith', date: new Date(), staff: 'Nurse Joy', service: 'Checkup', status: 'Completed' },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    const [formData, setFormData] = useState({ patientName: '', staff: '', service: '' });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setAppointments([
            ...appointments, 
            { 
                id: Date.now(), 
                patientName: formData.patientName, 
                date: date || new Date(), 
                staff: formData.staff, 
                service: formData.service,
                status: 'Scheduled'
            }
        ]);
        toast.success('Appointment scheduled');
        setIsDialogOpen(false);
        setFormData({ patientName: '', staff: '', service: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appt) => (
                            <TableRow key={appt.id}>
                                <TableCell>{format(appt.date, 'MMM d, yyyy')}</TableCell>
                                <TableCell className="font-medium">{appt.patientName}</TableCell>
                                <TableCell>{appt.service}</TableCell>
                                <TableCell>{appt.staff}</TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        appt.status === 'Scheduled' ? "bg-blue-100 text-blue-800" :
                                        appt.status === 'Completed' ? "bg-green-100 text-green-800" :
                                        "bg-gray-100 text-gray-800"
                                    )}>
                                        {appt.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Appointment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input 
                                id="patientName" 
                                value={formData.patientName} 
                                onChange={e => setFormData({...formData, patientName: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="staff">Staff</Label>
                             <Select onValueChange={v => setFormData({...formData, staff: v})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Staff" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                                    <SelectItem value="Nurse Joy">Nurse Joy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="service">Service</Label>
                             <Select onValueChange={v => setFormData({...formData, service: v})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General Consultation">General Consultation</SelectItem>
                                    <SelectItem value="Checkup">Checkup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                             <Button type="submit">Create</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
