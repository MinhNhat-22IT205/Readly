import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AdminActionButtonsProps {
  summaryId: string;
  onApproveSummary: (summaryId: string) => {};
  onRejectSUmmary: (summaryId: string) => {};
  currentStatus: "editing" | "waiting_for_approval" | "approved" | "rejected";
  onStatusChange?: (newStatus: "approved" | "rejected") => void;
}

export const AdminActionButtons = ({
  summaryId,
  currentStatus,
  onStatusChange,
  onApproveSummary,
  onRejectSUmmary,
}: AdminActionButtonsProps) => {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handleApprove = async () => {
    console.log("handleApprove called", { loading, currentStatus });
    if (loading !== null) {
      console.log("Button is disabled, returning");
      return; // Prevent double clicks
    }
    const isAlreadyRejected = currentStatus === "rejected";
    const isAlreadyApproved = currentStatus === "approved";
    console.log("Showing approve alert");
    
    try {
      setLoading("approve");
      await onApproveSummary(summaryId);
      onStatusChange?.("approved");
      Alert.alert(
        "Success",
        isAlreadyRejected
          ? "Summary has been approved (previously rejected)"
          : "Summary approved successfully"
      );
    } catch (error) {
      console.error("Approve error:", error);
      Alert.alert("Error", "Failed to approve summary");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    console.log("handleReject called", { loading, currentStatus });
    if (loading !== null) {
      console.log("Button is disabled, returning");
      return; // Prevent double clicks
    }
    const isAlreadyApproved = currentStatus === "approved";
    console.log("Processing reject");
    
    try {
      setLoading("reject");
      await onRejectSUmmary(summaryId);
      onStatusChange?.("rejected");
      Alert.alert(
        "Success",
        isAlreadyApproved
          ? "Summary has been rejected (previously approved)"
          : "Summary rejected"
      );
    } catch (error) {
      console.error("Reject error:", error);
      Alert.alert("Error", "Failed to reject summary");
    } finally {
      setLoading(null);
    }
  };

  // Hiển thị status badge và action buttons
  // Admin có thể approve/reject bất kỳ lúc nào (kể cả khi đã approve hoặc reject)
  return (
    <View className="px-4 mt-6">
      {/* Status Badge */}
      <View className="bg-gray-800 rounded-xl p-4 flex-row items-center justify-center mb-4">
        <Ionicons
          name={
            currentStatus === "approved"
              ? "checkmark-circle"
              : currentStatus === "rejected"
                ? "close-circle"
                : currentStatus === "waiting_for_approval"
                  ? "hourglass-outline"
                  : "time-outline"
          }
          size={20}
          color={
            currentStatus === "approved"
              ? "#10b981"
              : currentStatus === "rejected"
                ? "#ef4444"
                : "#9ca3af"
          }
        />
        <Text className="text-gray-300 ml-2 font-semibold capitalize">
          {currentStatus === "approved"
            ? "Approved"
            : currentStatus === "rejected"
              ? "Rejected"
              : currentStatus === "waiting_for_approval"
                ? "Waiting for Approval"
                : "Writing"}
        </Text>
      </View>

      {/* Action Buttons - Luôn hiển thị cả 2 button để admin có thể chuyển đổi status bất kỳ lúc nào */}
      <View className="flex-row gap-3">
        {/* Approve Button */}
        <TouchableOpacity
          onPress={handleApprove}
          disabled={loading !== null}
          className="flex-1 bg-green-600 py-4 rounded-xl flex-row items-center justify-center"
          activeOpacity={loading !== null ? 1 : 0.8}
          style={{ minHeight: 48 }}
        >
          {loading === "approve" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white ml-2 font-semibold text-base">
                {currentStatus === "approved"
                  ? "Approve Again"
                  : currentStatus === "rejected"
                    ? "Approve"
                    : "Approve"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Reject Button - Luôn hiển thị để admin có thể reject bất kỳ lúc nào, kể cả khi đã approve */}
        <TouchableOpacity
          onPress={handleReject}
          disabled={loading !== null}
          className="flex-1 bg-red-600 py-4 rounded-xl flex-row items-center justify-center"
          activeOpacity={loading !== null ? 1 : 0.8}
          style={{ minHeight: 48 }}
        >
          {loading === "reject" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="close-circle" size={20} color="white" />
              <Text className="text-white ml-2 font-semibold text-base">
                {currentStatus === "approved"
                  ? "Reject"
                  : currentStatus === "rejected"
                    ? "Reject Again"
                    : "Reject"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
