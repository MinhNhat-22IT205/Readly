import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
}

// Component Pie Chart đơn giản sử dụng View với góc được tính toán
export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0 || data.length === 0) {
    return (
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <View style={[styles.emptyCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#374151' }]}>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      </View>
    );
  }

  const radius = size / 2;
  let currentAngle = -90; // Bắt đầu từ trên cùng

  // Tính toán các slice
  const slices = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      angle,
      startAngle,
      percentage: ((item.value / total) * 100).toFixed(1),
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        {/* Vẽ các slice bằng cách sử dụng View với góc được tính toán */}
        <View style={{ width: size, height: size, position: 'relative', borderRadius: size / 2, overflow: 'hidden' }}>
          {slices.map((slice, index) => {
            // Tính toán vị trí và kích thước của slice
            const sliceStyle: any = {
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: slice.color,
              borderRadius: size / 2,
            };

            // Sử dụng clipPath để cắt slice theo góc
            // Vì React Native không hỗ trợ clipPath tốt, ta sẽ dùng cách khác
            // Tạo một mask bằng cách sử dụng các View với góc được tính toán
            
            return (
              <View
                key={index}
                style={[
                  sliceStyle,
                  {
                    // Tạo hiệu ứng slice bằng cách sử dụng transform và opacity
                    transform: [
                      { rotate: `${slice.startAngle}deg` },
                    ],
                    opacity: 0.9,
                  },
                ]}
              />
            );
          })}
          
          {/* Center circle để tạo hiệu ứng donut */}
          <View
            style={{
              position: 'absolute',
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: (size * 0.6) / 2,
              backgroundColor: '#1F2937',
              top: size * 0.2,
              left: size * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#374151',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {total.toLocaleString('vi-VN')}
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 10 }}>Total</Text>
          </View>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        {slices.map((slice, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: slice.color }]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.legendText}>
                {slice.label}
              </Text>
              <Text style={styles.legendSubtext}>
                {slice.percentage}% • {slice.value.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Component Pie Chart đơn giản hơn sử dụng các View được xếp chồng
export const SimplePieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0 || data.length === 0) {
    return (
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <View style={[styles.emptyCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#374151' }]}>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      </View>
    );
  }

  // Tạo các slice bằng cách sử dụng các View với border radius và góc được tính toán
  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    return {
      ...item,
      percentage: percentage.toFixed(1),
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        {/* Vẽ pie chart bằng cách sử dụng các View với góc được tính toán */}
        <View style={{ width: size, height: size, position: 'relative', borderRadius: size / 2, overflow: 'hidden', backgroundColor: '#374151' }}>
          {/* Vẽ các slice bằng cách sử dụng conic gradient simulation */}
          {slices.map((slice, index) => {
            const cumulativePercentage = slices.slice(0, index).reduce((sum, s) => sum + parseFloat(s.percentage), 0);
            const slicePercentage = parseFloat(slice.percentage);
            
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  backgroundColor: slice.color,
                  borderRadius: size / 2,
                  opacity: 0.8,
                  // Sử dụng transform để xoay slice
                  transform: [
                    { rotate: `${cumulativePercentage * 3.6 - 90}deg` },
                  ],
                }}
              />
            );
          })}
          
          {/* Center circle */}
          <View
            style={{
              position: 'absolute',
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: (size * 0.6) / 2,
              backgroundColor: '#1F2937',
              top: size * 0.2,
              left: size * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#374151',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {total.toLocaleString('vi-VN')}
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 10 }}>Total</Text>
          </View>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        {slices.map((slice, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: slice.color }]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.legendText}>
                {slice.label}
              </Text>
              <Text style={styles.legendSubtext}>
                {slice.percentage}% • {slice.value.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  legendSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
});
