
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, DollarSign, PercentIcon } from "lucide-react";
import { EstimateItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface EstimateItemsListProps {
  items: EstimateItem[];
  onChange: (items: EstimateItem[]) => void;
}

export function EstimateItemsList({ items, onChange }: EstimateItemsListProps) {
  const addItem = () => {
    const newItem: EstimateItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      rate: 0,
      tax: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof EstimateItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id !== id) return item;

      const updatedItem = { ...item, [field]: value };
      
      // Calculate amount whenever quantity or rate changes
      if (field === "quantity" || field === "rate") {
        updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
      }
      
      return updatedItem;
    });
    
    onChange(updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Items</h3>
        <Button type="button" onClick={addItem} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 w-full">Description</th>
              <th className="text-right py-2 px-2 whitespace-nowrap">Quantity</th>
              <th className="text-right py-2 px-2 whitespace-nowrap">Rate</th>
              <th className="text-right py-2 px-2 whitespace-nowrap">Tax (%)</th>
              <th className="text-right py-2 px-2 whitespace-nowrap">Amount</th>
              <th className="py-2 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-2">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Item description"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-20 text-right"
                    min={1}
                  />
                </td>
                <td className="py-2 px-2">
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                      className="w-24 pl-8 text-right"
                      min={0}
                      step="0.01"
                    />
                  </div>
                </td>
                <td className="py-2 px-2">
                  <div className="relative">
                    <PercentIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={item.tax}
                      onChange={(e) => updateItem(item.id, "tax", Number(e.target.value))}
                      className="w-20 pl-8 text-right"
                      min={0}
                      max={100}
                    />
                  </div>
                </td>
                <td className="py-2 px-2 text-right">
                  ₹{(item.quantity * item.rate).toFixed(2)}
                </td>
                <td className="py-2 px-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-muted-foreground">
                  No items added yet. Click "Add Item" to add your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
