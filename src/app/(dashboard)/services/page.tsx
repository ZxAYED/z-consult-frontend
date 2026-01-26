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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
    id: number;
    name: string;
    duration: number;
    price: number;
}

const initialServices: Service[] = [
    { id: 1, name: 'General Consultation', duration: 30, price: 50 },
    { id: 2, name: 'Follow-up', duration: 15, price: 30 },
];

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({ name: '', duration: '30', price: '0' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            duration: parseInt(formData.duration),
            price: parseFloat(formData.price)
        };

        if (editingService) {
            setServices(services.map(s => s.id === editingService.id ? { ...s, ...data } : s));
            toast.success('Service updated');
        } else {
            setServices([...services, { id: Date.now(), ...data }]);
            toast.success('Service created');
        }
        setIsDialogOpen(false);
        setEditingService(null);
        setFormData({ name: '', duration: '30', price: '0' });
    };

    const handleEdit = (s: Service) => {
        setEditingService(s);
        setFormData({ name: s.name, duration: s.duration.toString(), price: s.price.toString() });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        setServices(services.filter(s => s.id !== id));
        toast.success('Service deleted');
    };

    const openCreateDialog = () => {
        setEditingService(null);
        setFormData({ name: '', duration: '30', price: '0' });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Services</h2>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Duration (mins)</TableHead>
                            <TableHead>Price ($)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.duration}</TableCell>
                                <TableCell>{s.price}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">Service Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="duration">Duration (mins)</Label>
                                <Input 
                                    id="duration" 
                                    type="number"
                                    value={formData.duration} 
                                    onChange={e => setFormData({...formData, duration: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="price">Price</Label>
                                <Input 
                                    id="price" 
                                    type="number"
                                    value={formData.price} 
                                    onChange={e => setFormData({...formData, price: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                             <Button type="submit">{editingService ? 'Update' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
