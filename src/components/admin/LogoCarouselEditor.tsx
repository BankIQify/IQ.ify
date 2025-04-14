import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface CompanyLogo {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
}

interface SupabaseCompanyLogo {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  created_at: string;
}

export const LogoCarouselEditor: React.FC = () => {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [companies, setCompanies] = useState<CompanyLogo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('company_logos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedData: CompanyLogo[] = (data as SupabaseCompanyLogo[] || []).map(item => ({
        id: item.id,
        name: item.name,
        logoUrl: item.logo_url,
        website: item.website,
      }));

      setCompanies(mappedData);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load company logos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompany = () => {
    const newCompany: CompanyLogo = {
      id: Date.now().toString(),
      name: "",
      logoUrl: "",
      website: "",
    };
    setCompanies([...companies, newCompany]);
  };

  const removeCompany = async (id: string) => {
    try {
      if (id.includes("temp_")) {
        setCompanies(companies.filter(company => company.id !== id));
        return;
      }

      const { error } = await supabase
        .from('company_logos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompanies(companies.filter(company => company.id !== id));
      toast({
        title: "Success",
        description: "Company logo removed successfully",
      });
    } catch (error) {
      console.error('Error removing company:', error);
      toast({
        title: "Error",
        description: "Failed to remove company logo",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('company_logos')
        .upsert(companies.map(company => ({
          id: company.id,
          name: company.name,
          logo_url: company.logoUrl,
          website: company.website,
        })));

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company logos updated successfully",
      });

      // Refresh the list
      await fetchCompanies();
    } catch (error) {
      console.error('Error saving companies:', error);
      toast({
        title: "Error",
        description: "Failed to save company logos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companies.map((company, index) => (
              <Card key={company.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Company {index + 1}</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCompany(company.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={company.name}
                        onChange={(e) => {
                          const newCompanies = [...companies];
                          newCompanies[index] = {
                            ...company,
                            name: e.target.value,
                          };
                          setCompanies(newCompanies);
                        }}
                        placeholder="e.g. Microsoft"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input
                        value={company.logoUrl}
                        onChange={(e) => {
                          const newCompanies = [...companies];
                          newCompanies[index] = {
                            ...company,
                            logoUrl: e.target.value,
                          };
                          setCompanies(newCompanies);
                        }}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        value={company.website}
                        onChange={(e) => {
                          const newCompanies = [...companies];
                          newCompanies[index] = {
                            ...company,
                            website: e.target.value,
                          };
                          setCompanies(newCompanies);
                        }}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={addCompany}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Company
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 