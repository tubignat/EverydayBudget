export const commonChartConfig = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fillShadowGradient: '#ffffff',
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    barPercentage: 0.5,
    color: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
    propsForDots: {
        r: "2",
        strokeWidth: "2",
    }
}
