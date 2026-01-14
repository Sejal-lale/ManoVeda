import { useState } from "react";
import { Plus, Trash2, Star, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, AdminTheme } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ThemeManager = () => {
  const { adminThemes, addTheme, updateTheme, deleteTheme, setDefaultTheme } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: "",
    emotion: "",
    background: "#F6EAEA",
    accent: "#E7B7B7",
    text: "#5A2E2E",
    glowIntensity: 40,
    isDefault: false,
  });

  const handleAddTheme = () => {
    if (!newTheme.name.trim()) return;
    addTheme(newTheme);
    setNewTheme({
      name: "",
      emotion: "",
      background: "#F6EAEA",
      accent: "#E7B7B7",
      text: "#5A2E2E",
      glowIntensity: 40,
      isDefault: false,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-foreground">Themes</h2>
          <p className="text-sm text-muted-foreground">Customize app appearance</p>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Create Theme
        </Button>
      </div>

      {/* Add new theme form */}
      {isAdding && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Theme name"
                value={newTheme.name}
                onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Emotion feel"
                value={newTheme.emotion}
                onChange={(e) => setNewTheme(prev => ({ ...prev, emotion: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTheme.background}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, background: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <Input
                    value={newTheme.background}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, background: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTheme.accent}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <Input
                    value={newTheme.accent}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Text</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTheme.text}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, text: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <Input
                    value={newTheme.text}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, text: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs text-muted-foreground">Glow Intensity</label>
                <span className="text-xs text-muted-foreground">{newTheme.glowIntensity}%</span>
              </div>
              <Slider
                value={[newTheme.glowIntensity]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setNewTheme(prev => ({ ...prev, glowIntensity: v }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddTheme} className="flex-1">Create</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme grid */}
      <div className="grid gap-3">
        {adminThemes.map((theme) => (
          <Card key={theme.id} className={cn(theme.isDefault && "ring-2 ring-primary")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Theme preview */}
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: theme.background }}
                >
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>

                {/* Theme info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{theme.name}</h3>
                    {theme.isDefault && (
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    )}
                    {theme.isBuiltIn && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Built-in
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.emotion}</p>
                  <div className="flex gap-1 mt-2">
                    <div 
                      className="w-5 h-5 rounded border"
                      style={{ backgroundColor: theme.background }}
                      title="Background"
                    />
                    <div 
                      className="w-5 h-5 rounded border"
                      style={{ backgroundColor: theme.accent }}
                      title="Accent"
                    />
                    <div 
                      className="w-5 h-5 rounded border"
                      style={{ backgroundColor: theme.text }}
                      title="Text"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!theme.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultTheme(theme.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  {!theme.isBuiltIn && (
                    <button
                      onClick={() => deleteTheme(theme.id)}
                      className="p-2 rounded-full hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
