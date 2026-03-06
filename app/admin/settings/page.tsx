'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, IndianRupee, Globe, Shield, Bell, CreditCard, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);

    const [general, setGeneral] = useState({
        appName: 'Ek Bhavishya',
        tagline: 'Jo Badal de apke zindagi',
        supportEmail: 'support@ekbhavishya.in',
        supportPhone: '+91 1800-XXX-XXXX',
        websiteUrl: 'https://ekbhavishya.in',
    });

    const [commission, setCommission] = useState({
        callCommission: 25,
        chatCommission: 25,
        videoCommission: 30,
        productCommission: 10,
        remedyCommission: 20,
        courseCommission: 15,
    });

    const [freeMinutes, setFreeMinutes] = useState({
        newUserFreeMinutes: 5,
        referralBonusMinutes: 3,
        expiryDays: 30,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        lowWalletAlert: true,
        newOrderAlert: true,
        withdrawalAlert: true,
    });

    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const handleSave = (section: string) => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success(`${section} settings saved!`);
        }, 800);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Commission</h2>
                <p className="text-muted-foreground mt-1">Configure platform-wide commission rates.</p>
            </div>

            <Tabs defaultValue="commission" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="commission"><IndianRupee className="h-4 w-4 mr-1.5" />Commission</TabsTrigger>
                </TabsList>

                {/* Commission */}
                <TabsContent value="commission" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Commission Rates (%)</CardTitle>
                            <CardDescription>Platform commission deducted from each service</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(commission).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="capitalize">{key.replace('Commission', ' Commission')}</Label>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" min="0" max="100" value={value} onChange={e => setCommission({ ...commission, [key]: +e.target.value })} />
                                            <span className="text-sm font-bold text-muted-foreground">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={saving} onClick={() => handleSave('Commission')}>
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save Commission Rates
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
