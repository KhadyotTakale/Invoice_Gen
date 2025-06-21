
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEstimateById } from "@/utils/helpers";
import { EstimateDetail } from "@/components/estimates/estimate-detail";
import { Estimate } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EstimateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) {
      setError("No estimate ID provided");
      setLoading(false);
      return;
    }
    
    const fetchEstimate = () => {
      const estimateData = getEstimateById(id);
      
      if (estimateData) {
        setEstimate(estimateData);
        setLoading(false);
      } else {
        setError("Estimate not found");
        setLoading(false);
      }
    };
    
    fetchEstimate();
  }, [id]);
  
  const refreshEstimate = () => {
    if (!id) return;
    const updatedEstimate = getEstimateById(id);
    if (updatedEstimate) {
      setEstimate(updatedEstimate);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }
  
  if (error || !estimate) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg font-medium text-destructive mb-4">{error}</div>
        <Button onClick={() => navigate("/estimates")}>
          Return to Estimates
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/estimates")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Estimates
      </Button>
      
      <EstimateDetail estimate={estimate} onUpdate={refreshEstimate} />
    </div>
  );
};

export default EstimateDetailPage;
