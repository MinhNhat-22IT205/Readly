import React, { useState, useMemo, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryItem } from "./WriterSummaryItem";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";

type StatusFilter = "all" | Summary["status"];

interface WriterSummaryListProps {
  summaries: SummaryPopulated[];
  onSummaryPress: (summary: SummaryPopulated) => void;
  onChangeStatus: (
    summary: SummaryPopulated,
    status: Summary["status"]
  ) => Promise<void> | void;
  onDeleteSummary: (summary: SummaryPopulated) => Promise<void> | void;
  hideFilters?: boolean; // Optional prop để ẩn filter bar
}

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Writing", value: "editing" },
  { label: "Pending", value: "waiting_for_approval" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

type SummaryAction =
  | {
      type: "status";
      label: string;
      status: Summary["status"];
    }
  | {
      type: "delete";
      label: string;
      destructive?: boolean;
    };

const getActionsForSummary = (summary: SummaryPopulated): SummaryAction[] => {
  const actions: SummaryAction[] = [];
  if (summary.status === "editing") {
    actions.push({
      type: "status",
      label: "Ready to review",
      status: "waiting_for_approval",
    });
  }
  if (summary.status === "waiting_for_approval") {
    actions.push({
      type: "status",
      label: "Cancel submission",
      status: "editing",
    });
  }
  if (summary.status !== "approved") {
    actions.push({
      type: "delete",
      label: "Delete summary",
      destructive: true,
    });
  }
  return actions;
};

export const WriterSummaryList = ({
  summaries,
  onSummaryPress,
  onChangeStatus,
  onDeleteSummary,
  hideFilters = false,
}: WriterSummaryListProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSummary, setSelectedSummary] =
    useState<SummaryPopulated | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const filteredSummaries = useMemo(() => {
    const summariesList = summaries ?? [];
    if (statusFilter === "all") {
      return summariesList;
    }
    return summariesList.filter((summary) => summary.status === statusFilter);
  }, [summaries, statusFilter]);

  const getStatusCount = (status: StatusFilter) => {
    const summariesList = summaries ?? [];
    if (status === "all") return summariesList.length;
    return summariesList.filter((s) => s.status === status).length;
  };

  const handleOpenActions = useCallback((summary: SummaryPopulated) => {
    const actions = getActionsForSummary(summary);
    if (actions.length === 0) {
      return;
    }
    setSelectedSummary(summary);
  }, []);

  const closeActionSheet = () => {
    if (isProcessingAction) return;
    setSelectedSummary(null);
  };

  const summaryActions = useMemo(() => {
    if (!selectedSummary) return [];
    return getActionsForSummary(selectedSummary);
  }, [selectedSummary]);

  const handleActionPress = async (action: SummaryAction) => {
    if (!selectedSummary) return;
    try {
      setIsProcessingAction(true);
      if (action.type === "status") {
        await onChangeStatus(selectedSummary, action.status);
      } else if (action.type === "delete") {
        await onDeleteSummary(selectedSummary);
      }
      setSelectedSummary(null);
    } catch (error) {
      console.error("Summary action failed", error);
      Alert.alert("Action failed", "Please try again.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  if (filteredSummaries.length === 0) {
    return (
      <View className="flex-1">
        {/* Status Filters - chỉ hiển thị nếu không hideFilters */}
        {!hideFilters && (
          <View className="border-b border-gray-800">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              {statusFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  onPress={() => setStatusFilter(filter.value)}
                  style={{
                    marginRight: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      statusFilter === filter.value ? "#4F46E5" : "#1F2937",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        statusFilter === filter.value ? "#FFFFFF" : "#9CA3AF",
                    }}
                  >
                    {filter.label} ({getStatusCount(filter.value)})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        <View className="items-center justify-center py-12 px-4">
          <Ionicons name="document-text-outline" size={64} color="#6B7280" />
          <Text className="text-gray-400 text-base mt-4">
            No summaries found
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            {statusFilter === "all"
              ? "Start writing your first summary!"
              : `No ${statusFilters.find((f) => f.value === statusFilter)?.label.toLowerCase()} summaries`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Status Filters - chỉ hiển thị nếu không hideFilters */}
      {!hideFilters && (
        <View className="border-b border-gray-800">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          >
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setStatusFilter(filter.value)}
                style={{
                  marginRight: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    statusFilter === filter.value ? "#4F46E5" : "#1F2937",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: statusFilter === filter.value ? "#FFFFFF" : "#9CA3AF",
                  }}
                >
                  {filter.label} ({getStatusCount(filter.value)})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Summaries List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      >
        {filteredSummaries.map((summary) => (
          <WriterSummaryItem
            key={summary.id}
            summary={summary}
            onPress={() => onSummaryPress(summary)}
            onMorePress={() => handleOpenActions(summary)}
            showMoreButton={getActionsForSummary(summary).length > 0}
          />
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedSummary}
        transparent
        animationType="fade"
        onRequestClose={closeActionSheet}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeActionSheet}
          />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {selectedSummary?.title ?? "Actions"}
            </Text>
            {summaryActions.map((action) => {
              const isDestructive =
                action.type === "delete" && action.destructive;
              return (
                <TouchableOpacity
                  key={`${action.type}-${action.label}`}
                  style={[
                    styles.actionButton,
                    isDestructive && styles.destructiveButton,
                  ]}
                  disabled={isProcessingAction}
                  onPress={() => handleActionPress(action)}
                >
                  <Text
                    style={[
                      styles.actionLabel,
                      isDestructive && styles.destructiveLabel,
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeActionSheet}
              disabled={isProcessingAction}
            >
              <Text style={styles.cancelLabel}>Close</Text>
            </TouchableOpacity>
            {isProcessingAction ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  sheetTitle: {
    color: "#F3F4F6",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#374151",
  },
  actionLabel: {
    color: "#E5E7EB",
    fontSize: 15,
    textAlign: "center",
  },
  destructiveButton: {
    backgroundColor: "#4B1D1D",
  },
  destructiveLabel: {
    color: "#FCA5A5",
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  cancelLabel: {
    color: "#D1D5DB",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
