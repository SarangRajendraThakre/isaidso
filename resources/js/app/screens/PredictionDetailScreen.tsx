import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { LevelBadge } from '@/app/components/LevelBadge';
import { Progress } from '@/app/components/ui/progress';
import { TopNav } from '@/app/components/TopNav';
import { MobileNav } from '@/app/components/MobileNav';
import { mockPredictions } from '@/app/data/mockData';
import { 
  ArrowLeft, 
  Share2, 
  Clock, 
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Target
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

const categoryColors = {
  trending: '#a855f7',
  politics: '#ef4444',
  sports: '#10b981',
  finance: '#fbbf24',
  education: '#06b6d4',
  entertainment: '#ec4899',
};

const riskColors = {
  low: '#10b981',
  medium: '#fbbf24',
  high: '#ef4444',
};

export function PredictionDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const prediction = mockPredictions.find((p) => p.id === id);

  if (!prediction) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Prediction not found</p>
        </div>
        <MobileNav />
      </div>
    );
  }

  const categoryColor = categoryColors[prediction.category];
  const riskColor = riskColors[prediction.riskLevel];

  const handleVote = () => {
    if (prediction.answerType === 'yes-no' && !selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }
    if (prediction.answerType === 'mcq' && !selectedAnswer) {
      toast.error('Please select an option');
      return;
    }

    toast.success('Vote submitted successfully!');
    setTimeout(() => navigate('/home'), 1000);
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-border/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 size={20} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Category & Risk Badge */}
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
              style={{
                backgroundColor: `${categoryColor}22`,
                color: categoryColor,
              }}
            >
              {prediction.category}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium uppercase flex items-center gap-1"
              style={{
                backgroundColor: `${riskColor}22`,
                color: riskColor,
              }}
            >
              <Target size={12} />
              {prediction.riskLevel}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: '#fbbf2422',
                color: '#fbbf24',
              }}
            >
              {prediction.rewardMultiplier}x Reward
            </span>
          </div>

          {/* Prediction Text */}
          <div className="glass-card rounded-2xl p-6">
            <h1 className="text-2xl font-bold leading-relaxed">{prediction.text}</h1>
          </div>

          {/* Creator Card */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={prediction.creator.avatar} alt={prediction.creator.username} />
                <AvatarFallback>{prediction.creator.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{prediction.creator.username}</p>
                <LevelBadge level={prediction.creator.level} size="sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                <p className="text-lg font-bold text-[#10b981]">
                  {prediction.creator.accuracy.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Predictions</p>
                <p className="text-lg font-bold">{prediction.creator.predictionsResolved}</p>
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#a855f7]" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Voting Ends</p>
                <p className="font-medium">{formatDistanceToNow(prediction.votingEndTime, { addSuffix: true })}</p>
                <p className="text-xs text-muted-foreground">{format(prediction.votingEndTime, 'PPpp')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#06b6d4]" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Result Published</p>
                <p className="font-medium">{format(prediction.resultPublishTime, 'PPP')}</p>
              </div>
            </div>
          </div>

          {/* Current Results (for yes-no) */}
          {prediction.answerType === 'yes-no' && (
            <div className="glass-card rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-4">Current Voting Distribution</p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-[#10b981]">
                      <ThumbsUp size={16} />
                      Agree
                    </span>
                    <span className="font-bold text-[#10b981]">{prediction.agreePercentage}%</span>
                  </div>
                  <Progress value={prediction.agreePercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-[#ef4444]">
                      <ThumbsDown size={16} />
                      Disagree
                    </span>
                    <span className="font-bold text-[#ef4444]">{prediction.disagreePercentage}%</span>
                  </div>
                  <Progress value={prediction.disagreePercentage} className="h-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                {prediction.totalVotes.toLocaleString()} total votes
              </p>
            </div>
          )}

          {/* Voting Section */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold mb-4">Cast Your Vote</h3>
            
            {prediction.answerType === 'yes-no' && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedAnswer('yes')}
                  className={`p-4 rounded-xl transition-all ${
                    selectedAnswer === 'yes'
                      ? 'ring-2 ring-[#10b981]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background:
                      selectedAnswer === 'yes'
                        ? 'linear-gradient(135deg, #10b98133 0%, #10b98122 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  }}
                >
                  <ThumbsUp size={24} className="mx-auto mb-2 text-[#10b981]" />
                  <p className="font-medium">Agree</p>
                </button>
                
                <button
                  onClick={() => setSelectedAnswer('no')}
                  className={`p-4 rounded-xl transition-all ${
                    selectedAnswer === 'no'
                      ? 'ring-2 ring-[#ef4444]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background:
                      selectedAnswer === 'no'
                        ? 'linear-gradient(135deg, #ef444433 0%, #ef444422 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  }}
                >
                  <ThumbsDown size={24} className="mx-auto mb-2 text-[#ef4444]" />
                  <p className="font-medium">Disagree</p>
                </button>
              </div>
            )}

            {prediction.answerType === 'mcq' && prediction.options && (
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3 mb-4">
                {prediction.options.map((option) => (
                  <label
                    key={option.id}
                    className={`glass-card p-4 rounded-xl cursor-pointer transition-all block ${
                      selectedAnswer === option.id ? 'ring-2 ring-[#a855f7]' : ''
                    }`}
                    style={{
                      background:
                        selectedAnswer === option.id
                          ? 'linear-gradient(135deg, #a855f722 0%, #a855f711 100%)'
                          : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="cursor-pointer flex-1 font-normal">
                        {option.text}
                      </Label>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            )}

            <Button
              className="w-full h-12"
              onClick={handleVote}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              }}
            >
              Submit Vote
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              Note: Voting does not affect your rank. Only your own predictions count!
            </p>
          </div>
        </motion.div>
      </div>

      <MobileNav />
    </div>
  );
}