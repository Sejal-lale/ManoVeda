import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const ContentEditor = () => {
  const { content, updateButtonText, updateMicrocopy, addAffirmation, removeAffirmation, updateContent } = useAdmin();
  const [newAffirmation, setNewAffirmation] = useState("");

  const handleAddAffirmation = () => {
    if (!newAffirmation.trim()) return;
    addAffirmation(newAffirmation);
    setNewAffirmation("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-foreground">Copy & Language</h2>
        <p className="text-sm text-muted-foreground">Edit all app text</p>
      </div>

      {/* Button Text */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Button Text</CardTitle>
          <CardDescription>Customize button labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Main Button Text</label>
            <Input
              value={content.buttonText.stuckButton}
              onChange={(e) => updateButtonText({ stuckButton: e.target.value })}
              placeholder="I'm Stuck"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Button Subtext</label>
            <Input
              value={content.buttonText.stuckSubtext}
              onChange={(e) => updateButtonText({ stuckSubtext: e.target.value })}
              placeholder="Tap once. I'll decide."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Shuffling Text</label>
            <Input
              value={content.buttonText.shufflingText}
              onChange={(e) => updateButtonText({ shufflingText: e.target.value })}
              placeholder="Finding..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Microcopy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Microcopy</CardTitle>
          <CardDescription>System messages and prompts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Timer Complete</label>
            <Input
              value={content.microcopy.timerComplete}
              onChange={(e) => updateMicrocopy({ timerComplete: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Mood Selected</label>
            <Input
              value={content.microcopy.moodSelected}
              onChange={(e) => updateMicrocopy({ moodSelected: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Chat Greeting</label>
            <Input
              value={content.microcopy.chatGreeting}
              onChange={(e) => updateMicrocopy({ chatGreeting: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Affirmations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Affirmations</CardTitle>
              <CardDescription>Encouraging messages shown to users</CardDescription>
            </div>
            <Switch
              checked={content.showValidationMessages}
              onCheckedChange={(v) => updateContent({ showValidationMessages: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.affirmations.map((affirmation, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={affirmation}
                readOnly
                className="flex-1 text-sm"
              />
              <button
                onClick={() => removeAffirmation(index)}
                className="p-2 rounded-full hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="flex gap-2 pt-2">
            <Input
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              placeholder="Add new affirmation..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddAffirmation()}
            />
            <Button onClick={handleAddAffirmation} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
