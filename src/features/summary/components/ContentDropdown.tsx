import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { ContentSection } from "@shared-types/content_section.type";

interface ContentDropdownProps {
  section: ContentSection;
  isOpen: boolean;
  onToggle: () => void;
}

export const ContentDropdown = ({
  section,
  isOpen,
  onToggle,
}: ContentDropdownProps) => {
  const [webViewHeight, setWebViewHeight] = useState(200);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height) {
        setWebViewHeight(data.height);
      }
    } catch (e) {
      // Ignore parsing errors
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #1F2937;
            color: #F3F4F6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.75;
          }
          p {
            margin: 0 0 12px 0;
          }
          ul, ol {
            margin: 0 0 12px 0;
            padding-left: 24px;
          }
          li {
            margin-bottom: 8px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin: 16px 0 12px 0;
            color: #FFFFFF;
          }
          h1 { font-size: 24px; }
          h2 { font-size: 22px; }
          h3 { font-size: 20px; }
          h4 { font-size: 18px; }
          h5 { font-size: 16px; }
          h6 { font-size: 14px; }
          a {
            color: #818CF8;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          strong, b {
            font-weight: 600;
          }
          em, i {
            font-style: italic;
          }
          u {
            text-decoration: underline;
          }
        </style>
        <script>
          window.addEventListener('load', function() {
            setTimeout(function() {
              var height = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
              );
              window.ReactNativeWebView.postMessage(JSON.stringify({ height: height }));
            }, 100);
          });
        </script>
      </head>
      <body>
        ${section.content || ""}
      </body>
    </html>
  `;

  return (
    <View className="bg-gray-800 rounded-xl mb-4 overflow-hidden shadow-lg">
      <TouchableOpacity
        onPress={onToggle}
        className="p-5 flex-row items-center justify-between bg-gray-800"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center mr-4">
            <Text className="text-white text-base font-bold">
              {String(section.section_order).padStart(2, "0")}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">
              {section.title}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
      {isOpen && (
        <View className="px-5 pb-6 pt-4 bg-gray-800">
          <View className="border-t border-gray-700 pt-4">
            {section.content ? (
              <WebView
                source={{ html: htmlContent }}
                style={{
                  backgroundColor: "transparent",
                  height: webViewHeight,
                }}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            ) : (
              <Text className="text-gray-400 text-base italic">
                No content available
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
