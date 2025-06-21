
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types";
import { generateId, saveClient } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  gstNumber: z.string().optional(),
});

interface ClientFormProps {
  existingClient?: Client;
  onSuccess?: (clientId: string) => void;
  onCancel?: () => void;
}

export function ClientForm({ existingClient, onSuccess, onCancel }: ClientFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingClient?.name || "",
      email: existingClient?.email || "",
      phone: existingClient?.phone || "",
      address: existingClient?.address || "",
      gstNumber: existingClient?.gstNumber || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const clientData: Client = {
      id: existingClient?.id || generateId(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      gstNumber: values.gstNumber,
      createdAt: existingClient?.createdAt || new Date().toISOString(),
    };

    // Save client to storage
    saveClient(clientData);

    toast({
      title: existingClient ? "Client Updated" : "Client Added",
      description: `${clientData.name} has been ${
        existingClient ? "updated" : "added"
      } successfully.`,
    });

    if (onSuccess) onSuccess(clientData.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter GST number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {existingClient ? "Update Client" : "Add Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
