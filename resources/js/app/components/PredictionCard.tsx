import { Prediction } from '@/app/types';
import { LevelBadge } from '@/app/components/LevelBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { 
  TrendingUp, 
  Landmark, 
  Trophy, 
  DollarSign, 
  GraduationCap, 
  Film,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Target
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';

interface PredictionCardProps {
  prediction: Prediction;
}

const categoryIcons = {
  trending: TrendingUp,
  politics: Landmark,
  sports: Trophy,
  finance: DollarSign,
  education: GraduationCap,
  entertainment: Film,
};

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

export function PredictionCard({ prediction }: PredictionCardProps) {
  const navigate = useNavigate();
  const Icon = categoryIcons[prediction.category];
  const categoryColor = categoryColors[prediction.category];
  const riskColor = riskColors[prediction.riskLevel];

  const timeRemaining = formatDistanceToNow(prediction.votingEndTime, { addSuffix: true });

  return (
    <div 
      className="glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={() => navigate(`/prediction/${prediction.id}`)}
      style={{
        boxShadow: `0 4px 24px ${categoryColor}15`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${categoryColor}22` }}
          >
            <Icon size={18} style={{ color: categoryColor }} />
          </div>
          <span 
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: categoryColor }}
          >
            {prediction.category}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
            style={{ 
              backgroundColor: `${riskColor}22`,
              color: riskColor 
            }}
          >
            <Target size={12} />
            {prediction.riskLevel.toUpperCase()}
          </div>
          <span 
            className="px-2 py-1 rounded-md text-xs font-bold"
            style={{ 
              backgroundColor: '#fbbf2422',
              color: '#fbbf24'
            }}
          >
            {prediction.rewardMultiplier}x
          </span>
        </div>
      </div>

      {/* Prediction Text */}
      <p className="text-base mb-4 text-foreground line-clamp-2">
        {prediction.text}
      </p>

      {/* Creator Info */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="w-6 h-6">
          <AvatarImage src={prediction.creator.avatar} alt={prediction.creator.username} />
          <AvatarFallback>{prediction.creator.username[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{prediction.creator.username}</span>
        <LevelBadge level={prediction.creator.level} size="sm" />
        <span className="text-xs text-muted-foreground ml-auto">
          {prediction.creator.accuracy.toFixed(1)}% accurate
        </span>
      </div>

      {/* Voting Progress (for yes-no) */}
      {prediction.answerType === 'yes-no' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-[#10b981]">
              <ThumbsUp size={12} />
              Agree {prediction.agreePercentage}%
            </span>
            <span className="flex items-center gap-1 text-[#ef4444]">
              <ThumbsDown size={12} />
              Disagree {prediction.disagreePercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-[#10b981] to-[#10b98188]"
              style={{ width: `${prediction.agreePercentage}%` }}
            />
            <div 
              className="h-full bg-gradient-to-r from-[#ef444488] to-[#ef4444]"
              style={{ width: `${prediction.disagreePercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>Ends {timeRemaining}</span>
        </div>
        <span>{prediction.totalVotes.toLocaleString()} votes</span>
      </div>
    </div>
  );
}
