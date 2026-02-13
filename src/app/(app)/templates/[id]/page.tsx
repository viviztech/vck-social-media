import { TEMPLATES } from '@/lib/templates-data';
import TemplateEditor from './editor';

// Generate all template pages at build time for static export
export function generateStaticParams() {
    return TEMPLATES.map((t) => ({ id: t.id }));
}

export default function TemplateEditorPage() {
    return <TemplateEditor />;
}
