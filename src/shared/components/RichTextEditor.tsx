import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import {
  useRichTextEditor,
  UseRichTextEditorOptions,
} from "../hooks/useRichTextEditor";

export interface RichTextEditorProps extends UseRichTextEditorOptions {
  placeholder?: string;
  containerStyle?: object;
  editorStyle?: object;
  showToolbar?: boolean;
  toolbarStyle?: object;
  disabled?: boolean;
  minHeight?: number;
  initialHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = "",
  placeholder = "Nhập nội dung...",
  containerStyle,
  editorStyle,
  showToolbar = true,
  toolbarStyle,
  disabled = false,
  minHeight = 150,
  initialHeight = 200,
  onContentChange,
  onBlur,
}) => {
  const {
    richTextRef,
    content,
    handleContentChange,
    handleFocus,
    handleBlur,
    setContentValue,
  } = useRichTextEditor({
    initialContent,
    onContentChange,
    onBlur,
  });

  const previousInitialContentRef = useRef<string>(initialContent);

  useEffect(() => {
    // Only update if initialContent changed from outside (not from internal edits)
    if (
      previousInitialContentRef.current !== initialContent &&
      initialContent !== content
    ) {
      setContentValue(initialContent);
      previousInitialContentRef.current = initialContent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  return (
    <View style={[styles.container, containerStyle]}>
      {showToolbar && (
        <RichToolbar
          editor={richTextRef}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.removeFormat,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.undo,
            actions.redo,
          ]}
          iconTint="#FFFFFF"
          selectedIconTint="#4F46E5"
          selectedButtonStyle={styles.selectedButton}
          style={[styles.toolbar, toolbarStyle]}
        />
      )}
      <ScrollView
        style={[styles.scrollView, { minHeight }]}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <RichEditor
          ref={richTextRef}
          onChange={handleContentChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          initialHeight={initialHeight}
          disabled={disabled}
          initialContentHTML={initialContent}
          editorStyle={{
            backgroundColor: "#374151",
            color: "#FFFFFF",
            placeholderColor: "#6B7280",
            ...(editorStyle as object),
          }}
          useContainer={true}
          containerStyle={styles.editorContainer}
          initialFocus={false}
          pasteAsPlainText={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#374151",
    borderRadius: 8,
    overflow: "hidden",
  },
  toolbar: {
    backgroundColor: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#4B5563",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: "#4F46E5",
  },
  scrollView: {
    flex: 1,
  },
  editor: {
    backgroundColor: "#374151",
    color: "#FFFFFF",
    padding: 16,
    fontSize: 16,
    minHeight: 150,
  },
  editorContainer: {
    backgroundColor: "#374151",
  },
});
