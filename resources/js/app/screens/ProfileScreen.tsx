import { MobileNav } from '@/app/components/MobileNav';
import { TopNav } from '@/app/components/TopNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { LevelBadge } from '@/app/components/LevelBadge';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { currentUser } from '@/app/data/mockData';
import { Trophy, Target, TrendingUp, Award, Settings, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { logoutUser, checkAuthStatus } from '@/app/modules/auth/authSlice';
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { AvatarSelector } from '@/app/components/AvatarSelector';
import { useState } from 'react';
import axios from 'axios';
import { Edit } from 'lucide-react';



export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  // Fallback to mock if needed, or better show loading/real data. 
  // For now using user from state.
  // Note: currentUser.accuracy etc might not be in user object yet?
  // The user object in Redux is `User`. `accuracy` is not there based on `authSlice` definition.
  // We will mix them for now to avoid breaking stats.

  const accuracyColor = '#10b981'; // Default for now

  const [editOpen, setEditOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/auth');
  };

  const handleAvatarSelect = (avatar: string | File) => {
    if (typeof avatar === 'string') {
      setSelectedAvatar(avatar);
      setAvatarFile(null);
      setAvatarPreview(null);
    } else {
      setAvatarFile(avatar);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatar);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      // We only send avatar here
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (selectedAvatar) {
        // If it's a string (default avatar), we send it
        // Backend expects 'avatar' to be string or file
        formData.append('avatar', selectedAvatar);
      }

      // We also need username as it's required by validation usually? 
      // Let's check AuthController validation: 
      // 'username' => 'required|string|unique:users,username,id|max:20'
      // 'name', 'country', 'avatar' are nullable/optional.
      // But if we send partial update, validation might fail if 'username' is missing?
      // AuthController: $request->validate(['username' => 'required...'])
      // So we MUST send username.
      formData.append('username', user?.username || '');

      const token = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/profile/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      await dispatch(checkAuthStatus());
      setEditOpen(false);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <TopNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a855f7] rounded-full blur-[128px] opacity-20" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <Avatar className="w-24 h-24 ring-4 ring-[#a855f7]/50 transition-transform group-hover:scale-105">
                        <AvatarImage src={user?.avatar_url || user?.avatar} alt={user?.username} />
                        <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="text-white w-6 h-6" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glass-card border-none text-foreground">
                    <DialogHeader>
                      <DialogTitle>Edit Avatar</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <AvatarSelector
                        currentAvatar={selectedAvatar || user?.avatar || ''}
                        preview={avatarPreview}
                        onSelect={handleAvatarSelect}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                      <Button
                        onClick={handleSaveAvatar}
                        disabled={isSaving}
                        style={{
                          background: !isSaving
                            ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
                            : undefined,
                        }}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{user?.name || user?.username}</h2>
                  <LevelBadge level={currentUser.level} size="lg" />

                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{user?.country || 'Location not set'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-[#a855f7]" />
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: accuracyColor }}>
                    {currentUser.accuracy.toFixed(1)}%
                  </p>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={16} className="text-[#fbbf24]" />
                    <p className="text-xs text-muted-foreground">Rank Score</p>
                  </div>
                  <p className="text-2xl font-bold text-[#fbbf24]">{currentUser.rankScore}</p>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-[#10b981]" />
                    <p className="text-xs text-muted-foreground">Created</p>
                  </div>
                  <p className="text-2xl font-bold">{currentUser.predictionsCreated}</p>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={16} className="text-[#ec4899]" />
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                  <p className="text-2xl font-bold">{currentUser.predictionsResolved}</p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="mt-4 w-full md:w-auto glass-card hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award size={20} className="text-[#fbbf24]" />
              Badges Earned
            </h3>

            {currentUser.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentUser.badges.map((badge) => (
                  <div key={badge.id} className="glass-card p-4 rounded-xl text-center">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <p className="font-medium text-sm mb-1">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No badges earned yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep making accurate predictions to earn badges!
                </p>
              </div>
            )}
          </div>

          {/* Prediction History */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold mb-4">Prediction History</h3>

            <Tabs defaultValue="all">
              <TabsList className="glass-card w-full justify-start mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your prediction history will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Level Progress */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold mb-4">Level Progress</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Predictions Resolved</span>
                  <span className="text-sm font-medium">{currentUser.predictionsResolved} / 50</span>
                </div>
                <Progress value={(currentUser.predictionsResolved / 50) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium">{currentUser.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={currentUser.accuracy} className="h-2" />
              </div>

              <div className="glass-card p-4 rounded-xl mt-4">
                <p className="text-sm text-center text-muted-foreground">
                  Reach <span className="font-bold text-[#fbbf24]">50 predictions</span> with{' '}
                  <span className="font-bold text-[#fbbf24]">70%+ accuracy</span> to become Elite!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <MobileNav />
    </div>
  );
}