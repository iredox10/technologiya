import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiCode, 
  FiList, 
  FiLink, 
  FiImage,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiUpload,
  FiLoader
} from 'react-icons/fi';
import { storageService } from '../../lib/appwriteServices';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Rubuta abu a nan...' }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg w-full h-auto object-contain',
        },
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  });

  // Update editor content when the content prop changes (for editing mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Sanya URL ɗin hoton:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showErrorToast('Da fatan za a zaɓi hoton kawai');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showErrorToast('Hoton ya yi girma da yawa. Matsakaicin girman shine 10MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const bucketId = import.meta.env.PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES;
      const uploadResult = await storageService.uploadFile(bucketId, file);
      
      if (uploadResult.success && uploadResult.data) {
        const imageUrl = storageService.getFileView(bucketId, uploadResult.data.$id);
        editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
        showSuccessToast('An loda hoton cikin nasara!');
      } else {
        showErrorToast('An samu kuskure wajen loda hoton');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showErrorToast('An samu kuskure wajen loda hoton');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Sanya URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    icon: Icon,
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
        {/* Text Formatting */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            icon={FiBold}
            title="Ƙarfafa"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            icon={FiItalic}
            title="Karkata"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={FiUnderline}
            title="Laka"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            icon={FiCode}
            title="Code"
          />
        </div>

        {/* Headings */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            type="button"
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            type="button"
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={FiList}
            title="Jerin abubuwa"
          />
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type="button"
            className={`p-2 rounded text-sm font-mono transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Jerin lambobi"
          >
            1,2,3
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={FiAlignLeft}
            title="Daidaita hagu"
          />
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={FiAlignCenter}
            title="Daidaita tsakiya"
          />
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={FiAlignRight}
            title="Daidaita dama"
          />
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            icon={FiAlignJustify}
            title="Daidaita duka"
          />
        </div>

        {/* Insert */}
        <div className="flex items-center space-x-1">
          <MenuButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            icon={FiLink}
            title="Saka haɗi"
          />
          <MenuButton
            onClick={addImage}
            icon={FiImage}
            title="Saka hoto daga URL"
          />
          <MenuButton
            onClick={openFilePicker}
            disabled={isUploading}
            icon={isUploading ? FiLoader : FiUpload}
            title="Loda hoto daga na'urar ka"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLocalImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px]" />
    </div>
  );
}
