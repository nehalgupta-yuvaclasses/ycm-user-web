import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PreferencesSettingsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  isSaving?: boolean;
}

export function PreferencesSettings({ language, onLanguageChange, isSaving }: PreferencesSettingsProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-medium text-foreground">Preferences</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={onLanguageChange} disabled={isSaving}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Choose a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-IN">English (IN)</SelectItem>
              <SelectItem value="hi-IN">Hindi</SelectItem>
              <SelectItem value="hinglish">Hinglish</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Used for labels and messages in the app.</p>
        </div>
      </CardContent>
    </Card>
  );
}
