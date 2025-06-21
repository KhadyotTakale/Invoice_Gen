
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentEstimates } from "@/components/dashboard/recent-estimates";
import { Estimate, Client, Status } from "@/types";
import { 
  getAllEstimates, 
  getAllClients, 
  createSampleEstimate, 
  createSampleClient,
  saveEstimate,
  saveClient
} from "@/utils/helpers";

const Dashboard = () => {
  const estimates = getAllEstimates();
  const clients = getAllClients();
  
  // Create sample data if no estimates exist
  useEffect(() => {
    if (estimates.length === 0 && clients.length === 0) {
      // Create some sample clients
      const client1 = {
        ...createSampleClient(),
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "9876543210",
        address: "123 Business Park, Mumbai, India",
        gstNumber: "GST123456789",
      };
      
      const client2 = {
        ...createSampleClient(),
        name: "Tech Solutions Ltd",
        email: "info@techsolutions.com",
        phone: "8765432109",
        address: "456 Tech Hub, Bangalore, India",
        gstNumber: "GST987654321",
      };
      
      saveClient(client1);
      saveClient(client2);
      
      // Create some sample estimates
      const estimate1 = createSampleEstimate(client1);
      const estimate2 = {
        ...createSampleEstimate(client2),
        status: "approved" as Status,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      };
      
      saveEstimate(estimate1);
      saveEstimate(estimate2);
    }
  }, [estimates.length, clients.length]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/estimates/new" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Create Estimate</span>
          </Link>
        </Button>
      </div>
      
      <StatsCards estimates={estimates} />
      
      <div className="grid grid-cols-1 gap-6">
        <RecentEstimates estimates={estimates} />
      </div>
    </div>
  );
};

export default Dashboard;
