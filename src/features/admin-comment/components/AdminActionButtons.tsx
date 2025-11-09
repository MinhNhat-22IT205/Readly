import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AdminActionButtonsProps {
  summaryId: string;
  currentStatus: "writing" | "waiting_for_approval" | "approved" | "rejected";
  onStatusChange?: (newStatus: "approved" | "rejected") => void;
}

// Mock function to approve summary - in real app, use API
const approveSummary = async (summaryId: string): Promise<void> => {
  // Simulate API call
  console.log("Approving summary:", summaryId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

// Mock function to reject summary - in real app, use API
const rejectSummary = async (summaryId: string): Promise<void> => {
  // Simulate API call
  console.log("Rejecting summary:", summaryId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const AdminActionButtons = ({
  summaryId,
  currentStatus,
  onStatusChange,
}: AdminActionButtonsProps) => {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handleApprove = async () => {
    Alert.alert(
      "Approve Summary",
      "Are you sure you want to approve this summary?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: async () => {
            try {
              setLoading("approve");
              await approveSummary(summaryId);
              onStatusChange?.("approved");
              Alert.alert("Success", "Summary approved successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to approve summary");
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      "Reject Summary",
      "Are you sure you want to reject this summary?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading("reject");
              await rejectSummary(summaryId);
              onStatusChange?.("rejected");
              Alert.alert("Success", "Summary rejected");
            } catch (error) {
              Alert.alert("Error", "Failed to reject summary");
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  // Only show buttons if status is waiting_for_approval
  if (currentStatus !== "waiting_for_approval") {
    return (
      <View className="px-4 mt-6">
        <View className="bg-gray-800 rounded-xl p-4 flex-row items-center justify-center">
          <Ionicons
            name={
              currentStatus === "approved"
                ? "checkmark-circle"
                : currentStatus === "rejected"
                ? "close-circle"
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
              : "Writing"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="px-4 mt-6">
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={handleApprove}
          disabled={loading !== null}
          className="flex-1 bg-green-600 py-4 rounded-xl flex-row items-center justify-center"
          activeOpacity={0.8}
          style={{ opacity: loading === "reject" ? 0.5 : 1 }}
        >
          {loading === "approve" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white ml-2 font-semibold text-base">
                Approve
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReject}
          disabled={loading !== null}
          className="flex-1 bg-red-600 py-4 rounded-xl flex-row items-center justify-center"
          activeOpacity={0.8}
          style={{ opacity: loading === "approve" ? 0.5 : 1 }}
        >
          {loading === "reject" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="close-circle" size={20} color="white" />
              <Text className="text-white ml-2 font-semibold text-base">
                Reject
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

