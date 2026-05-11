'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { submitPartnerApplication } from '@/app/actions/partners';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PartnerApplicationPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', altPhone: '',
        referralCode: '',
        city: '', state: '', address: '', pincode: '',
        canAddSubPartners: false, designationAccess: false,
        bankName: '', branchName: '', accountHolder: '',
        accountNumber: '', ifscCode: '', accountType: 'Savings' as const,
        aadhaarNumber: '', panNumber: '',
    });

    const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        if (!form.name || !form.email || !form.phone || !form.referralCode) {
            toast.error('Please fill required fields'); return;
        }
        setSaving(true);
        const res = await submitPartnerApplication({
            name: form.name, email: form.email, phone: form.phone,
            altPhone: form.altPhone,
            referralCode: form.referralCode,
            city: form.city, state: form.state, address: form.address, pincode: form.pincode,
            canAddSubPartners: form.canAddSubPartners, designationAccess: form.designationAccess,
            aadhaarNumber: form.aadhaarNumber, panNumber: form.panNumber,
            bankDetails: form.bankName ? {
                bankName: form.bankName, branchName: form.branchName,
                accountHolder: form.accountHolder, accountNumber: form.accountNumber,
                ifscCode: form.ifscCode, accountType: form.accountType,
            } : undefined,
        });
        if (res.success) { 
            toast.success('Your application has been submitted successfully! We will review it and get back to you.'); 
            router.push('/'); 
        }
        else { toast.error(res.error || 'Failed to submit application'); }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Area */}
            <div className="bg-primary py-12 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Become a Partner
                    </h1>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                        Join our network and help us coordinate comprehensive healthcare services. Fill out the application below to get started.
                    </p>
                </div>
            </div>

            <div className="space-y-6 py-12 px-4 max-w-4xl mx-auto animate-in fade-in">
                {/* Basic Details */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base text-slate-700">Partner Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label className="text-slate-600">Partner Name *</Label><Input value={form.name} onChange={e => update('name', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Email *</Label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Phone *</Label><Input value={form.phone} onChange={e => update('phone', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Alt Phone</Label><Input value={form.altPhone} onChange={e => update('altPhone', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Referral Code *</Label><Input value={form.referralCode} onChange={e => update('referralCode', e.target.value)} placeholder="e.g. YOURNAME123" className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base text-slate-700">Address</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2"><Label className="text-slate-600">Address</Label><Input value={form.address} onChange={e => update('address', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">City</Label><Input value={form.city} onChange={e => update('city', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">State</Label><Input value={form.state} onChange={e => update('state', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Pincode</Label><Input value={form.pincode} onChange={e => update('pincode', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                    </CardContent>
                </Card>

                {/* Bank Details */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base text-slate-700">Bank Details (for Payout)</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label className="text-slate-600">Bank Name</Label><Input value={form.bankName} onChange={e => update('bankName', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Branch Name</Label><Input value={form.branchName} onChange={e => update('branchName', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Account Holder Name</Label><Input value={form.accountHolder} onChange={e => update('accountHolder', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">Account Number</Label><Input value={form.accountNumber} onChange={e => update('accountNumber', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">IFSC Code</Label><Input value={form.ifscCode} onChange={e => update('ifscCode', e.target.value)} className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div>
                            <Label className="text-slate-600">Account Type</Label>
                            <Select value={form.accountType} onValueChange={v => update('accountType', v)}>
                                <SelectTrigger className="bg-white border-slate-200 text-slate-700 mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-700">
                                    <SelectItem value="Savings">Savings</SelectItem>
                                    <SelectItem value="Current">Current</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base text-slate-700">Capabilities</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox id="subpartners" checked={form.canAddSubPartners} onCheckedChange={v => update('canAddSubPartners', v)} />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="subpartners" className="text-sm font-medium text-slate-800 cursor-pointer">Allow Sub-Partners</Label>
                                <p className="text-xs text-slate-400">I plan to add and manage my own sub-partner network.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="designation" checked={form.designationAccess} onCheckedChange={v => update('designationAccess', v)} />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="designation" className="text-sm font-medium text-slate-800 cursor-pointer">Designation Access</Label>
                                <p className="text-xs text-slate-400">I need to assign designations and manage access for my team.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KYC Details */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base text-slate-700">KYC Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label className="text-slate-600">Aadhaar Number</Label><Input value={form.aadhaarNumber} onChange={e => update('aadhaarNumber', e.target.value)} placeholder="XXXX XXXX XXXX" className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                        <div><Label className="text-slate-600">PAN Number</Label><Input value={form.panNumber} onChange={e => update('panNumber', e.target.value)} placeholder="ABCDE1234F" className="bg-white border-slate-200 text-slate-900 mt-1" /></div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" className="border-slate-200 text-slate-600" onClick={() => router.push('/')}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-8">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Submit Application
                    </Button>
                </div>
            </div>
        </div>
    );
}
