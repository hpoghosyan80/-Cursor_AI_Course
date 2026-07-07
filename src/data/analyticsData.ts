export interface KpiMetric {
  id: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: 'revenue' | 'users' | 'sessions' | 'conversion'
}

export interface ChartSeries {
  label: string
  values: number[]
}

export interface AnalyticsTableRow {
  id: string
  date: string
  campaign: string
  impressions: number
  clicks: number
  ctr: number
  revenue: number
  status: 'active' | 'paused' | 'completed'
}

export const kpiMetrics: KpiMetric[] = [
  {
    id: 'revenue',
    label: 'Total revenue',
    value: '$284,520',
    change: '+12.5% vs last period',
    trend: 'up',
    icon: 'revenue',
  },
  {
    id: 'users',
    label: 'Active users',
    value: '18,429',
    change: '+8.2% vs last period',
    trend: 'up',
    icon: 'users',
  },
  {
    id: 'sessions',
    label: 'Sessions',
    value: '142,847',
    change: '-2.1% vs last period',
    trend: 'down',
    icon: 'sessions',
  },
  {
    id: 'conversion',
    label: 'Conversion rate',
    value: '3.24%',
    change: '+0.4pp vs last period',
    trend: 'up',
    icon: 'conversion',
  },
]

export const revenueChartData: ChartSeries = {
  label: 'Revenue',
  values: [42, 55, 48, 62, 58, 71, 68, 82, 78, 91, 88, 96],
}

export const trafficChartData: ChartSeries[] = [
  { label: 'Organic', values: [120, 135, 128, 142, 138, 155, 148, 162, 158, 171, 165, 180] },
  { label: 'Paid', values: [80, 92, 88, 95, 102, 98, 110, 105, 118, 112, 125, 130] },
  { label: 'Direct', values: [60, 58, 65, 62, 70, 68, 72, 75, 71, 78, 76, 82] },
]

export const categoryBreakdown = [
  { label: 'Electronics', value: 38, color: 'bg-indigo-500' },
  { label: 'Clothing', value: 27, color: 'bg-violet-500' },
  { label: 'Home & Garden', value: 19, color: 'bg-fuchsia-500' },
  { label: 'Sports', value: 16, color: 'bg-sky-500' },
]

export const analyticsTableData: AnalyticsTableRow[] = [
  {
    id: '1',
    date: '2026-07-06',
    campaign: 'Summer Sale 2026',
    impressions: 245_800,
    clicks: 12_340,
    ctr: 5.02,
    revenue: 48_920,
    status: 'active',
  },
  {
    id: '2',
    date: '2026-07-05',
    campaign: 'Product Launch — Pro',
    impressions: 189_400,
    clicks: 9_870,
    ctr: 5.21,
    revenue: 62_150,
    status: 'active',
  },
  {
    id: '3',
    date: '2026-07-04',
    campaign: 'Retargeting — Cart Abandon',
    impressions: 98_200,
    clicks: 4_120,
    ctr: 4.2,
    revenue: 18_740,
    status: 'active',
  },
  {
    id: '4',
    date: '2026-07-03',
    campaign: 'Brand Awareness Q3',
    impressions: 412_000,
    clicks: 8_240,
    ctr: 2.0,
    revenue: 9_820,
    status: 'paused',
  },
  {
    id: '5',
    date: '2026-07-02',
    campaign: 'Email — Newsletter Promo',
    impressions: 56_300,
    clicks: 6_780,
    ctr: 12.04,
    revenue: 24_600,
    status: 'completed',
  },
  {
    id: '6',
    date: '2026-07-01',
    campaign: 'Referral Program',
    impressions: 34_500,
    clicks: 3_450,
    ctr: 10.0,
    revenue: 15_320,
    status: 'completed',
  },
]

export const dateRangePresets = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'custom', label: 'Custom' },
] as const

export type DateRangePreset = (typeof dateRangePresets)[number]['id']

export const categoryOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
]

export const regionOptions = [
  { value: 'global', label: 'Global' },
  { value: 'na', label: 'North America' },
  { value: 'eu', label: 'Europe' },
  { value: 'apac', label: 'Asia Pacific' },
  { value: 'latam', label: 'Latin America' },
]
