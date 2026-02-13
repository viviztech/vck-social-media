'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslation, LANGUAGES, Language } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    User,
    Camera,
    Save,
    Loader2,
    MapPin,
    Phone,
    Mail,
    Shield,
    Languages,
} from 'lucide-react';

const DISTRICTS = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul',
    'Kanchipuram', 'Cuddalore', 'Villupuram', 'Nagapattinam',
    'Sivaganga', 'Virudhunagar', 'Ramanathapuram', 'Theni',
    'Tiruvarur', 'Perambalur', 'Ariyalur', 'Nilgiris',
    'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Karur',
    'Tiruvannamalai', 'Pudukkottai', 'Thoothukudi', 'Kanyakumari',
    'Ranipet', 'Tirupathur', 'Chengalpattu', 'Kallakurichi',
    'Tenkasi', 'Mayiladuthurai',
];

const PARTY_ROLES = [
    'Member', 'Ward Secretary', 'Town Secretary', 'District Secretary',
    'District President', 'State Committee Member', 'Youth Wing',
    'Women Wing', 'IT Wing', 'Student Wing', 'Volunteer',
];

export default function ProfilePage() {
    const { profile, updateProfile, user } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [name, setName] = useState(profile?.name || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [designation, setDesignation] = useState(profile?.designation || '');
    const [constituency, setConstituency] = useState(profile?.constituency || '');
    const [district, setDistrict] = useState(profile?.district || '');
    const [partyRole, setPartyRole] = useState(profile?.party_role || '');

    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'VK';

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast.success('Photo selected! Save profile to upload.');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const { error } = await updateProfile({
            name,
            phone,
            designation,
            constituency,
            district,
            party_role: partyRole,
        });
        setLoading(false);

        if (error) {
            toast.error(error);
        } else {
            toast.success(t('profile.saved'));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <User className="h-6 w-6 text-primary" />
                    {t('profile.title')}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t('profile.subtitle')}
                </p>
            </div>

            {/* Photo Section */}
            <Card className="border-border/50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-primary/20">
                                <AvatarImage src={photoPreview || profile?.profile_photo_url || undefined} alt={name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                aria-label="Change photo"
                            >
                                <Camera className="h-6 w-6 text-white" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{name || 'Your Name'}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user?.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {profile?.role || 'Member'}
                                </Badge>
                                {partyRole && (
                                    <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                                        {partyRole}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Language Preference */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Languages className="h-5 w-5 text-primary" />
                        {t('profile.language_preference')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, label]) => (
                            <Button
                                key={code}
                                variant={language === code ? 'default' : 'outline'}
                                size="lg"
                                onClick={() => setLanguage(code)}
                                className="flex-1"
                            >
                                <span className="text-lg mr-2">{code === 'ta' ? '🇮🇳' : '🇬🇧'}</span>
                                {label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg">{t('profile.personal_info')}</CardTitle>
                    <CardDescription>{t('profile.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="prof-name">{t('profile.name')}</Label>
                            <Input
                                id="prof-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prof-phone">{t('profile.phone')}</Label>
                            <Input
                                id="prof-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prof-designation">{t('profile.designation')}</Label>
                        <Input
                            id="prof-designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g. Municipal Councillor, MLA, Ward Member"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Party Details */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {t('profile.constituency')} & {t('profile.party_role')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="prof-constituency">{t('profile.constituency')}</Label>
                            <Input
                                id="prof-constituency"
                                value={constituency}
                                onChange={(e) => setConstituency(e.target.value)}
                                placeholder="e.g. Chidambaram, Villupuram"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prof-district">{t('profile.district')}</Label>
                            <Select value={district} onValueChange={setDistrict}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DISTRICTS.map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prof-role">{t('profile.party_role')}</Label>
                        <Select value={partyRole} onValueChange={setPartyRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {PARTY_ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading} size="lg">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('profile.saving')}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {t('profile.save_changes')}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
