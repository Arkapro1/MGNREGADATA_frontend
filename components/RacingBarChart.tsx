                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RacingBarChartProps {
  data: Array<{
    district: string;
    value: number;
    year: string;
  }>;
  title?: string;
}

export default function RacingBarChart({ data, title }: RacingBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Group data by year
    interface YearGroupItem {
      district: string;
      value: number;
      year: string;
    }
    const yearGroups: Record<string, YearGroupItem[]> = {};
    data.forEach(item => {
      if (!yearGroups[item.year]) {
        yearGroups[item.year] = [];
      }
      yearGroups[item.year].push(item);
    });

    const years = Object.keys(yearGroups).sort();
    let currentYearIndex = 0;

    // District colors - using the new color scheme
    const districtColors: Record<string, string> = {};
    const colorPalette = [
      '#0046FF', '#0046FF', '#0046FF', '#0046FF', '#0046FF',
      '#0046FF', '#0046FF', '#0046FF', '#0046FF', '#0046FF',
      '#0046FF', '#0046FF', '#0046FF', '#0046FF', '#0046FF'
    ];

    const allDistricts = [...new Set(data.map(d => d.district))];
    allDistricts.forEach((district, index) => {
      districtColors[district] = colorPalette[index % colorPalette.length];
    });

    const updateFrequency = 1500; // 1.5 seconds per year transition

    const option: echarts.EChartsOption = {
      grid: {
        top: 80,
        bottom: 50,
        left: 20,
        right: 100,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const param = Array.isArray(params) ? params[0] : params;
          return `
            <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1A3D64;">
                ${param.name}
              </div>
              <div style="font-size: 13px; color: #1A3D64; opacity: 0.7;">
                Value: <strong style="color: #1A3D64;">${param.value.toLocaleString()}</strong>
              </div>
            </div>
          `;
        },
        backgroundColor: '#FAF8F1',
        borderColor: '#1A3D64',
        borderWidth: 2,
        textStyle: {
          color: '#1A3D64'
        },
        extraCssText: 'box-shadow: 0 4px 12px rgba(26, 61, 100, 0.15);'
      },
      xAxis: {
        type: 'value',
        name: 'Employment/Expenditure →',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 12,
          color: '#1A3D64',
          fontWeight: 600
        },
        max: 'dataMax',
        axisLabel: {
          formatter: (value: number | string) => {
            const n = typeof value === 'string' ? parseFloat(value) : value;
            return Math.round(n).toLocaleString();
          },
          color: '#1A3D64',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(26, 61, 100, 0.1)',
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(26, 61, 100, 0.3)'
          }
        }
      },
      yAxis: {
        type: 'category',
        name: '↑ Districts (Top 10)',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
          fontSize: 12,
          color: '#1A3D64',
          fontWeight: 600
        },
        inverse: true,
        max: 10,
        axisLabel: {
          show: true,
          fontSize: 12,
          color: '#1A3D64',
          fontWeight: 500
        },
        animationDuration: 300,
        animationDurationUpdate: updateFrequency,
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(26, 61, 100, 0.3)'
          }
        }
      },
      series: [
        {
          realtimeSort: true,
          type: 'bar',
          data: yearGroups[years[0]]
            ?.sort((a, b) => b.value - a.value)
            .slice(0, 10)
            .map(item => ({
              name: item.district,
              value: item.value
            })) || [],
          itemStyle: {
            color: '#0046FF',
            borderRadius: [0, 4, 4, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#0037CC',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 70, 255, 0.3)'
            }
          },
          label: {
            show: true,
            precision: 0,
            position: 'right',
            valueAnimation: true,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (param: any) => {
              return param.value.toLocaleString();
            },
            color: '#1A3D64'
          }
        }
      ],
      animationDuration: 0,
      animationDurationUpdate: updateFrequency,
      animationEasing: 'cubicInOut',
      animationEasingUpdate: 'cubicInOut',
      graphic: {
        elements: [
          {
            type: 'text',
            right: 100,
            bottom: 60,
            style: {
              text: years[0],
              font: 'bolder 48px system-ui',
              fill: 'rgba(26, 61, 100, 0.08)'
            },
            z: 100
          }
        ]
      },
      title: title ? {
        text: title,
        subtext: 'Hover over bars to see district details  •  Y-axis: Districts  •  X-axis: Performance Value',
        left: 20,
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 700,
          color: '#1A3D64'
        },
        subtextStyle: {
          fontSize: 11,
          color: '#1A3D64',
          opacity: 0.7
        }
      } : undefined
    };

    chartInstance.current.setOption(option);

    // Animate through years ONLY ONCE
    const animateYears = () => {
      if (currentYearIndex < years.length - 1) {
        currentYearIndex++;
        const currentYear = years[currentYearIndex];
        const currentData = yearGroups[currentYear]
          ?.sort((a, b) => b.value - a.value)
          .slice(0, 10)
          .map(item => ({
            name: item.district,
            value: item.value
          })) || [];

        chartInstance.current?.setOption({
          series: [{ data: currentData }],
          graphic: {
            elements: [
              {
                style: {
                  text: currentYear
                }
              }
            ]
          }
        });

        setTimeout(animateYears, updateFrequency);
      }
      // Animation ends after all years are shown once
    };

    if (years.length > 1) {
      setTimeout(animateYears, updateFrequency);
    }

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, title]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-[500px] lg:h-[600px]"
      style={{ minHeight: '500px' }}
    />
  );
}
