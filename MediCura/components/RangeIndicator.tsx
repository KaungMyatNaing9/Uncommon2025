import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Polygon, Text as SvgText } from 'react-native-svg';

interface RangeSegment {
  color: string;
  from: number;
  to: number;
}

interface Props {
  label: string;
  value: number;
  unit?: string;
  segments: RangeSegment[];
  width?: number;
  height?: number;
}

const RangeIndicator: React.FC<Props> = ({
  label,
  value,
  unit = '',
  segments,
  width = 300,
  height = 30,
}) => {
  const totalRange = segments[segments.length - 1].to - segments[0].from;
  const valuePosition = ((value - segments[0].from) / totalRange) * width;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Svg width={width} height={80}>
        {/* Segments */}
        {segments.map((seg, i) => {
          const x = ((seg.from - segments[0].from) / totalRange) * width;
          const segWidth = ((seg.to - seg.from) / totalRange) * width;
          return (
            <Rect
              key={i}
              x={x}
              y={40}
              width={segWidth}
              height={height}
              fill={seg.color}
            />
          );
        })}

        {/* Value marker */}
        <Rect
          x={valuePosition - 15}
          y={10}
          width={30}
          height={20}
          rx={4}
          fill="#007bff"
        />
        <SvgText
          x={valuePosition}
          y={24}
          fontSize="12"
          fill="white"
          fontWeight="bold"
          textAnchor="middle"
        >
          {value}
        </SvgText>

        {/* Arrow */}
        <Polygon
          points={`${valuePosition - 6},30 ${valuePosition + 6},30 ${valuePosition},40`}
          fill="#007bff"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#007bff',
  },
});

export default RangeIndicator;
