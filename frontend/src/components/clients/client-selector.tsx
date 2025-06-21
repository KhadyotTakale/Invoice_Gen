
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User } from "lucide-react";
import { Client } from "@/types";
import { getAllClients } from "@/utils/helpers";
import { ClientForm } from "@/components/clients/client-form";

interface ClientSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientSelector({ value, onChange }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load clients from local storage
    setClients(getAllClients());
  }, []);

  // Refresh clients list when dialog closes
  const handleDialogClose = () => {
    setOpen(false);
    setClients(getAllClients());
  };

  // Handle client creation success
  const handleClientCreated = (clientId: string) => {
    setOpen(false);
    onChange(clientId);
    setClients(getAllClients());
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          {clients.length === 0 ? (
            <div className="py-2 px-2 text-center text-sm text-muted-foreground">
              No clients found
            </div>
          ) : (
            clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {client.name}
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm onSuccess={handleClientCreated} onCancel={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
