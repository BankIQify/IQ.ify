import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload } from "lucide-react";

interface Company {
  id: string;
  name: string;
  logo: string;
  message: string;
}

export const CompanyManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: "",
    logo: "",
    message: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive"
      });
      return;
    }

    const typedCompanies: Company[] = (data || []).map(company => ({
      id: String(company.id),
      name: String(company.name),
      logo: String(company.logo),
      message: String(company.message)
    }));

    setCompanies(typedCompanies);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("company-logos")
        .getPublicUrl(filePath);

      setNewCompany(prev => ({ ...prev, logo: publicUrl }));
      toast({
        title: "Success",
        description: "Logo uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.name || !newCompany.logo || !newCompany.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("companies")
      .insert([newCompany]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add company",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Company added successfully"
    });

    setNewCompany({ name: "", logo: "", message: "" });
    fetchCompanies();
  };

  const handleDeleteCompany = async (id: string) => {
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Company deleted successfully"
    });

    fetchCompanies();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Company Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Add New Company</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Tooltip Message</Label>
                <Input
                  id="message"
                  value={newCompany.message}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter tooltip message"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {newCompany.logo && (
                    <img
                      src={newCompany.logo}
                      alt="Preview"
                      className="h-8 w-auto"
                    />
                  )}
                </div>
              </div>
              <Button
                onClick={handleAddCompany}
                disabled={isUploading || !newCompany.name || !newCompany.logo || !newCompany.message}
              >
                Add Company
              </Button>
            </div>
          </div>

          {/* Companies List */}
          <div className="space-y-4">
            <h3 className="font-semibold">Current Companies</h3>
            <div className="grid gap-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-8 w-auto"
                    />
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-gray-500">{company.message}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteCompany(company.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 