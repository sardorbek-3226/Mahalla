import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Card, { CardHeader } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(148,163,184,0.15)' }, beginAtZero: true },
  },
};

const CHARTS = { line: Line, bar: Bar, doughnut: Doughnut };

// Generic chart wrapper. Pass real `data` shaped for Chart.js.
const ChartCard = ({ title, subtitle, type = 'line', data, options, height = 280, action }) => {
  const ChartComp = CHARTS[type] || Line;
  const opts = type === 'doughnut' ? { ...options } : { ...baseOptions, ...options };
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <div style={{ height }}>
        {data ? (
          <ChartComp data={data} options={opts} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Ma'lumot yo'q
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChartCard;
