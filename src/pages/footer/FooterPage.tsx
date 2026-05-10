import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner";
import { Plus, Trash2, Save, Globe, Share2, PhoneCall, Quote, Sparkles, Layout } from 'lucide-react';

interface SocialMedia {
  platform: string;
  url: string;
}

interface FooterData {
  centers: string[];
  socialMedia: SocialMedia[];
  contact: {
    email: string;
    phone: string;
  };
  slogan: string;
}

const FooterPage = () => {
  const [data, setData] = useState<FooterData>({
    centers: [],
    socialMedia: [],
    contact: { email: '', phone: '' },
    slogan: ''
  });
  const [loading, setLoading] = useState(true);

  // AI Tags State
  const [tags, setTags] = useState<any[]>([]);
  const [tagForm, setTagForm] = useState({ name: '', description: '' });
  const [tagLoading, setTagLoading] = useState(false);

  useEffect(() => {
    fetchFooterData();
    fetchTags();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/footer');
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load footer data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/aitags');
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  };

  const handleSaveFooter = async () => {
    try {
      await axios.put('http://localhost:5000/api/footer', data);
      toast.success("Footer updated successfully");
    } catch (error) {
      toast.error("Failed to update footer");
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagForm.name || !tagForm.description) {
      toast.error("Tag name and description are required.");
      return;
    }
    setTagLoading(true);
    try {
      await axios.post('http://localhost:5000/api/aitags', tagForm);
      toast.success("AI Tag added successfully");
      setTagForm({ name: '', description: '' });
      fetchTags();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add AI Tag");
    } finally {
      setTagLoading(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/aitags/${id}`);
      toast.success("AI Tag deleted successfully");
      fetchTags();
    } catch (error: any) {
      toast.error("Failed to delete AI Tag");
    }
  };

  // Centers logic
  const addCenter = () => {
    setData({ ...data, centers: [...data.centers, ''] });
  };

  const updateCenter = (index: number, value: string) => {
    const newCenters = [...data.centers];
    newCenters[index] = value;
    setData({ ...data, centers: newCenters });
  };

  const removeCenter = (index: number) => {
    setData({ ...data, centers: data.centers.filter((_, i) => i !== index) });
  };

  // Social Media logic
  const addSocial = () => {
    setData({ ...data, socialMedia: [...data.socialMedia, { platform: '', url: '' }] });
  };

  const updateSocial = (index: number, field: keyof SocialMedia, value: string) => {
    const newSocials = [...data.socialMedia];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setData({ ...data, socialMedia: newSocials });
  };

  const removeSocial = (index: number) => {
    setData({ ...data, socialMedia: data.socialMedia.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-primary/10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Layout className="w-8 h-8 text-primary" />
            Footer & Brand Assets
          </h1>
          <p className="text-muted-foreground text-sm">Manage global footer content, contact info, and animated AI tags.</p>
        </div>
        <Button 
          onClick={handleSaveFooter} 
          size="lg"
          className="shadow-md gap-2 px-8"
        >
          <Save size={18} />
          Save Footer Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* OUR CENTERS */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div><CardTitle className="text-xl">Our Centers</CardTitle><CardDescription>Location labels shown in footer</CardDescription></div>
              </div>
              <Button variant="outline" size="sm" onClick={addCenter} className="border-primary/20 hover:bg-primary/10"><Plus size={16} className="mr-1" /> Add Center</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {data.centers.map((center, index) => (
              <div key={index} className="flex gap-2 group">
                <Input value={center} onChange={(e) => updateCenter(index, e.target.value)} placeholder="e.g. Rishikesh, India" className="bg-background border-primary/10" />
                <Button variant="ghost" size="icon" onClick={() => removeCenter(index)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 size={18} /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SOCIAL MEDIA */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-primary" />
                <div><CardTitle className="text-xl">Social Media</CardTitle><CardDescription>Platforms and profile URLs</CardDescription></div>
              </div>
              <Button variant="outline" size="sm" onClick={addSocial} className="border-primary/20 hover:bg-primary/10"><Plus size={16} className="mr-1" /> Add Social</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {data.socialMedia.map((social, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-primary/10 bg-muted/30 relative group">
                <div className="space-y-1.5"><Label className="text-xs font-semibold text-muted-foreground uppercase">Platform</Label><Input value={social.platform} onChange={(e) => updateSocial(index, 'platform', e.target.value)} placeholder="e.g. Instagram" className="bg-background h-10" /></div>
                <div className="space-y-1.5 pr-10"><Label className="text-xs font-semibold text-muted-foreground uppercase">URL</Label><Input value={social.url} onChange={(e) => updateSocial(index, 'url', e.target.value)} placeholder="https://..." className="bg-background h-10" /></div>
                <Button variant="ghost" size="icon" onClick={() => removeSocial(index)} className="absolute right-2 top-[38px] text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 size={16} /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SLOGAN & CONTACT */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b"><div className="flex items-center gap-3"><Quote className="w-5 h-5 text-primary" /><div><CardTitle className="text-xl">Brand Slogan</CardTitle></div></div></CardHeader>
              <CardContent className="pt-6"><div className="space-y-2"><div className="flex justify-between"><Label className="text-sm font-semibold">Slogan Text</Label><span className="text-[10px] text-muted-foreground">{data.slogan.length} / 150</span></div><textarea value={data.slogan} onChange={(e) => setData({ ...data, slogan: e.target.value.slice(0, 150) })} maxLength={150} placeholder="Enter brand slogan..." rows={4} className="w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-sm focus:border-primary outline-none transition-all" /></div></CardContent>
           </Card>
           <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b"><div className="flex items-center gap-3"><PhoneCall className="w-5 h-5 text-primary" /><div><CardTitle className="text-xl">Contact Us</CardTitle></div></div></CardHeader>
              <CardContent className="pt-6 space-y-4"><div className="space-y-2"><Label className="text-sm font-semibold">Email Address</Label><Input value={data.contact.email} onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} placeholder="contact@ahamgraham.com" /></div><div className="space-y-2"><Label className="text-sm font-semibold">Phone Number</Label><Input value={data.contact.phone} onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })} placeholder="+91 98765 43210" /></div></CardContent>
           </Card>
        </div>

        {/* AI TAGS SECTION (Merged from AiTagsPage) */}
        <Card className="border-primary/20 shadow-lg lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <div>
                <CardTitle className="text-xl">Animated AI Tags</CardTitle>
                <CardDescription>Manage keywords that scroll in the footer marquee.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Form to add tag */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 border border-primary/10 rounded-2xl bg-muted/20 space-y-5">
                  <h3 className="font-bold text-sm tracking-widest uppercase">Add New Tag</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Tag Name</Label>
                      <Input placeholder="e.g. Neurological Sync" value={tagForm.name} onChange={(e) => setTagForm({...tagForm, name: e.target.value})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Short Description</Label>
                      <Textarea placeholder="What does this tag represent?" value={tagForm.description} onChange={(e) => setTagForm({...tagForm, description: e.target.value})} className="bg-background min-h-[100px]" />
                    </div>
                    <Button onClick={handleAddTag} className="w-full shadow-lg" disabled={tagLoading}>
                      <Plus className="w-4 h-4 mr-2" />
                      {tagLoading ? "Adding..." : "Register Tag"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* List of tags */}
              <div className="lg:col-span-2">
                <div className="border border-primary/10 rounded-2xl overflow-hidden shadow-inner">
                  <Table>
                    <TableHeader className="bg-primary/5">
                      <TableRow className="border-primary/10">
                        <TableHead className="text-xs font-bold uppercase py-4 pl-6">Tag Name</TableHead>
                        <TableHead className="text-xs font-bold uppercase py-4">Context</TableHead>
                        <TableHead className="text-xs font-bold uppercase py-4 text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <TableRow key={tag._id} className="border-primary/5 hover:bg-primary/5 transition-colors group">
                            <TableCell className="font-bold py-4 pl-6">{tag.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm py-4 max-w-[250px] truncate">{tag.description}</TableCell>
                            <TableCell className="text-right pr-6 py-4">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTag(tag._id)} className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic">No AI tags registered yet.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FooterPage;
