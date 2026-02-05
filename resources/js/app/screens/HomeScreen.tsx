import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { PredictionCard } from '@/app/components/PredictionCard';
import { MobileNav } from '@/app/components/MobileNav';
import { TopNav } from '@/app/components/TopNav';
import { mockPredictions, currentUser } from '@/app/data/mockData';
import { Category } from '@/app/types';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const categories: { value: Category; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'politics', label: 'Politics' },
  { value: 'sports', label: 'Sports' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPredictions = mockPredictions.filter((pred) => {
    const categoryMatch = selectedCategory === 'trending' || pred.category === selectedCategory;
    const searchMatch = pred.text.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNav showSearch={true} onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)} className="mb-6">
          <TabsList className="glass-card w-full justify-start overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-[#a855f7]"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Predictions Grid */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PredictionCard prediction={prediction} />
            </motion.div>
          ))}

          {filteredPredictions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No predictions found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Create Button - Mobile Only */}
      <button
        onClick={() => navigate('/create')}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 transition-transform hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)',
        }}
      >
        <Plus size={28} className="text-white" />
      </button>

      <MobileNav />
    </div>
  );
}