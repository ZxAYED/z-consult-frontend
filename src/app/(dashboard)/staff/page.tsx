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

interface Staff {
    id: number;
    name: string;
    role: string;
    email: string;
    status: string;
}

const initialStaff: Staff[] = [
    { id: 1, name: 'Dr. Smith', role: 'Doctor', email: 'smith@example.com', status: 'Active' },
    { id: 2, name: 'Nurse Joy', role: 'Nurse', email: 'joy@example.com', status: 'Active' },
];

export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>(initialStaff);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const [formData, setFormData] = useState({ name: '', role: '', email: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStaff) {
            setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
            toast.success('Staff updated');
        } else {
            setStaff([...staff, { id: Date.now(), ...formData, status: 'Active' }]);
            toast.success('Staff created');
        }
        setIsDialogOpen(false);
        setEditingStaff(null);
        setFormData({ name: '', role: '', email: '' });
    };

    const handleEdit = (s: Staff) => {
        setEditingStaff(s);
        setFormData({ name: s.name, role: s.role, email: s.email });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        setStaff(staff.filter(s => s.id !== id));
        toast.success('Staff deleted');
    };

    const openCreateDialog = () => {
        setEditingStaff(null);
        setFormData({ name: '', role: '', email: '' });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.role}</TableCell>
                                <TableCell>{s.email}</TableCell>
                                <TableCell>{s.status}</TableCell>
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
                        <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="role">Role</Label>
                            <Input 
                                id="role" 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email"
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                             <Button type="submit">{editingStaff ? 'Update' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
