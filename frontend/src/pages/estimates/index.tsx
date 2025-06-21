import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge-status";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Estimate, Client, Status } from "@/types";
import {
  getAllEstimates,
  getAllClients,
  formatCurrency,
  formatDate,
  filterEstimatesByStatus,
  filterEstimatesByClient,
  sortEstimatesByDate,
  exportEstimatesToCSV,
} from "@/utils/helpers";
import {
  ArrowUpDown,
  Download,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

const EstimatesPage = () => {
  const allEstimates = getAllEstimates();
  const clients = getAllClients();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter and sort estimates
  const filteredEstimates = useMemo(() => {
    let result = [...allEstimates];
    
    // Apply status filter
    result = filterEstimatesByStatus(result, statusFilter);
    
    // Apply client filter
    if (clientFilter) {
      result = filterEstimatesByClient(result, clientFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (estimate) =>
          estimate.estimateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          estimate.client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by date (newest first)
    return sortEstimatesByDate(result);
  }, [allEstimates, statusFilter, clientFilter, searchQuery]);
  
  // Define table columns
  const columns: ColumnDef<Estimate>[] = [
    {
      accessorKey: "estimateNumber",
      header: "Estimate #",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.estimateNumber}</span>
      ),
    },
    {
      accessorKey: "client.name",
      header: "Client",
      cell: ({ row }) => <span>{row.original.client.name}</span>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <div className="flex items-center">
          <span>Date</span>
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      ),
      cell: ({ row }) => <span>{formatDate(row.original.date)}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => <span>{formatDate(row.original.dueDate)}</span>,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <div className="flex items-center justify-end">
          <span>Total</span>
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-right block">{formatCurrency(row.original.total)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status as Status} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/estimates/${row.original.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
        <Button asChild>
          <Link to="/estimates/new" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Create Estimate</span>
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Estimates</CardTitle>
          <CardDescription>
            View, filter, and manage all your estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search estimates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={clientFilter}
                  onValueChange={setClientFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => exportEstimatesToCSV(filteredEstimates)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
            
            <DataTable
              columns={columns}
              data={filteredEstimates}
              searchPlaceholder="Filter estimates..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstimatesPage;
