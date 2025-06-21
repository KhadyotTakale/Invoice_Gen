
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EstimateItemsList } from "@/components/estimates/estimate-items-list";
import { ClientSelector } from "@/components/clients/client-selector";
import { DatePicker } from "@/components/ui/date-picker";
import { Client, Estimate, EstimateItem } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateEstimateNumber,
  generateId,
  calculateSubTotal,
  calculateTaxAmount,
  calculateTotal,
  saveEstimate,
  getClientById,
} from "@/utils/helpers";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  client: z.string({ required_error: "Client is required" }),
  date: z.date({ required_error: "Date is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

interface EstimateFormProps {
  existingEstimate?: Estimate;
}

export function EstimateForm({ existingEstimate }: EstimateFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<EstimateItem[]>(
    existingEstimate?.items || [
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        rate: 0,
        tax: 0,
        amount: 0,
      },
    ]
  );
  
  const [discount, setDiscount] = useState<number>(existingEstimate?.discount || 0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: existingEstimate?.client.id || "",
      date: existingEstimate ? new Date(existingEstimate.date) : new Date(),
      dueDate: existingEstimate 
        ? new Date(existingEstimate.dueDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      terms: existingEstimate?.terms || "Payment due within 7 days of receipt.",
      notes: existingEstimate?.notes || "Thank you for your business!",
    },
  });
  
  // Calculate totals
  const subTotal = calculateSubTotal(items);
  const taxAmount = calculateTaxAmount(items);
  const total = calculateTotal(subTotal, taxAmount, discount);
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Get client details
    const client = getClientById(values.client);
    
    if (!client) {
      toast({
        title: "Error",
        description: "Selected client not found",
        variant: "destructive",
      });
      return;
    }
    
    // Create estimate object
    const estimateData: Estimate = {
      id: existingEstimate?.id || generateId(),
      estimateNumber: existingEstimate?.estimateNumber || generateEstimateNumber(),
      client,
      items,
      subTotal,
      tax: taxAmount,
      discount,
      total,
      status: existingEstimate?.status || "pending",
      date: values.date.toISOString(),
      dueDate: values.dueDate.toISOString(),
      terms: values.terms,
      notes: values.notes,
      logo: existingEstimate?.logo,
      createdAt: existingEstimate?.createdAt || new Date().toISOString(),
    };
    
    // Save estimate
    saveEstimate(estimateData);
    
    toast({
      title: existingEstimate ? "Estimate Updated" : "Estimate Created",
      description: `Estimate ${estimateData.estimateNumber} has been ${
        existingEstimate ? "updated" : "created"
      } successfully.`,
    });
    
    // Navigate to the estimate details page
    navigate(`/estimates/${estimateData.id}`);
  };
  
  const handleItemsChange = (newItems: EstimateItem[]) => {
    setItems(newItems);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <ClientSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-medium">Estimate Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount</span>
                  <div className="flex items-center gap-2">
                    <span>₹</span>
                    <Input 
                      type="number"
                      min="0"
                      className="w-24"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <EstimateItemsList items={items} onChange={handleItemsChange} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms & Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter terms and conditions"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter additional notes"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {existingEstimate ? "Update Estimate" : "Create Estimate"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
