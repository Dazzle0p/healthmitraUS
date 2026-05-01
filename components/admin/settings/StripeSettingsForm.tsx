'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Save, Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getStripeSettings, updateStripeSettings } from '@/app/actions/settings';

export default function StripeSettingsForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [enabled, setEnabled] = useState(false);
    const [publishableKey, setPublishableKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [webhookSecret, setWebhookSecret] = useState('');

    // UI State
    const [showSecret, setShowSecret] = useState(false);
    const [showWebhook, setShowWebhook] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const res = await getStripeSettings();
                if (res.success && res.data) {
                    setEnabled(res.data.stripe_enabled === 'true');
                    setPublishableKey(res.data.stripe_publishable_key || '');
                    setWebhookSecret(res.data.stripe_webhook_secret || '');
                }
            } catch (error) {
                console.error("Load error", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (enabled && !publishableKey.trim()) {
                toast.error("Publishable Key is required when Stripe is enabled");
                setSaving(false);
                return;
            }

            const secretToSave = secretKey.includes('***') || !secretKey ? null : secretKey;
            const webhookToSave = webhookSecret.includes('***') || !webhookSecret ? null : webhookSecret;

            const res = await updateStripeSettings({
                publishableKey,
                secretKey: secretToSave,
                webhookSecret: webhookToSave,
                enabled: enabled
            });

            if (res.success) {
                toast.success("Settings Saved", { description: "Stripe configuration updated successfully." });
                setSecretKey(''); // Clear after save
            } else {
                toast.error("Save Failed", { description: res.error });
            }
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600/10 rounded-lg">
                            <CreditCard className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Stripe Configuration</CardTitle>
                            <CardDescription>Configure Stripe to accept global payments</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg">
                        <Label htmlFor="stripe-toggle" className="text-sm font-medium">Enable</Label>
                        <Switch
                            id="stripe-toggle"
                            checked={enabled}
                            onCheckedChange={setEnabled}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className={`p-4 rounded-lg border ${
                        enabled 
                            ? 'bg-indigo-50 border-indigo-200' 
                            : 'bg-slate-50 border-slate-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            {enabled ? (
                                <CheckCircle className="h-5 w-5 text-indigo-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-slate-400" />
                            )}
                            <div>
                                <p className={`font-medium ${enabled ? 'text-indigo-800' : 'text-slate-600'}`}>
                                    {enabled ? 'Stripe is Active' : 'Stripe is Disabled'}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {enabled 
                                        ? 'Payments are currently being accepted'
                                        : 'Toggle above to enable payment processing'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {enabled && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="stripe-pk">Publishable Key</Label>
                                <Input
                                    id="stripe-pk"
                                    placeholder="pk_test_xxxxxxxxxxxxxx"
                                    value={publishableKey}
                                    onChange={(e) => setPublishableKey(e.target.value)}
                                    className="font-mono bg-slate-50 border-slate-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stripe-sk">Secret Key</Label>
                                <div className="relative">
                                    <Input
                                        id="stripe-sk"
                                        type={showSecret ? "text" : "password"}
                                        placeholder={secretKey ? "••••••••••••" : "Enter Secret Key"}
                                        value={secretKey}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        className="font-mono bg-slate-50 border-slate-200 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stripe-wh">Webhook Secret (Optional)</Label>
                                <div className="relative">
                                    <Input
                                        id="stripe-wh"
                                        type={showWebhook ? "text" : "password"}
                                        placeholder={webhookSecret ? "••••••••••••" : "Enter Webhook Secret"}
                                        value={webhookSecret}
                                        onChange={(e) => setWebhookSecret(e.target.value)}
                                        className="font-mono bg-slate-50 border-slate-200 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowWebhook(!showWebhook)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showWebhook ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <Button 
                            type="submit" 
                            disabled={saving} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
