
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EstimatePDFView } from "@/components/estimates/estimate-pdf-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Estimate, Status } from "@/types";
import { formatCurrency, formatDate, deleteEstimate, saveEstimate } from "@/utils/helpers";
import { useToast } from "@/components/ui/use-toast";
import {
  Send,
  Download,
  FileEdit,
  MoreHorizontal,
  Trash2,
  Mail,
  Printer,
} from "lucide-react";

interface EstimateDetailProps {
  estimate: Estimate;
  onUpdate: () => void;
}

export function EstimateDetail({ estimate, onUpdate }: EstimateDetailProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(estimate.status);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  const handleStatusChange = (newStatus: Status) => {
    const updatedEstimate = { 
      ...estimate, 
      status: newStatus as Status 
    };
    saveEstimate(updatedEstimate);
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Status changed to ${newStatus}.`,
    });
    onUpdate();
  };
  
  const handleDelete = () => {
    deleteEstimate(estimate.id);
    toast({
      title: "Estimate Deleted",
      description: `Estimate ${estimate.estimateNumber} has been deleted.`,
    });
    navigate("/estimates");
  };
  
  const handleDownloadPDF = () => {
    // PDF generation logic will be added later
    toast({
      title: "PDF Downloaded",
      description: "Estimate PDF has been downloaded.",
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSendEmail = () => {
    // Email sending logic will be added later
    toast({
      title: "Email Sent",
      description: `Estimate sent to ${estimate.client.email}.`,
    });
    setEmailDialogOpen(false);
  };
  
  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Estimate {estimate.estimateNumber}
            </h1>
            <p className="text-muted-foreground">
              Created on {formatDate(estimate.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange as (value: string) => void}>
              <SelectTrigger className="w-[160px]">
                <SelectValue>
                  <StatusBadge status={status} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <StatusBadge status="pending" />
                </SelectItem>
                <SelectItem value="approved">
                  <StatusBadge status="approved" />
                </SelectItem>
                <SelectItem value="converted">
                  <StatusBadge status="converted" />
                </SelectItem>
                <SelectItem value="cancelled">
                  <StatusBadge status="cancelled" />
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" asChild>
              <Link to={`/estimates/${estimate.id}/edit`}>
                <FileEdit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
            
            <Button onClick={() => setEmailDialogOpen(true)}>
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/estimates/${estimate.id}/duplicate`}>
                    Duplicate
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const updatedEstimate = { ...estimate, status: "converted" as Status };
                    saveEstimate(updatedEstimate);
                    setStatus("converted");
                    toast({
                      title: "Converted to Invoice",
                      description: "Estimate has been converted to an invoice.",
                    });
                    onUpdate();
                  }}
                  disabled={estimate.status === "converted" || estimate.status === "cancelled"}
                >
                  Convert to Invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{estimate.client.name}</p>
              <p className="text-sm text-muted-foreground">{estimate.client.email}</p>
              <p className="text-sm text-muted-foreground">{estimate.client.phone}</p>
              <p className="text-sm text-muted-foreground mt-2">{estimate.client.address}</p>
              {estimate.client.gstNumber && (
                <p className="text-sm text-muted-foreground mt-2">
                  GST: {estimate.client.gstNumber}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span>{formatDate(estimate.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span>{formatDate(estimate.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StatusBadge status={status} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(estimate.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tax:</span>
                  <span>{formatCurrency(estimate.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Discount:</span>
                  <span>{formatCurrency(estimate.discount)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(estimate.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <EstimatePDFView estimate={estimate} />
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete estimate {estimate.estimateNumber}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Email Dialog */}
      <AlertDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Estimate</AlertDialogTitle>
            <AlertDialogDescription>
              This will send the estimate to {estimate.client.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{estimate.client.email}</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendEmail}>
              Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
