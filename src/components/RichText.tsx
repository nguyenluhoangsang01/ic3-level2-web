import { isImageFile } from '../core/normalize';

interface Props {
  value: unknown;
  className?: string;
}

function hasHtml(value: string): boolean {
  return /<[^>]+>/.test(value);
}

export function RichText({ value, className }: Props) {
  const text = String(value ?? '').trim();

  if (!text) return null;

  if (isImageFile(text)) {
    return <img className={className ? `${className} rich-image` : 'rich-image'} src={text} alt="Nội dung hình ảnh" />;
  }

  if (hasHtml(text)) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  return <span className={className}>{text}</span>;
}
