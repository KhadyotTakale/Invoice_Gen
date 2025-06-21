import React from "react";
import { Button } from "@/components/ui/button";
import { EstimateForm } from "@/components/estimates/estimate-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewEstimatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Estimate
            </h1>
          </div>
          <p className="text-muted-foreground">
            Create a new estimate for your client
          </p>
        </div>
      </div>

      <EstimateForm />
    </div>
  );
};

export default NewEstimatePage;
