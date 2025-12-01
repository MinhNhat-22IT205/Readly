import { useCallback, useRef, useState } from "react";
import { RichEditor } from "react-native-pell-rich-editor";

export interface UseRichTextEditorOptions {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onBlur?: () => void;
}

export const useRichTextEditor = ({
  initialContent = "",
  onContentChange,
  onBlur,
}: UseRichTextEditorOptions = {}) => {
  const richTextRef = useRef<RichEditor>(null);
  const [content, setContent] = useState(initialContent);
  const [isFocused, setIsFocused] = useState(false);

  const handleContentChange = useCallback(
    (text: string) => {
      setContent(text);
      onContentChange?.(text);
    },
    [onContentChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const setContentValue = useCallback((value: string) => {
    setContent(value);
    richTextRef.current?.setContentHTML(value);
  }, []);

  const getContent = useCallback(async () => {
    return new Promise<string>((resolve) => {
      richTextRef.current?.getContentHtml((html: string) => {
        resolve(html);
      });
    });
  }, []);

  const insertText = useCallback((text: string) => {
    richTextRef.current?.insertText(text);
  }, []);

  const insertHTML = useCallback((html: string) => {
    richTextRef.current?.insertHTML(html);
  }, []);

  const setBold = useCallback(() => {
    richTextRef.current?.setBold();
  }, []);

  const setItalic = useCallback(() => {
    richTextRef.current?.setItalic();
  }, []);

  const setUnderline = useCallback(() => {
    richTextRef.current?.setUnderline();
  }, []);

  const removeFormat = useCallback(() => {
    richTextRef.current?.removeFormat();
  }, []);

  const setHeading = useCallback((heading: 1 | 2 | 3 | 4 | 5 | 6) => {
    richTextRef.current?.setHeading(heading);
  }, []);

  const setParagraph = useCallback(() => {
    richTextRef.current?.setParagraph();
  }, []);

  const insertBulletsList = useCallback(() => {
    richTextRef.current?.insertBulletsList();
  }, []);

  const insertOrderedList = useCallback(() => {
    richTextRef.current?.insertOrderedList();
  }, []);

  const insertLink = useCallback((url: string, title?: string) => {
    richTextRef.current?.insertLink(url, title);
  }, []);

  const setTextColor = useCallback((color: string) => {
    richTextRef.current?.setTextColor(color);
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    richTextRef.current?.setBackgroundColor(color);
  }, []);

  const undo = useCallback(() => {
    richTextRef.current?.undo();
  }, []);

  const redo = useCallback(() => {
    richTextRef.current?.redo();
  }, []);

  return {
    richTextRef,
    content,
    isFocused,
    handleContentChange,
    handleFocus,
    handleBlur,
    setContentValue,
    getContent,
    insertText,
    insertHTML,
    setBold,
    setItalic,
    setUnderline,
    removeFormat,
    setHeading,
    setParagraph,
    insertBulletsList,
    insertOrderedList,
    insertLink,
    setTextColor,
    setBackgroundColor,
    undo,
    redo,
  };
};

