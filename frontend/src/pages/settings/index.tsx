
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/helpers";

const profileFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  website: z.string().optional(),
  taxIdentifier: z.string().optional(),
});

const defaultTermsSchema = z.object({
  termsAndConditions: z.string().min(1, "Default terms are required"),
  notes: z.string().optional(),
});

const SettingsPage = () => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      taxIdentifier: "",
    },
  });
  
  // Terms form
  const termsForm = useForm<z.infer<typeof defaultTermsSchema>>({
    resolver: zodResolver(defaultTermsSchema),
    defaultValues: {
      termsAndConditions: "Payment due within 7 days of receipt.",
      notes: "Thank you for your business!",
    },
  });
  
  // Load settings
  useEffect(() => {
    const settings = getFromLocalStorage("settings", {
      companyProfile: {
        companyName: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        taxIdentifier: "",
        logo: "",
      },
      defaultTerms: {
        termsAndConditions: "Payment due within 7 days of receipt.",
        notes: "Thank you for your business!",
      },
    });
    
    // Set form values
    profileForm.reset(settings.companyProfile);
    termsForm.reset(settings.defaultTerms);
    
    // Set logo preview
    if (settings.companyProfile.logo) {
      setLogoPreview(settings.companyProfile.logo);
    }
  }, [profileForm, termsForm]);
  
  // Save profile
  const saveProfile = (values: z.infer<typeof profileFormSchema>) => {
    const currentSettings = getFromLocalStorage("settings", {
      companyProfile: {},
      defaultTerms: {},
    });
    
    saveToLocalStorage("settings", {
      ...currentSettings,
      companyProfile: {
        ...values,
        logo: logoPreview,
      },
    });
    
    toast({
      title: "Profile Updated",
      description: "Your company profile has been updated.",
    });
  };
  
  // Save terms
  const saveTerms = (values: z.infer<typeof defaultTermsSchema>) => {
    const currentSettings = getFromLocalStorage("settings", {
      companyProfile: {},
      defaultTerms: {},
    });
    
    saveToLocalStorage("settings", {
      ...currentSettings,
      defaultTerms: values,
    });
    
    toast({
      title: "Terms Updated",
      description: "Your default terms have been updated.",
    });
  };
  
  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file",
        description: "Please upload a JPG, PNG, or SVG image.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 1MB.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove logo
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    
    const currentSettings = getFromLocalStorage("settings", {
      companyProfile: {},
      defaultTerms: {},
    });
    
    saveToLocalStorage("settings", {
      ...currentSettings,
      companyProfile: {
        ...currentSettings.companyProfile,
        logo: null,
      },
    });
    
    toast({
      title: "Logo Removed",
      description: "Your company logo has been removed.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="defaults">Defaults</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Update your company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="flex items-start space-x-4">
                      <div className="border rounded-md p-2 w-32 h-32 flex items-center justify-center">
                        {uploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Company Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-muted-foreground text-sm">No logo</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="relative"
                          >
                            <input
                              type="file"
                              id="logo"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleLogoUpload}
                              accept="image/jpeg,image/png,image/svg+xml"
                            />
                            <Upload className="h-4 w-4 mr-1" />
                            Upload Logo
                          </Button>
                          {logoPreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveLogo}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Recommended size: 200x200px. Max size: 1MB.
                          Supported formats: JPG, PNG, SVG.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Company address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="taxIdentifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST/Tax Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="GST123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Default Settings</CardTitle>
              <CardDescription>
                Configure default values for your estimates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...termsForm}>
                <form onSubmit={termsForm.handleSubmit(saveTerms)} className="space-y-4">
                  <FormField
                    control={termsForm.control}
                    name="termsAndConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Terms & Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter default terms and conditions"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          These terms will be auto-filled when creating new estimates.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={termsForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter default notes"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          These notes will be auto-filled when creating new estimates.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
