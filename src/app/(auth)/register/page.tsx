'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

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

export default function RegisterPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Step 1 fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Step 2 fields
    const [designation, setDesignation] = useState('');
    const [constituency, setConstituency] = useState('');
    const [district, setDistrict] = useState('');
    const [partyRole, setPartyRole] = useState('');

    const handleStep1 = () => {
        if (!name || !email || !phone || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signUp(email, password, name, phone);
        setLoading(false);

        if (error) {
            toast.error(error);
        } else {
            toast.success('Account created! Please check your email to verify.');
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 vck-gradient opacity-5" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

            <Card className="w-full max-w-md relative border-border/50 shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl vck-gradient shadow-lg">
                            <span className="text-xl font-bold text-white">V</span>
                        </div>
                    </Link>
                    <CardTitle className="text-2xl">Join VCK Social</CardTitle>
                    <CardDescription>
                        {step === 1 ? 'Create your account' : 'Tell us about your party role'}
                    </CardDescription>
                    {/* Progress */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className={`h-2 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-2 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {step === 1 ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-phone">Phone Number</Label>
                                    <Input
                                        id="reg-phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="reg-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="button" className="w-full" onClick={handleStep1}>
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation / Title</Label>
                                    <Input
                                        id="designation"
                                        placeholder="e.g. Municipal Councillor, MLA"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="constituency">Constituency</Label>
                                    <Input
                                        id="constituency"
                                        placeholder="e.g. Chidambaram, Villupuram"
                                        value={constituency}
                                        onChange={(e) => setConstituency(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="district">District</Label>
                                    <Select value={district} onValueChange={setDistrict}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DISTRICTS.map((d) => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="partyRole">Party Role</Label>
                                    <Select value={partyRole} onValueChange={setPartyRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PARTY_ROLES.map((r) => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                        )}
                                        {loading ? 'Creating...' : 'Create Account'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
