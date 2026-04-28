import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    ImageIcon,
    Highlighter,
} from 'lucide-react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-amber-600 hover:text-amber-700 underline',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-3',
            },
        },
    });

    // Update editor content when the content prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const MenuButton: React.FC<{
        onClick: () => void;
        active?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }> = ({ onClick, active, disabled, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-all duration-200 ${
                active
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border-2 border-gray-300 rounded-xl overflow-hidden focus-within:border-amber-500 transition-colors">
            {/* Toolbar */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-gray-200 p-3">
                <div className="flex flex-wrap gap-2">
                    {/* Text Formatting */}
                    <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm">
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive('bold')}
                            title="Bold (Ctrl+B)"
                        >
                            <Bold className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive('italic')}
                            title="Italic (Ctrl+I)"
                        >
                            <Italic className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            active={editor.isActive('underline')}
                            title="Underline (Ctrl+U)"
                        >
                            <UnderlineIcon className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            active={editor.isActive('strike')}
                            title="Strikethrough"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            active={editor.isActive('code')}
                            title="Inline Code"
                        >
                            <Code className="w-4 h-4" />
                        </MenuButton>
                    </div>

                    {/* Headings */}
                    <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm">
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            active={editor.isActive('heading', { level: 1 })}
                            title="Heading 1"
                        >
                            <Heading1 className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={editor.isActive('heading', { level: 2 })}
                            title="Heading 2"
                        >
                            <Heading2 className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            active={editor.isActive('heading', { level: 3 })}
                            title="Heading 3"
                        >
                            <Heading3 className="w-4 h-4" />
                        </MenuButton>
                    </div>

                    {/* Lists */}
                    <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm">
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={editor.isActive('bulletList')}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            active={editor.isActive('orderedList')}
                            title="Numbered List"
                        >
                            <ListOrdered className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            active={editor.isActive('blockquote')}
                            title="Quote"
                        >
                            <Quote className="w-4 h-4" />
                        </MenuButton>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm">
                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            active={editor.isActive({ textAlign: 'left' })}
                            title="Align Left"
                        >
                            <AlignLeft className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            active={editor.isActive({ textAlign: 'center' })}
                            title="Align Center"
                        >
                            <AlignCenter className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            active={editor.isActive({ textAlign: 'right' })}
                            title="Align Right"
                        >
                            <AlignRight className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            active={editor.isActive({ textAlign: 'justify' })}
                            title="Justify"
                        >
                            <AlignJustify className="w-4 h-4" />
                        </MenuButton>
                    </div>

                    {/* Media & Links */}
                    <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm">
                        <MenuButton onClick={setLink} active={editor.isActive('link')} title="Add Link">
                            <LinkIcon className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton onClick={addImage} title="Insert Image">
                            <ImageIcon className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            active={editor.isActive('highlight')}
                            title="Highlight"
                        >
                            <Highlighter className="w-4 h-4" />
                        </MenuButton>
                    </div>

                    {/* Undo/Redo */}
                    <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm ml-auto">
                        <MenuButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="w-4 h-4" />
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="w-4 h-4" />
                        </MenuButton>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};