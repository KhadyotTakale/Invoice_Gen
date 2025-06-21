
import React from "react";
import { Card } from "@/components/ui/card";
import { Estimate } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { usePDF } from "@/hooks/use-pdf";

interface EstimatePDFViewProps {
  estimate: Estimate;
}

export function EstimatePDFView({ estimate }: EstimatePDFViewProps) {
  const { containerRef } = usePDF();

  return (
    <div ref={containerRef} className="bg-white print:shadow-none print:p-0">
      <Card className="p-8 border-none shadow-none print:shadow-none">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ESTIMATE</h1>
            <p className="text-gray-600">#{estimate.estimateNumber}</p>
          </div>
          <div className="text-right">
            {estimate.logo ? (
              <img
                src={estimate.logo}
                alt="Company Logo"
                className="h-12 ml-auto"
              />
            ) : (
              <div className="text-xl font-bold text-primary">EstimateAce</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-10">
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Bill To:</h2>
            <p className="font-medium">{estimate.client.name}</p>
            <p className="text-gray-600">{estimate.client.address}</p>
            {estimate.client.gstNumber && (
              <p className="text-gray-600">GST: {estimate.client.gstNumber}</p>
            )}
            <p className="text-gray-600">{estimate.client.email}</p>
            <p className="text-gray-600">{estimate.client.phone}</p>
          </div>

          <div className="text-right">
            <div className="space-y-1">
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Estimate Date:</span>
                <span className="font-medium">{formatDate(estimate.date)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{formatDate(estimate.dueDate)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{estimate.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b text-gray-600 font-medium">
                  Description
                </th>
                <th className="py-3 px-4 border-b text-gray-600 font-medium text-right">
                  Qty
                </th>
                <th className="py-3 px-4 border-b text-gray-600 font-medium text-right">
                  Rate
                </th>
                <th className="py-3 px-4 border-b text-gray-600 font-medium text-right">
                  Tax
                </th>
                <th className="py-3 px-4 border-b text-gray-600 font-medium text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 px-4">{item.description}</td>
                  <td className="py-4 px-4 text-right">{item.quantity}</td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="py-4 px-4 text-right">{item.tax}%</td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(item.quantity * item.rate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-64">
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(estimate.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>{formatCurrency(estimate.tax)}</span>
              </div>
              {estimate.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span>-{formatCurrency(estimate.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total:</span>
                <span>{formatCurrency(estimate.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {(estimate.notes || estimate.terms) && (
          <div className="mt-12 border-t pt-6 space-y-6">
            {estimate.terms && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Terms & Conditions
                </h3>
                <p className="text-gray-600 text-sm">{estimate.terms}</p>
              </div>
            )}
            {estimate.notes && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-600 text-sm">{estimate.notes}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
