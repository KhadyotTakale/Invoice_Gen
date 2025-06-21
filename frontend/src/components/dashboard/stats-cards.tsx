
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Estimate } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import {
  CircleDollarSign,
  ClipboardCheck,
  FileCheck,
  FileCog,
} from "lucide-react";

interface StatsCardsProps {
  estimates: Estimate[];
}

export function StatsCards({ estimates }: StatsCardsProps) {
  const totalEstimates = estimates.length;
  const totalValue = estimates.reduce((acc, estimate) => acc + estimate.total, 0);
  
  const pendingEstimates = estimates.filter(
    (estimate) => estimate.status === "pending"
  ).length;
  
  const approvedEstimates = estimates.filter(
    (estimate) => estimate.status === "approved" || estimate.status === "converted"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
          <FileCog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEstimates}</div>
          <p className="text-xs text-muted-foreground pt-1">
            All created estimates
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground pt-1">
            Combined value of all estimates
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingEstimates}</div>
          <p className="text-xs text-muted-foreground pt-1">
            Awaiting client response
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedEstimates}</div>
          <p className="text-xs text-muted-foreground pt-1">
            Approved and converted estimates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
