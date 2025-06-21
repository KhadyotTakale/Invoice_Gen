
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge-status";
import { Estimate } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface RecentEstimatesProps {
  estimates: Estimate[];
  limit?: number;
}

export function RecentEstimates({ estimates, limit = 5 }: RecentEstimatesProps) {
  // Sort by date (newest first) and limit
  const recentEstimates = [...estimates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Estimates</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/estimates">View All</Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estimate #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEstimates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No estimates found. Create your first estimate to get started.
                </TableCell>
              </TableRow>
            ) : (
              recentEstimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell className="font-medium">{estimate.estimateNumber}</TableCell>
                  <TableCell>{estimate.client.name}</TableCell>
                  <TableCell>{formatDate(estimate.date)}</TableCell>
                  <TableCell>{formatCurrency(estimate.total)}</TableCell>
                  <TableCell>
                    <StatusBadge status={estimate.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/estimates/${estimate.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
