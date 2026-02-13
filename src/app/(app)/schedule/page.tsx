'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/templates-data';
import Link from 'next/link';
import {
    Calendar, Clock, ChevronLeft, ChevronRight, Plus,
    Send, Trash2, Edit3, CheckCircle, AlertCircle,
    Loader2, CalendarDays, ListTodo, LayoutGrid,
    Palette, ArrowRight, Timer, Zap,
} from 'lucide-react';

interface QueuedPost {
    id: string;
    templateId: string;
    templateName: string;
    caption: string;
    platforms: string[];
    scheduledAt: string;
    status: 'queued' | 'scheduled' | 'published' | 'failed';
}

export default function SchedulePage() {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [queue, setQueue] = useState<QueuedPost[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('vck_post_queue');
            if (saved) try { return JSON.parse(saved); } catch { /**/ }
        }
        return [];
    });

    // Batch schedule state
    const [showBatch, setShowBatch] = useState(false);
    const [batchTemplate, setBatchTemplate] = useState('');
    const [batchCaption, setBatchCaption] = useState('');
    const [batchPlatforms, setBatchPlatforms] = useState<string[]>(['facebook']);
    const [batchDates, setBatchDates] = useState<string[]>(['']);
    const [batchTime, setBatchTime] = useState('09:00');

    const saveQueue = useCallback((newQueue: QueuedPost[]) => {
        setQueue(newQueue);
        localStorage.setItem('vck_post_queue', JSON.stringify(newQueue));
    }, []);

    // Calendar helpers
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const postsForDay = useCallback((day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return queue.filter(p => p.scheduledAt.startsWith(dateStr));
    }, [queue, year, month]);

    const isToday = (day: number) => {
        const today = new Date();
        return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-500';
            case 'queued': return 'bg-blue-500';
            case 'scheduled': return 'bg-purple-500';
            case 'failed': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const removeFromQueue = (id: string) => {
        saveQueue(queue.filter(p => p.id !== id));
    };

    const handleBatchSchedule = () => {
        if (!batchTemplate) return;
        const tmpl = TEMPLATES.find(t => t.id === batchTemplate);
        if (!tmpl) return;

        const validDates = batchDates.filter(d => d.trim() !== '');
        if (validDates.length === 0) return;

        const newPosts: QueuedPost[] = validDates.map(date => ({
            id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            templateId: tmpl.id,
            templateName: tmpl.name,
            caption: batchCaption,
            platforms: batchPlatforms,
            scheduledAt: `${date}T${batchTime}:00`,
            status: 'queued',
        }));

        saveQueue([...queue, ...newPosts]);
        setShowBatch(false);
        setBatchTemplate('');
        setBatchCaption('');
        setBatchDates(['']);
    };

    const stats = useMemo(() => ({
        total: queue.length,
        queued: queue.filter(p => p.status === 'queued').length,
        published: queue.filter(p => p.status === 'published').length,
        failed: queue.filter(p => p.status === 'failed').length,
    }), [queue]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarDays className="h-6 w-6 text-primary" />
                        Post Schedule
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Queue and schedule multiple posts across your calendar.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}>
                        {viewMode === 'calendar' ? <ListTodo className="h-4 w-4 mr-1" /> : <LayoutGrid className="h-4 w-4 mr-1" />}
                        {viewMode === 'calendar' ? 'List View' : 'Calendar'}
                    </Button>
                    <Button onClick={() => setShowBatch(true)}>
                        <Plus className="h-4 w-4 mr-1" /> Batch Schedule
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {[
                    { label: 'Total Queued', value: stats.total, icon: ListTodo, color: 'text-blue-500' },
                    { label: 'Pending', value: stats.queued, icon: Clock, color: 'text-yellow-500' },
                    { label: 'Published', value: stats.published, icon: CheckCircle, color: 'text-green-500' },
                    { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-red-500' },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-4 flex items-center gap-3">
                            <s.icon className={`h-5 w-5 ${s.color}`} />
                            <div>
                                <div className="text-2xl font-bold">{s.value}</div>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Batch Schedule Modal */}
            {showBatch && (
                <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Batch Schedule Posts
                        </CardTitle>
                        <CardDescription>
                            Select a template and add multiple dates to queue posts at once.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Template</Label>
                                <Select value={batchTemplate} onValueChange={setBatchTemplate}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TEMPLATES.map(t => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name} ({t.name_ta})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Time</Label>
                                <Input
                                    type="time"
                                    value={batchTime}
                                    onChange={e => setBatchTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Caption</Label>
                            <Input
                                value={batchCaption}
                                onChange={e => setBatchCaption(e.target.value)}
                                placeholder="Caption for all posts... #VCK"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Platforms</Label>
                            <div className="flex gap-3">
                                {['facebook', 'instagram'].map(p => (
                                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={batchPlatforms.includes(p)}
                                            onChange={e => {
                                                if (e.target.checked) setBatchPlatforms([...batchPlatforms, p]);
                                                else setBatchPlatforms(batchPlatforms.filter(x => x !== p));
                                            }}
                                            className="h-4 w-4 rounded accent-primary"
                                        />
                                        <span className="text-sm capitalize">{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Dates</Label>
                            {batchDates.map((date, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={e => {
                                            const nd = [...batchDates];
                                            nd[i] = e.target.value;
                                            setBatchDates(nd);
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {batchDates.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => setBatchDates(batchDates.filter((_, j) => j !== i))}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setBatchDates([...batchDates, ''])}>
                                <Plus className="h-3 w-3 mr-1" /> Add Date
                            </Button>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleBatchSchedule} disabled={!batchTemplate || batchDates.every(d => !d)}>
                                <Calendar className="h-4 w-4 mr-1" />
                                Queue {batchDates.filter(d => d).length} Post{batchDates.filter(d => d).length !== 1 ? 's' : ''}
                            </Button>
                            <Button variant="outline" onClick={() => setShowBatch(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <Card className="border-border/50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{monthName}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
                                <Button variant="ghost" size="icon" onClick={prevMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-px mb-1">
                            {weekDays.map(d => (
                                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                            ))}
                        </div>

                        {/* Day grid */}
                        <div className="grid grid-cols-7 gap-px">
                            {/* Empty cells for offset */}
                            {Array.from({ length: firstDayOfWeek }, (_, i) => (
                                <div key={`empty-${i}`} className="min-h-[80px] bg-muted/20 rounded-lg" />
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const day = i + 1;
                                const dayPosts = postsForDay(day);
                                const today = isToday(day);

                                return (
                                    <div
                                        key={day}
                                        className={`min-h-[80px] p-1.5 rounded-lg border transition-colors ${today
                                            ? 'border-primary bg-primary/5'
                                            : 'border-transparent hover:border-border/50 hover:bg-muted/20'
                                            }`}
                                    >
                                        <div className={`text-xs font-medium mb-1 ${today ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {day}
                                        </div>
                                        <div className="space-y-0.5">
                                            {dayPosts.slice(0, 3).map(post => (
                                                <div
                                                    key={post.id}
                                                    className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${statusColor(post.status)}`}
                                                    title={`${post.templateName} — ${post.status}`}
                                                >
                                                    {post.templateName}
                                                </div>
                                            ))}
                                            {dayPosts.length > 3 && (
                                                <div className="text-[10px] text-muted-foreground px-1">
                                                    +{dayPosts.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ListTodo className="h-5 w-5 text-primary" />
                            Scheduled Queue ({queue.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {queue.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground">No scheduled posts</h3>
                                <p className="text-sm text-muted-foreground/70 mb-4">
                                    Use Batch Schedule or add posts from the Create Post page.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => setShowBatch(true)}>
                                        <Plus className="h-4 w-4 mr-1" /> Batch Schedule
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/templates">Browse Templates</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {queue.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).map(post => (
                                    <div
                                        key={post.id}
                                        className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                                    >
                                        <div className={`h-2 w-2 rounded-full ${statusColor(post.status)}`} />
                                        <div className="p-2 rounded-lg bg-muted/50">
                                            <Palette className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{post.templateName}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {new Date(post.scheduledAt).toLocaleString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {post.platforms.map(p => (
                                                <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                                            ))}
                                            <Badge
                                                className={`text-[10px] ${post.status === 'queued'
                                                    ? 'bg-blue-500/10 text-blue-600'
                                                    : post.status === 'published'
                                                        ? 'bg-green-500/10 text-green-600'
                                                        : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {post.status}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeFromQueue(post.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center">
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Queued
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Scheduled
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Published
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Failed
                </span>
            </div>
        </div>
    );
}
