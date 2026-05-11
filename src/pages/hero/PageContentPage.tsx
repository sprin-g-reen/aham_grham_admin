import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { API_URL, SITE_ORIGIN, UPLOADS_URL } from "@/config"
import { compressImage, fileToBase64 } from "../../lib/image-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, Sparkles, Layout, Info, Heart, Quote, Users, Trash2, Home, List, Zap, MapPin, ShoppingBag, Calendar, Activity } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PageContentManagement = () => {
  const [loading, setLoading] = useState(false)
  const [selectedPage, setSelectedPage] = useState('home')
  
  const [heroData, setHeroData] = useState<any>(null)
  const [heroImage, setHeroImage] = useState<File | null>(null)

  const [aboutData, setAboutData] = useState<any>(null)
  const [aboutCtaImage, setAboutCtaImage] = useState<File | null>(null)

  const compressImage = (file: File, maxWidth = 1280, quality = 0.7): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', quality);
        };
      };
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    if (selectedPage === 'about') {
      fetchAbout()
    } else {
      fetchHero()
    }
  }, [selectedPage])

  const fetchHero = async () => {
    try {
      const response = await axios.get(`${API_URL}/hero?page=${selectedPage}`)
      setHeroData(response.data)
    } catch (error) {
      toast.error(`Failed to fetch content for ${selectedPage}`)
      setHeroData({ kicker: '', title: '', subtitle: '', buttonText: '', image: '', sections: {} })
    }
  }

  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${API_URL}/about`)
      setAboutData(response.data)
    } catch (error) {
      toast.error("Failed to fetch About page content")
    }
  }

  const handleUpdateGeneric = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = {
        page: selectedPage,
        kicker: heroData.kicker,
        title: heroData.title,
        subtitle: heroData.subtitle,
        buttonText: heroData.buttonText,
        sections: heroData.sections || {}
      }
      
      if (heroImage) {
        const compressed = await compressImage(heroImage);
        payload.heroImage = await fileToBase64(compressed);
      }

      await axios.put(`${API_URL}/hero`, payload)
      toast.success(`${selectedPage.toUpperCase()} content updated successfully`)
      fetchHero()
    } catch (error) {
      toast.error(`Failed to update ${selectedPage} section`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAbout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = {
        hero: aboutData.hero,
        halfSections: aboutData.halfSections,
        corePhilosophy: aboutData.corePhilosophy,
        lineageVoice: aboutData.lineageVoice,
        ancientLineage: aboutData.ancientLineage,
        faculties: aboutData.faculties,
        cta: aboutData.cta
      }
      
      if (heroImage) {
        const compressed = await compressImage(heroImage);
        payload.heroImage = await fileToBase64(compressed);
      }
      if (aboutCtaImage) {
        const compressed = await compressImage(aboutCtaImage);
        payload.ctaImage = await fileToBase64(compressed);
      }

      await axios.put(`${API_URL}/about`, payload)
      toast.success("About page content updated successfully")
      fetchAbout()
    } catch (error) {
      toast.error("Failed to update About page")
    } finally {
      setLoading(false)
    }
  }

  const updateSection = (sectionPath: string, value: any) => {
    const keys = sectionPath.split('.');
    setHeroData((prev: any) => {
      const newData = { ...prev };
      let current = newData.sections;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Layout className="w-8 h-8 text-primary" />
            Page Content Management
          </h1>
          <p className="text-muted-foreground">Manage text content for all website pages (excluding items with separate controllers).</p>
        </div>

        <div className="w-full md:w-64">
          <Label className="mb-2 block text-xs font-bold uppercase">Select Page to Manage</Label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full bg-background border-primary/20">
              <SelectValue placeholder="Choose a page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home Page</SelectItem>
              <SelectItem value="about">About Us Page</SelectItem>
              <SelectItem value="services">Services Page</SelectItem>
              <SelectItem value="events">Events Page</SelectItem>
              <SelectItem value="centers">Centers Page</SelectItem>
              <SelectItem value="sacred-moon-oil">Shop</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPage === 'about' ? (
        // --- ABOUT PAGE ---
        aboutData ? (
          <form onSubmit={handleUpdateAbout} className="space-y-8">
            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 bg-primary/5">
                <Sparkles className="w-5 h-5 text-primary" />
                <div><CardTitle>About Hero Section</CardTitle><CardDescription>Main banner at the top of the About page.</CardDescription></div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs font-bold">Kicker</Label><Input value={aboutData.hero.kicker} onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, kicker: e.target.value}})} /></div>
                  <div className="space-y-1"><Label className="text-xs font-bold">Title</Label><Input value={aboutData.hero.title} onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, title: e.target.value}})} /></div>
                </div>
                <div className="space-y-1"><Label className="text-xs font-bold">Subtitle</Label><Textarea value={aboutData.hero.subtitle} onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, subtitle: e.target.value}})} className="min-h-[100px]" /></div>
                <div className="space-y-1"><Label className="text-xs font-bold">Hero Background Image</Label><Input type="file" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} /><p className="text-[10px] text-muted-foreground mt-1">Current image: {aboutData.hero.image}</p></div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 bg-primary/5">
                <Info className="w-5 h-5 text-primary" />
                <div><CardTitle>Narrative Sections</CardTitle><CardDescription>Two side-by-side informational sections.</CardDescription></div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {aboutData.halfSections?.map((section: any, index: number) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-1"><Label className="text-xs font-bold">{index === 0 ? "Left Box" : "Right Box"} - Title</Label><Input value={section.title} onChange={(e) => { const newSections = aboutData.halfSections.map((s: any, i: number) => i === index ? { ...s, title: e.target.value } : s); setAboutData({...aboutData, halfSections: newSections}); }} /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold">{index === 0 ? "Left Box" : "Right Box"} - Content</Label><Textarea value={section.content} className="min-h-[120px]" onChange={(e) => { const newSections = aboutData.halfSections.map((s: any, i: number) => i === index ? { ...s, content: e.target.value } : s); setAboutData({...aboutData, halfSections: newSections}); }} /></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Heart className="w-5 h-5 text-primary" /><div><CardTitle>Core Philosophy</CardTitle></div></CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-1"><Label className="text-xs font-bold">Philosophy Title</Label><Input value={aboutData.corePhilosophy.title} onChange={(e) => setAboutData({...aboutData, corePhilosophy: {...aboutData.corePhilosophy, title: e.target.value}})} /></div>
                <div className="space-y-1"><Label className="text-xs font-bold">Philosophy Statement</Label><Textarea className="min-h-[100px]" value={aboutData.corePhilosophy.content} onChange={(e) => setAboutData({...aboutData, corePhilosophy: {...aboutData.corePhilosophy, content: e.target.value}})} /></div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Users className="w-5 h-5 text-primary" /><div><CardTitle>Our Faculties</CardTitle></div></CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex justify-between items-center border-b pb-2"><h3 className="text-sm font-bold uppercase tracking-widest text-primary">Faculty Members</h3><Button type="button" variant="outline" size="sm" onClick={() => { const newGuides = [...(aboutData.faculties?.guides || []), { name: '', role: '', bio: '', image: 'placeholder.png' }]; setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}}); }}>Add Guide</Button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aboutData.faculties?.guides?.map((guide: any, index: number) => (
                    <div key={index} className="p-4 border rounded-xl bg-muted/30 space-y-3 relative group">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" onClick={() => { const newGuides = aboutData.faculties.guides.filter((_: any, i: number) => i !== index); setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}}); }}><Trash2 className="w-4 h-4" /></Button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label className="text-[10px] font-bold">Name</Label><Input value={guide.name} onChange={(e) => { const newGuides = aboutData.faculties.guides.map((g: any, i: number) => i === index ? { ...g, name: e.target.value } : g); setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}}); }} /></div>
                        <div className="space-y-1"><Label className="text-[10px] font-bold">Role</Label><Input value={guide.role} onChange={(e) => { const newGuides = aboutData.faculties.guides.map((g: any, i: number) => i === index ? { ...g, role: e.target.value } : g); setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}}); }} /></div>
                      </div>
                      <div className="space-y-1"><Label className="text-[10px] font-bold">Bio</Label><Textarea value={guide.bio} className="h-20" onChange={(e) => { const newGuides = aboutData.faculties.guides.map((g: any, i: number) => i === index ? { ...g, bio: e.target.value } : g); setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}}); }} /></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Sparkles className="w-5 h-5 text-primary" /><div><CardTitle>Bottom CTA</CardTitle></div></CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs font-bold">Title</Label><Input value={aboutData.cta?.title} onChange={(e) => setAboutData({...aboutData, cta: {...aboutData.cta, title: e.target.value}})} /></div>
                  <div className="space-y-1"><Label className="text-xs font-bold">Button Text</Label><Input value={aboutData.cta?.buttonText} onChange={(e) => setAboutData({...aboutData, cta: {...aboutData.cta, buttonText: e.target.value}})} /></div>
                </div>
                <div className="space-y-1"><Label className="text-xs font-bold">Subtitle</Label><Textarea value={aboutData.cta?.subtitle} onChange={(e) => setAboutData({...aboutData, cta: {...aboutData.cta, subtitle: e.target.value}})} /></div>
                <div className="space-y-1"><Label className="text-xs font-bold">CTA Background Image</Label><Input type="file" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} /></div>
              </CardContent>
            </Card>

            <div className="sticky bottom-6 flex justify-end">
              <Button type="submit" size="lg" className="shadow-xl px-10" disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? "Saving..." : "Publish Full About Us Content"}</Button>
            </div>
          </form>
        ) : (
          <div className="py-20 text-center italic text-muted-foreground">Loading About content...</div>
        )
      ) : heroData ? (
        // --- COMPREHENSIVE MULTI-PAGE FORM ---
        <form onSubmit={handleUpdateGeneric} className="space-y-10">
          
          {/* 1. HERO SECTION (Common for all) */}
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="flex flex-row items-center gap-3 bg-primary/5">
              <Sparkles className="w-5 h-5 text-primary" />
              <div><CardTitle className="capitalize">{selectedPage.replace(/-/g, ' ')} Hero Section</CardTitle><CardDescription>The main banner at the very top of the page.</CardDescription></div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="text-sm font-bold">Kicker (Tiny Header)</Label><Input value={heroData.kicker} onChange={(e) => setHeroData({...heroData, kicker: e.target.value})} /></div>
                <div className="space-y-2"><Label className="text-sm font-bold">Main Title</Label><Input value={heroData.title} onChange={(e) => setHeroData({...heroData, title: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label className="text-sm font-bold">Hero Subtitle / Description</Label><Textarea value={heroData.subtitle} onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})} className="min-h-[100px]" /></div>
              <div className="p-4 border rounded-xl bg-muted/10 space-y-3">
                <Label className="text-sm font-bold">Hero Background Image</Label>
                <Input type="file" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} />
                {heroData.image && <p className="text-[10px] font-mono text-muted-foreground">Current: {heroData.image}</p>}
              </div>
            </CardContent>
          </Card>

          {/* 2. PAGE-SPECIFIC CONTENT SECTIONS */}
          
          {/* HOME PAGE SECTIONS */}
          {selectedPage === 'home' && (
            <>
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Heart className="w-5 h-5 text-primary" /><div><CardTitle>Experience of Yoga Section</CardTitle><CardDescription>The dual-column section explaining your core practices.</CardDescription></div></CardHeader>
                <CardContent className="space-y-8 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Section Main Title</Label><Input value={heroData.sections?.experience?.title || ''} onChange={(e) => updateSection('experience.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Section Sub-description</Label><Textarea value={heroData.sections?.experience?.description || ''} onChange={(e) => updateSection('experience.description', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-5 border rounded-2xl bg-muted/20">
                      <h3 className="font-bold text-primary flex items-center gap-2 tracking-widest uppercase text-xs">Left: Yoga Column</h3>
                      <div className="space-y-2"><Label className="text-xs font-bold">Title</Label><Input value={heroData.sections?.experience?.yoga?.title || ''} onChange={(e) => updateSection('experience.yoga.title', e.target.value)} /></div>
                      <div className="space-y-2"><Label className="text-xs font-bold">Description</Label><Textarea value={heroData.sections?.experience?.yoga?.description || ''} onChange={(e) => updateSection('experience.yoga.description', e.target.value)} /></div>
                    </div>
                    <div className="space-y-4 p-5 border rounded-2xl bg-muted/20">
                      <h3 className="font-bold text-primary flex items-center gap-2 tracking-widest uppercase text-xs">Right: Meditation Column</h3>
                      <div className="space-y-2"><Label className="text-xs font-bold">Title</Label><Input value={heroData.sections?.experience?.meditation?.title || ''} onChange={(e) => updateSection('experience.meditation.title', e.target.value)} /></div>
                      <div className="space-y-2"><Label className="text-xs font-bold">Description</Label><Textarea value={heroData.sections?.experience?.meditation?.description || ''} onChange={(e) => updateSection('experience.meditation.description', e.target.value)} /></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><List className="w-5 h-5 text-primary" /><CardTitle>Programs Section Header</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Title</Label><Input value={heroData.sections?.programs?.title || ''} onChange={(e) => updateSection('programs.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Subtitle</Label><Textarea value={heroData.sections?.programs?.description || ''} onChange={(e) => updateSection('programs.description', e.target.value)} /></div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Zap className="w-5 h-5 text-primary" /><CardTitle>Blog Section Header</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Title</Label><Input value={heroData.sections?.blog?.title || ''} onChange={(e) => updateSection('blog.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Subtitle</Label><Textarea value={heroData.sections?.blog?.description || ''} onChange={(e) => updateSection('blog.description', e.target.value)} /></div>
                  </CardContent>
                </Card>
              </div>
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Zap className="w-5 h-5 text-primary" /><div><CardTitle>Home Bottom CTA (Healing Path)</CardTitle></div></CardHeader>
                <CardContent className="space-y-4 pt-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><Label className="text-sm font-bold">CTA Title</Label><Input value={heroData.sections?.cta?.title || ''} onChange={(e) => updateSection('cta.title', e.target.value)} /></div><div className="space-y-2"><Label className="text-sm font-bold">CTA Description</Label><Textarea value={heroData.sections?.cta?.description || ''} onChange={(e) => updateSection('cta.description', e.target.value)} className="min-h-[100px]" /></div></div></CardContent>
              </Card>
            </>
          )}

          {/* SERVICES PAGE SECTIONS */}
          {selectedPage === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><List className="w-5 h-5 text-primary" /><CardTitle>Programs Section Text</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2"><Label className="text-sm font-bold">Section Header</Label><Input value={heroData.sections?.programs?.title || ''} onChange={(e) => updateSection('programs.title', e.target.value)} /></div>
                  <div className="space-y-2"><Label className="text-sm font-bold">Section Subtitle</Label><Textarea value={heroData.sections?.programs?.description || ''} onChange={(e) => updateSection('programs.description', e.target.value)} /></div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><ShoppingBag className="w-5 h-5 text-primary" /><CardTitle>Products Section Text</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2"><Label className="text-sm font-bold">Section Header</Label><Input value={heroData.sections?.products?.title || ''} onChange={(e) => updateSection('products.title', e.target.value)} /></div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* EVENTS PAGE SECTIONS */}
          {selectedPage === 'events' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Calendar className="w-5 h-5 text-primary" /><CardTitle>Main Events Section</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Header</Label><Input value={heroData.sections?.mainEvents?.title || ''} onChange={(e) => updateSection('mainEvents.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Description</Label><Textarea value={heroData.sections?.mainEvents?.description || ''} onChange={(e) => updateSection('mainEvents.description', e.target.value)} /></div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Info className="w-5 h-5 text-primary" /><CardTitle>Highlights Section</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Header</Label><Input value={heroData.sections?.highlights?.title || ''} onChange={(e) => updateSection('highlights.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Description</Label><Textarea value={heroData.sections?.highlights?.description || ''} onChange={(e) => updateSection('highlights.description', e.target.value)} /></div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Zap className="w-5 h-5 text-primary" /><CardTitle>Workshop Section</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Header</Label><Input value={heroData.sections?.workshop?.title || ''} onChange={(e) => updateSection('workshop.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Description</Label><Textarea value={heroData.sections?.workshop?.description || ''} onChange={(e) => updateSection('workshop.description', e.target.value)} /></div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Zap className="w-5 h-5 text-primary" /><CardTitle>Upcoming Events Section</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Header</Label><Input value={heroData.sections?.upcoming?.title || ''} onChange={(e) => updateSection('upcoming.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Description</Label><Textarea value={heroData.sections?.upcoming?.description || ''} onChange={(e) => updateSection('upcoming.description', e.target.value)} /></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* CENTERS PAGE SECTIONS */}
          {selectedPage === 'centers' && (
            <div className="space-y-8">
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><MapPin className="w-5 h-5 text-primary" /><CardTitle>Centers List Content</CardTitle></CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-sm font-bold">Section Header</Label><Input value={heroData.sections?.mainCenters?.title || ''} onChange={(e) => updateSection('mainCenters.title', e.target.value)} /></div>
                    <div className="space-y-2"><Label className="text-sm font-bold">Section Description</Label><Textarea value={heroData.sections?.mainCenters?.description || ''} onChange={(e) => updateSection('mainCenters.description', e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Activity className="w-5 h-5 text-primary" /><CardTitle>Live Stats (Numbers only)</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                   <div className="space-y-2 p-4 border rounded-xl bg-muted/10 text-center"><Label className="text-xs font-bold uppercase text-primary">Active Portals</Label><Input className="text-center text-xl font-bold" value={heroData.sections?.stats?.active || ''} onChange={(e) => updateSection('stats.active', e.target.value)} /></div>
                   <div className="space-y-2 p-4 border rounded-xl bg-muted/10 text-center"><Label className="text-xs font-bold uppercase text-primary">Opening Soon</Label><Input className="text-center text-xl font-bold" value={heroData.sections?.stats?.soon || ''} onChange={(e) => updateSection('stats.soon', e.target.value)} /></div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><Zap className="w-5 h-5 text-primary" /><div><CardTitle>Centers Bottom CTA</CardTitle></div></CardHeader>
                <CardContent className="space-y-4 pt-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><Label className="text-sm font-bold">CTA Title</Label><Input value={heroData.sections?.cta?.title || ''} onChange={(e) => updateSection('cta.title', e.target.value)} /></div><div className="space-y-2"><Label className="text-sm font-bold">CTA Subtitle</Label><Textarea value={heroData.sections?.cta?.description || ''} onChange={(e) => updateSection('cta.description', e.target.value)} className="min-h-[80px]" /></div></div></CardContent>
              </Card>
            </div>
          )}

          {/* SHOP PAGE SECTIONS */}
          {selectedPage === 'sacred-moon-oil' && (
             <Card className="border-primary/20 shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 bg-primary/5"><ShoppingBag className="w-5 h-5 text-primary" /><CardTitle>Product Details (Static Text)</CardTitle></CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2"><Label className="text-sm font-bold">Product Pitch / Description</Label><Textarea value={heroData.subtitle} onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})} className="min-h-[150px]" /></div>
              </CardContent>
            </Card>
          )}

          <div className="sticky bottom-6 flex justify-end">
            <Button type="submit" size="lg" className="shadow-xl px-12 h-14 text-lg" disabled={loading}><Save className="w-5 h-5 mr-2" />{loading ? "Saving Changes..." : `Publish ${selectedPage.replace(/-/g, ' ')} Content`}</Button>
          </div>
        </form>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center space-y-4 text-muted-foreground italic border-2 border-dashed rounded-3xl">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>Syncing content for {selectedPage.replace(/-/g, ' ')}...</p>
        </div>
      )}
    </div>
  )
}

export default PageContentManagement
