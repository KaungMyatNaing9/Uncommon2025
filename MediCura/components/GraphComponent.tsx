import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text } from 'react-native-svg';

type DataPoint = {
  label: string;
  value: number;
  min: number;
  max: number;
};

interface Props {
  data: DataPoint[];
  height?: number;
  barWidth?: number;
  spacing?: number;
}

const BarChartWithError: React.FC<Props> = ({
  data,
  height = 300,
  barWidth = 40,
  spacing = 30,
}) => {
  const padding = 60;
  const gapAfterYAxis = -20;
  const chartAreaHeight = height - 80;
  const chartWidth = padding * 2 + gapAfterYAxis + (data.length - 0.5) * (barWidth + spacing);

  // Generate Y-axis labels: 0 to 1 in steps of 0.2
  const yAxisLines = Array.from({ length: 6 }, (_, i) => {
    const value = i * 0.2;
    const y = height - 40 - value * chartAreaHeight;
    return { y, value: parseFloat(value.toFixed(1)) };
  });

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          {/* Background */}
          <Rect x={0} y={0} width={chartWidth} height={height} fill="white" rx={10} />

          {/* Y-axis + Grid lines */}
          {yAxisLines.map((line, index) => (
            <React.Fragment key={index}>
              {/* Dotted horizontal line */}
              <Line
                x1={padding + gapAfterYAxis}
                y1={line.y}
                x2={chartWidth - padding / 2}
                y2={line.y}
                stroke="#ccc"
                strokeDasharray="4"
                strokeWidth={1}
              />
              {/* Y-axis label */}
              <Text
                x={padding + gapAfterYAxis - 10}
                y={line.y + 4}
                fontSize="10"
                fill="black"
                textAnchor="end"
              >
                {line.value}
              </Text>
            </React.Fragment>
          ))}

          {/* Y-axis vertical line */}
          <Line
            x1={padding + gapAfterYAxis}
            y1={40}
            x2={padding + gapAfterYAxis}
            y2={height - 40}
            stroke="black"
            strokeWidth={1}
          />

          {/* Bars and labels */}
          {data.map((point, index) => {
            const x = padding + gapAfterYAxis + index * (barWidth + spacing);
            const scaledValue = point.value * chartAreaHeight;
            const scaledMin = point.min * chartAreaHeight;
            const scaledMax = point.max * chartAreaHeight;
            const barHeight = scaledValue;
            const y = height - barHeight - 40;

            return (
              <React.Fragment key={index}>
                {/* Bar */}
                <Rect
                  x={x - gapAfterYAxis}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#4a90e2"
                  rx={6}
                />
                {/* Error line */}
                <Line
                  x1={(x + barWidth / 2) - gapAfterYAxis}
                  y1={height - scaledMax - 40}
                  x2={(x + barWidth / 2) - gapAfterYAxis}
                  y2={height - scaledMin - 40}
                  stroke="red"
                  strokeWidth={2}
                />
                <Line
                  x1={(x + barWidth / 2 - 6) - gapAfterYAxis}
                  y1={height - scaledMax - 40}
                  x2={(x + barWidth / 2 + 6) - gapAfterYAxis}
                  y2={height - scaledMax - 40}
                  stroke="red"
                  strokeWidth={2}
                />
                <Line
                  x1={(x + barWidth / 2 - 6) - gapAfterYAxis}
                  y1={height - scaledMin - 40}
                  x2={(x + barWidth / 2 + 6) - gapAfterYAxis}
                  y2={height - scaledMin - 40}
                  stroke="red"
                  strokeWidth={2}
                />
                {/* Vertical label to the left of the bar */}
                <Text
                  x={x - 10}
                  y={(y + barHeight / 2) - gapAfterYAxis +5}
                  fontSize="12"
                  fill="black"
                  textAnchor="middle"
                  transform={`rotate(-90, ${x - 10}, ${y + barHeight / 2})`}
                >
                  {point.label}
                </Text>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
});

export default BarChartWithError;
