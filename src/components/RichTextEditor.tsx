import React, { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  uploadPath?: string; // Next API route for image upload
  className?: string;
};

export default function RichTextEditor({ value, onChange, uploadPath = '/api/app/blog/upload', className = '' }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [html, setHtml] = useState<string>(value || '');

  useEffect(() => setHtml(value || ''), [value]);

  const emitChange = () => {
    const next = editorRef.current?.innerHTML || '';
    setHtml(next);
    onChange(next);
  };

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    emitChange();
  };

  const insertLink = () => {
    const url = prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  const insertImage = async (file: File) => {
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(uploadPath, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
        body: form,
      } as any);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.url;
      if (!url) return;
      // Insert using execCommand
      exec('insertImage', url);
    } catch {}
  };

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-800">
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => exec('bold')}>B</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 italic" onClick={() => exec('italic')}>I</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 underline" onClick={() => exec('underline')}>U</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => exec('formatBlock', 'H2')}>H2</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => exec('formatBlock', 'H3')}>H3</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => exec('formatBlock', 'BLOCKQUOTE')}>❝ Quote</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={insertLink}>🔗 Link</button>
        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700" onClick={() => fileRef.current?.click()}>🖼️ Image</button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) insertImage(f); if (fileRef.current) fileRef.current.value=''; }} />
      </div>
      <div
        ref={editorRef}
        className="min-h-[200px] p-3 focus:outline-none prose prose-invert max-w-none text-left"
        style={{ direction: 'ltr' as any }}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
