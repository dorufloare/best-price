"use client";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react";
import { getAveragePrice, getCurrentPrice, getHighestPrice, getLowestPrice, getPriceDescription } from "@/lib/product.utils";
import { getPastDate } from "@/lib/utils";

export const description = "Tracked prices";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartDataPoint {
  day: string;
  price: number;
}

interface Props {
  product: ProductData;
}

const getNrdaysByValue = (value: string) => {
  switch (value) {
    case 'week':
      return 7;
      break;
    case 'month':
      return 30;
      break;
    case 'three months':
      return 90;
      break;
    case 'year':
      return 365;
      break;
  }
  return 30;
}

const PriceChart: React.FC<Props> = ({ product }) => {
  const [nrdays, setNrdays] = useState(30);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [priceDescription, setPriceDescription] = useState<string>('')
  const priceHistory = product.priceHistory;

  const updateChartData = () => {
    const recentPrices = priceHistory.slice(-nrdays);
    const newChartData = recentPrices.map((price, index) => {
      return {
        day: getPastDate(recentPrices.length - 1 - index),
        price: price,
      };
    });
    
    setPriceDescription(getPriceDescription(product, nrdays));
    setChartData(newChartData);
  };

  useEffect(() => {
    updateChartData();
  }, [nrdays, priceHistory]);

  return (
    <Card className="mt-10">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="mb-6 text-red-600 p-0 m-0">
            {product.available ? getCurrentPrice(product) + ' ' + product.currency + ' - ' + priceDescription : 'Out of stock'}
          </CardTitle>
          <Select onValueChange={(value) => {setNrdays(getNrdaysByValue(value))}}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">last week</SelectItem>
              <SelectItem value="month">last month</SelectItem>
              <SelectItem value="three months">last three months</SelectItem>
              <SelectItem value="year">last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {`Prices for the last ${chartData.length} days`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 60, 
              right: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={0}
              interval={nrdays > 7 ? 'preserveEnd' : 0} 
              tickFormatter={(value) => (chartData.length > 7 ? '' : value)} 
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickCount={6}
              tick={{ dx: -60 }} 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="price"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
