import { extractImgSrc, isImageFile, stripImgTags } from '../core/media';

interface Props {
  value: unknown;
  className?: string;
}

function hasHtml(value: string) {
  return /<[^>]+>/.test(value);
}

export function RichContent({ value, className = '' }: Props) {
  const text = String(value ?? '').trim();
  if (!text) return null;

  if (!hasHtml(text) && isImageFile(text)) {
    return (
      <div className={`rich-content image-only ${className}`}>
        <img src={text} alt="Nội dung hình ảnh" loading="lazy" />
      </div>
    );
  }

  const imgSrc = extractImgSrc(text);
  const textWithoutImg = imgSrc ? stripImgTags(text) : text;

  return (
    <div className={`rich-content ${className}`}>
      {textWithoutImg ? <div dangerouslySetInnerHTML={{ __html: textWithoutImg }} /> : null}
      {imgSrc ? <img src={imgSrc} alt="Nội dung hình ảnh" loading="lazy" /> : null}
    </div>
  );
}
