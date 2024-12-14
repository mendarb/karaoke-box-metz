import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface PromoCodeFormData {
  code: string;
  description: string;
  type: string;
  value: string;
  max_uses: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PromoCodeFormProps {
  initialData?: any;
  onSubmit: (formData: PromoCodeFormData) => void;
  isLoading: boolean;
}

export const PromoCodeForm = ({ initialData, onSubmit, isLoading }: PromoCodeFormProps) => {
  const [formData, setFormData] = useState<PromoCodeFormData>({
    code: initialData?.code || '',
    description: initialData?.description || '',
    type: initialData?.type || 'percentage',
    value: initialData?.value || '',
    max_uses: initialData?.max_uses || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Pourcentage</SelectItem>
            <SelectItem value="fixed_amount">Montant fixe</SelectItem>
            <SelectItem value="free">Gratuit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type !== 'free' && (
        <div className="space-y-2">
          <Label htmlFor="value">
            {formData.type === 'percentage' ? 'Pourcentage' : 'Montant (€)'}
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            required
            min="0"
            step={formData.type === 'percentage' ? "1" : "0.01"}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="max_uses">Nombre maximum d'utilisations</Label>
        <Input
          id="max_uses"
          type="number"
          value={formData.max_uses}
          onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
          min="0"
          placeholder="Illimité"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Date de début</Label>
        <Input
          id="start_date"
          type="datetime-local"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end_date">Date de fin</Label>
        <Input
          id="end_date"
          type="datetime-local"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Actif</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};