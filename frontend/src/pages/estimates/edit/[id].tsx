
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EstimateForm } from "@/components/estimates/estimate-form";
import { getEstimateById } from "@/utils/helpers";
import { Estimate } from "@/types";
import { ArrowLeft } from "lucide-react";

const EditEstimatePage = () => {
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Edit Estimate #{estimate.estimateNumber}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Update the estimate details
          </p>
        </div>
      </div>
      
      <EstimateForm existingEstimate={estimate} />
    </div>
  );
};

export default EditEstimatePage;
