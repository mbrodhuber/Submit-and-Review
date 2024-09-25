import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const AuthorSubmissionForm = () => {
  const [formData, setFormData] = useState({
    mainZip: null,
    coverImage: null,
    previewFiles: [],
    title: '',
    description: '',
    splinePublicUrl: '',
    splineViewerUrl: '',
    tags: '',
    polycount: '',
    hasTextures: false,
    rigging: false,
    animated: false,
    interactivity: false,
    notesToReviewer: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, field) => {
    if (field === 'previewFiles') {
      setFormData(prevData => ({
        ...prevData,
        [field]: Array.from(e.target.files).slice(0, 5)
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [field]: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let mainZipPath, coverImagePath, previewUrls;

      // Upload main zip file if it exists
      if (formData.mainZip) {
        const { data: mainZipData, error: mainZipError } = await supabase.storage
          .from('submissions')
          .upload(`main_zips/${formData.title}/${formData.mainZip.name}`, formData.mainZip);

        if (mainZipError) throw mainZipError;
        mainZipPath = mainZipData.path;
      }

      // Upload cover image if it exists
      if (formData.coverImage) {
        const { data: coverImageData, error: coverImageError } = await supabase.storage
          .from('submissions')
          .upload(`cover_images/${formData.title}/${formData.coverImage.name}`, formData.coverImage);

        if (coverImageError) throw coverImageError;
        coverImagePath = coverImageData.path;
      }

      // Upload preview files if they exist
      if (formData.previewFiles.length > 0) {
        previewUrls = await Promise.all(
          formData.previewFiles.map(async (file) => {
            const { data, error } = await supabase.storage
              .from('submissions')
              .upload(`previews/${formData.title}/${file.name}`, file);
            if (error) throw error;
            return data.path;
          })
        );
      }

      // Insert submission data into database
      const { data, error } = await supabase
        .from('submissions')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            main_zip_url: mainZipPath,
            cover_image_url: coverImagePath,
            preview_urls: previewUrls,
            spline_public_url: formData.splinePublicUrl,
            spline_viewer_url: formData.splineViewerUrl,
            tags: formData.tags,
            polycount: formData.polycount,
            has_textures: formData.hasTextures,
            rigging: formData.rigging,
            animated: formData.animated,
            interactivity: formData.interactivity,
            notes_to_reviewer: formData.notesToReviewer,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      alert('Submission successful!');
      // Reset form or redirect user
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during submission.');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submit New Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="mainZip">Main Zip File</Label>
              <Input id="mainZip" type="file" onChange={(e) => handleFileChange(e, 'mainZip')} accept=".zip" />
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="coverImage">Cover Image</Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cover images should be 3,400x2,600px and in a PNG format</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input id="coverImage" type="file" accept="image/png" onChange={(e) => handleFileChange(e, 'coverImage')} />
            </div>
            <div>
              <Label htmlFor="previewFiles">Preview Images/Videos (up to 5)</Label>
              <Input id="previewFiles" type="file" multiple accept="image/*,video/*" onChange={(e) => handleFileChange(e, 'previewFiles')} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Item Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="description">Item Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="splinePublicUrl">Spline Public Preview URL</Label>
              <Input id="splinePublicUrl" name="splinePublicUrl" type="url" value={formData.splinePublicUrl} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="splineViewerUrl">Spline Viewer Preview URL</Label>
              <Input id="splineViewerUrl" name="splineViewerUrl" type="url" value={formData.splineViewerUrl} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="polycount">Polycount</Label>
              <Input id="polycount" name="polycount" value={formData.polycount} onChange={handleInputChange} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hasTextures" name="hasTextures" checked={formData.hasTextures} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasTextures: checked }))} />
              <Label htmlFor="hasTextures">Has Textures</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rigging" name="rigging" checked={formData.rigging} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rigging: checked }))} />
              <Label htmlFor="rigging">Rigging</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="animated" name="animated" checked={formData.animated} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, animated: checked }))} />
              <Label htmlFor="animated">Animated</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="interactivity" name="interactivity" checked={formData.interactivity} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, interactivity: checked }))} />
              <Label htmlFor="interactivity">Interactivity</Label>
            </div>
            <div>
              <Label htmlFor="notesToReviewer">Notes to Reviewer</Label>
              <Textarea id="notesToReviewer" name="notesToReviewer" value={formData.notesToReviewer} onChange={handleInputChange} />
            </div>
          </div>

          <Button type="submit">Submit for Review</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthorSubmissionForm;