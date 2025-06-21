
import { useRef } from "react";
import { formatDate } from "@/utils/helpers";

export function usePDF() {
  // When using react-to-pdf, we would have more functionality here
  const containerRef = useRef<HTMLDivElement>(null);
  
  const generatePDF = async (filename?: string) => {
    if (!containerRef.current) return;
    
    const defaultFilename = `estimate-${formatDate(new Date().toISOString())}.pdf`;
    
    try {
      window.print();
      return true;
    } catch (error) {
      console.error("Error generating PDF: ", error);
      return false;
    }
  };
  
  return { containerRef, generatePDF };
}
