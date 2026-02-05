import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { Category, AnswerType, RiskLevel, getRiskMultiplier } from '@/app/types';
import { toast } from 'sonner';
import { TopNav } from '@/app/components/TopNav';
import { MobileNav } from '@/app/components/MobileNav';

export function CreatePredictionScreen() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('trending');
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [answerType, setAnswerType] = useState<AnswerType>('yes-no');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');
  const [mcqOptions, setMcqOptions] = useState<string[]>(['', '']);
  const [numericValue, setNumericValue] = useState('');
  const [numericTolerance, setNumericTolerance] = useState('');
  const [votingEndDate, setVotingEndDate] = useState('');
  const [resultPublishDate, setResultPublishDate] = useState('');

  const handleAddOption = () => {
    if (mcqOptions.length < 6) {
      setMcqOptions([...mcqOptions, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (mcqOptions.length > 2) {
      setMcqOptions(mcqOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = value;
    setMcqOptions(newOptions);
  };

  const handlePublish = () => {
    if (!text.trim()) {
      toast.error('Please enter a prediction');
      return;
    }
    if (!votingEndDate || !resultPublishDate) {
      toast.error('Please set voting and result dates');
      return;
    }

    toast.success('Prediction created successfully!');
    setTimeout(() => navigate('/home'), 500);
  };

  const rewardMultiplier = getRiskMultiplier(riskLevel);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <TopNav />
      
      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Prediction</h1>
            <p className="text-muted-foreground">Make a bold claim. Set the timeline. Let the world vote.</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="glass-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prediction Text */}
          <div className="space-y-2">
            <Label>Prediction</Label>
            <Textarea
              placeholder="What do you predict will happen?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="glass-card min-h-24"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{text.length}/500</p>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="font-normal cursor-pointer">
                  Public - Visible to everyone
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="font-normal cursor-pointer">
                  Private - Only group members (requires group)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voting End Date</Label>
              <Input
                type="datetime-local"
                value={votingEndDate}
                onChange={(e) => setVotingEndDate(e.target.value)}
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <Label>Result Publish Date</Label>
              <Input
                type="datetime-local"
                value={resultPublishDate}
                onChange={(e) => setResultPublishDate(e.target.value)}
                className="glass-card"
              />
            </div>
          </div>

          {/* Answer Type */}
          <div className="space-y-2">
            <Label>Answer Type</Label>
            <Select value={answerType} onValueChange={(v) => setAnswerType(v as AnswerType)}>
              <SelectTrigger className="glass-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="yes-no">Yes / No</SelectItem>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="numeric">Numeric Value</SelectItem>
                <SelectItem value="datetime">Date / Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MCQ Options */}
          {answerType === 'mcq' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={mcqOptions.length >= 6}
                >
                  <Plus size={16} className="mr-1" />
                  Add Option
                </Button>
              </div>
              {mcqOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="glass-card"
                  />
                  {mcqOptions.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Numeric Value */}
          {answerType === 'numeric' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Value</Label>
                <Input
                  type="number"
                  placeholder="e.g., 85000"
                  value={numericValue}
                  onChange={(e) => setNumericValue(e.target.value)}
                  className="glass-card"
                />
              </div>
              <div className="space-y-2">
                <Label>Tolerance (±)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={numericTolerance}
                  onChange={(e) => setNumericTolerance(e.target.value)}
                  className="glass-card"
                />
              </div>
            </div>
          )}

          {/* Publish Button */}
          <Button
            className="w-full h-12"
            onClick={handlePublish}
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            }}
          >
            Publish Prediction
          </Button>
        </motion.div>
      </div>

      <MobileNav />
    </div>
  );
}