import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Target, Users, Zap, Leaf, Recycle, Globe, Star, Award, TrendingUp, Camera, Crown, Medal, Gift, RefreshCw, Play, Pause, Timer, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import '../styles/Gamification.css';
import RecyclingBanner from '../assets/Recycling-banner.webp';

const SmartGamification = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('challenges');
  const [userStats, setUserStats] = useState({
    totalScans: 247,
    weeklyScans: 18,
    points: 2450,
    level: 12,
    streak: 7,
    co2Saved: 45.6,
    wasteRecycled: 89.2,
    rank: 23,
    achievements: 18,
    accuracy: 94.2
  });

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Plastic Warrior",
      description: "Scan 5 plastic items today",
      type: "daily",
      target: 5,
      current: 3,
      points: 150,
      deadline: "23:59 today",
      difficulty: "easy",
      aiGenerated: true,
      icon: "♻️",
      color: "bg-blue-500",
      completed: false,
      timeLeft: 3600000, // 1 hour in milliseconds
      active: false,
      materials: ["plastic bottle", "plastic container", "plastic bag", "plastic cup", "plastic wrapper"]
    },
    {
      id: 2,
      title: "Streak Master",
      description: "Maintain your 7-day scanning streak",
      type: "streak",
      target: 7,
      current: 7,
      points: 300,
      deadline: "Ongoing",
      difficulty: "medium",
      aiGenerated: true,
      icon: "🔥",
      color: "bg-orange-500",
      completed: false,
      timeLeft: null,
      active: false
    },
    {
      id: 3,
      title: "Eco Explorer",
      description: "Discover 3 new waste categories this week",
      type: "weekly",
      target: 3,
      current: 1,
      points: 500,
      deadline: "6 days left",
      difficulty: "hard",
      aiGenerated: true,
      icon: "🌱",
      color: "bg-green-500",
      completed: false,
      timeLeft: 518400000, // 6 days
      active: false,
      categories: ["electronics", "textiles", "hazardous"]
    }
  ]);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeTimer, setChallengeTimer] = useState(null);
  const [gameSession, setGameSession] = useState({
    isActive: false,
    currentMaterial: null,
    correctAnswers: 0,
    totalAnswers: 0,
    timeRemaining: 0,
    sessionScore: 0
  });

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "First Scan",
      description: "Completed your first waste scan",
      unlockedAt: "2024-01-15",
      rarity: "common",
      icon: "🎯",
      points: 50,
      unlocked: true
    },
    {
      id: 2,
      title: "Recycling Rookie",
      description: "Scanned 50 items successfully",
      unlockedAt: "2024-02-01",
      rarity: "uncommon",
      icon: "♻️",
      points: 200,
      unlocked: true
    },
    {
      id: 3,
      title: "Eco Warrior",
      description: "Saved 100kg of CO2 through recycling",
      unlockedAt: null,
      rarity: "rare",
      icon: "🌍",
      points: 500,
      unlocked: false,
      progress: 45.6,
      target: 100
    },
    {
      id: 4,
      title: "Streak Legend",
      description: "Maintain a 30-day scanning streak",
      unlockedAt: null,
      rarity: "epic",
      icon: "⚡",
      points: 1000,
      unlocked: false,
      progress: 7,
      target: 30
    },
    {
      id: 5,
      title: "Master Classifier",
      description: "Achieve 99% accuracy in waste classification",
      unlockedAt: null,
      rarity: "legendary",
      icon: "👑",
      points: 2000,
      unlocked: false,
      progress: 94.2,
      target: 99
    }
  ]);

  const [leaderboard] = useState([
    { id: 1, name: "EcoMaster", points: 3200, level: 15, avatar: "🌟", rank: 1, weeklyScans: 28 },
    { id: 2, name: "GreenQueen", points: 2890, level: 14, avatar: "🌿", rank: 2, weeklyScans: 25 },
    { id: 3, name: "RecycleRex", points: 2650, level: 13, avatar: "♻️", rank: 3, weeklyScans: 22 },
    { id: 4, name: "You", points: 2450, level: 12, avatar: "🎯", rank: 4, weeklyScans: 18, isUser: true },
    { id: 5, name: "WasteWizard", points: 2200, level: 11, avatar: "🧙", rank: 5, weeklyScans: 16 }
  ]);

  const [predictions, setPredictions] = useState([]);
  const [impactData] = useState({
    co2Saved: 45.6,
    treesEquivalent: 2.3,
    wasteRecycled: 89.2,
    energySaved: 156.8,
    waterSaved: 234.5,
    plasticBottlesSaved: 89,
    monthlyGrowth: 23.4
  });

  const [notifications, setNotifications] = useState([]);

  // Waste materials database for challenges
  const wasteMaterials = React.useMemo(() => ({
    plastic: ["bottle", "container", "bag", "cup", "wrapper", "lid", "straw", "utensils"],
    paper: ["newspaper", "cardboard", "magazine", "envelope", "notebook", "tissue", "receipt"],
    metal: ["can", "bottle cap", "foil", "wire", "battery", "electronics", "appliance"],
    glass: ["bottle", "jar", "window", "mirror", "light bulb", "drinking glass"],
    organic: ["food scraps", "yard waste", "compost", "fruit peels", "vegetables"],
    electronics: ["phone", "computer", "TV", "radio", "cables", "charger", "battery"],
    textiles: ["clothing", "shoes", "fabric", "carpet", "bedding", "towels"],
    hazardous: ["paint", "chemicals", "oil", "pesticides", "cleaning products", "medicines"]
  }), []);

  // AI Challenge Generation Templates
  const challengeTemplates = {
    material: {
      titles: ["Material Master", "Waste Warrior", "Classification Champion", "Sorting Specialist"],
      descriptions: [
        "Scan {count} {material} items today",
        "Become a {material} expert by scanning {count} items",
        "Master {material} classification with {count} scans",
        "Focus on {material} waste - scan {count} items"
      ],
      materials: ["plastic", "paper", "metal", "glass", "organic", "electronic"],
      icons: ["♻️", "📄", "🔧", "🥃", "🌱", "📱"],
      colors: ["bg-blue-500", "bg-green-500", "bg-gray-500", "bg-cyan-500", "bg-lime-500", "bg-purple-500"]
    },
    accuracy: {
      titles: ["Precision Master", "Accuracy Ace", "Perfect Scanner", "Classification Expert"],
      descriptions: [
        "Achieve {percent}% accuracy in next {count} scans",
        "Perfect your scanning technique with {percent}% accuracy",
        "Show your expertise with {percent}% accuracy rate",
        "Maintain {percent}% accuracy for {count} consecutive scans"
      ],
      icons: ["🎯", "🏹", "🎪", "🔍"],
      colors: ["bg-yellow-500", "bg-red-500", "bg-pink-500", "bg-indigo-500"]
    },
    streak: {
      titles: ["Streak Builder", "Consistency King", "Daily Devotee", "Habit Hero"],
      descriptions: [
        "Maintain a {count}-day scanning streak",
        "Build a {count}-day habit of scanning",
        "Keep your momentum with {count} consecutive days",
        "Show dedication with {count} days in a row"
      ],
      icons: ["🔥", "⚡", "🌟", "💪"],
      colors: ["bg-orange-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"]
    },
    social: {
      titles: ["Community Helper", "Social Butterfly", "Team Player", "Mentor"],
      descriptions: [
        "Help {count} friends with waste identification",
        "Share knowledge with {count} community members",
        "Assist {count} users in proper waste sorting",
        "Guide {count} newcomers in scanning techniques"
      ],
      icons: ["👥", "🤝", "💬", "🎓"],
      colors: ["bg-purple-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500"]
    }
  };

  // Show notification
  const showNotification = React.useCallback((message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  }, []);

  // Check for achievements
  const checkAchievements = React.useCallback(() => {
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.unlocked) {
        let shouldUnlock = false;
        
        if (achievement.title === "Eco Warrior" && userStats.co2Saved >= 100) {
          shouldUnlock = true;
        } else if (achievement.title === "Streak Legend" && userStats.streak >= 30) {
          shouldUnlock = true;
        } else if (achievement.title === "Master Classifier" && userStats.accuracy >= 99) {
          shouldUnlock = true;
        }
        
        if (shouldUnlock) {
          setUserStats(prev => ({
            ...prev,
            points: prev.points + achievement.points,
            achievements: prev.achievements + 1
          }));
          
          showNotification(`🏆 Achievement unlocked: ${achievement.title}! +${achievement.points} points`, "achievement");
          
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString().split('T')[0]
          };
        }
      }
      return achievement;
    });
    
    setAchievements(updatedAchievements);
  }, [achievements, userStats, setUserStats, showNotification]);

  // Stop Challenge
  const stopChallenge = React.useCallback(() => {
    if (challengeTimer) {
      clearInterval(challengeTimer);
      setChallengeTimer(null);
    }
    
    setActiveChallenge(null);
    setGameSession({
      isActive: false,
      currentMaterial: null,
      correctAnswers: 0,
      totalAnswers: 0,
      timeRemaining: 0,
      sessionScore: 0
    });

    // Update challenge status
    setChallenges(prev => 
      prev.map(c => ({ ...c, active: false }))
    );
  }, [challengeTimer, setChallengeTimer, setActiveChallenge, setGameSession, setChallenges]);

  // Get random material for game
  const getRandomMaterial = React.useCallback((materials) => {
    return materials[Math.floor(Math.random() * materials.length)];
  }, []);

  // Get random material from category
  const getRandomMaterialFromCategory = React.useCallback((categories) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const materials = wasteMaterials[category] || [];
    return materials[Math.floor(Math.random() * materials.length)] || "unknown item";
  }, [wasteMaterials]);

  // Complete Challenge
  const completeChallenge = React.useCallback((challengeId) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, current: challenge.target, completed: true, active: false }
          : challenge
      )
    );
    
    setTimeout(() => {
      setChallenges(currentChallenges => {
        const challenge = currentChallenges.find(c => c.id === challengeId);
        if (challenge) {
          const totalPoints = challenge.points + gameSession.sessionScore;
          
          setUserStats(prev => ({
            ...prev,
            points: prev.points + totalPoints,
            totalScans: prev.totalScans + challenge.target,
            accuracy: Math.min(99.9, prev.accuracy + 0.5),
            co2Saved: prev.co2Saved + (challenge.target * 0.8)
          }));
          
          showNotification(`🎉 Challenge completed! +${totalPoints} points`, "success");
          
          // Stop game session
          stopChallenge();
          
          // Check for new achievements
          setTimeout(() => checkAchievements(), 1000);
        }
        return currentChallenges;
      });
    }, 0);
  }, [gameSession.sessionScore, setUserStats, showNotification, stopChallenge, checkAchievements]);


  // Handle Answer Selection
  const handleAnswer = React.useCallback((selectedCategory) => {
    if (!gameSession.isActive || !activeChallenge) return;

    const currentMaterial = gameSession.currentMaterial;
    let correctCategory = null;

    // Determine correct category
    for (const [category, items] of Object.entries(wasteMaterials)) {
      if (items.some(item => currentMaterial.includes(item) || item.includes(currentMaterial))) {
        correctCategory = category;
        break;
      }
    }

    const isCorrect = selectedCategory === correctCategory;
    const newCorrectAnswers = isCorrect ? gameSession.correctAnswers + 1 : gameSession.correctAnswers;
    const newTotalAnswers = gameSession.totalAnswers + 1;
    const scoreIncrement = isCorrect ? 25 : 0;

    setGameSession(prev => ({
      ...prev,
      correctAnswers: newCorrectAnswers,
      totalAnswers: newTotalAnswers,
      sessionScore: prev.sessionScore + scoreIncrement,
      timeRemaining: 30 // Reset timer for next item
    }));

    // Update challenge progress
    if (isCorrect) {
      setChallenges(prev => 
        prev.map(c => 
          c.id === activeChallenge.id 
            ? { ...c, current: Math.min(c.current + 1, c.target) }
            : c
        )
      );
    }

    // Show feedback
    showNotification(
      isCorrect ? `Correct! +${scoreIncrement} points` : `Incorrect. The right answer was ${correctCategory}`,
      isCorrect ? "success" : "error"
    );

    // Generate next material or complete challenge
    setTimeout(() => {
      const updatedChallenge = challenges.find(c => c.id === activeChallenge.id);
      if (updatedChallenge && updatedChallenge.current >= updatedChallenge.target) {
        completeChallenge(activeChallenge.id);
      } else {
        if (activeChallenge.materials) {
          setGameSession(prev => ({
            ...prev,
            currentMaterial: getRandomMaterial(activeChallenge.materials)
          }));
        } else if (activeChallenge.categories) {
          setGameSession(prev => ({
            ...prev,
            currentMaterial: getRandomMaterialFromCategory(activeChallenge.categories)
          }));
        }
      }
    }, 1500);
  }, [gameSession, activeChallenge, challenges, completeChallenge, getRandomMaterial, getRandomMaterialFromCategory, setChallenges, setGameSession, showNotification, wasteMaterials]);

  // Game Timer Effect
  useEffect(() => {
    if (gameSession.isActive && gameSession.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameSession(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      setChallengeTimer(timer);
      return () => clearTimeout(timer);
    } else if (gameSession.isActive && gameSession.timeRemaining === 0) {
      // Time's up - skip to next item
      handleAnswer("timeout");
    }
  }, [gameSession.timeRemaining, gameSession.isActive, handleAnswer]);

  // Generate AI Prediction
  const generatePredictions = React.useCallback(() => {
    const newPredictions = [];
    
    // Level prediction
    const pointsToNextLevel = (userStats.level + 1) * 200 - userStats.points;
    if (pointsToNextLevel <= 300) {
      newPredictions.push({
        id: 1,
        type: "level",
        title: `Level ${userStats.level + 1}`,
        description: "You're close to leveling up!",
        probability: Math.max(70, 100 - Math.floor(pointsToNextLevel / 10)),
        estimatedDays: Math.ceil(pointsToNextLevel / (userStats.weeklyScans * 15 / 7)),
        recommendation: `Complete ${Math.ceil(pointsToNextLevel / 150)} more challenges to level up`,
        icon: "⭐"
      });
    }

    // Achievement predictions
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.progress) {
        const progressPercent = (achievement.progress / achievement.target) * 100;
        if (progressPercent > 50) {
          const remaining = achievement.target - achievement.progress;
          let estimatedDays = 0;
          let recommendation = "";

          if (achievement.title === "Eco Warrior") {
            estimatedDays = Math.ceil(remaining / (userStats.weeklyScans * 0.5 / 7));
            recommendation = "Scan 2-3 items daily to unlock this achievement";
          } else if (achievement.title === "Streak Legend") {
            estimatedDays = remaining;
            recommendation = "Set daily reminders to maintain your streak";
          } else if (achievement.title === "Master Classifier") {
            estimatedDays = Math.ceil((achievement.target - achievement.progress) * 2);
            recommendation = "Focus on accurate scanning to improve classification rate";
          }

          newPredictions.push({
            id: achievement.id + 10,
            type: "achievement",
            title: achievement.title,
            description: `Continue progress to unlock ${achievement.title}`,
            probability: Math.min(95, Math.floor(progressPercent + 20)),
            estimatedDays,
            recommendation,
            icon: achievement.icon
          });
        }
      }
    });

    if (newPredictions.length === 0) {
      showNotification("No new predictions available based on current progress", "info");
    } else {
      showNotification(`Generated ${newPredictions.length} new predictions`, "success");
    }

    setPredictions(newPredictions);
  }, [userStats, achievements]);

  // Generate AI Challenge
  const generateAIChallenge = () => {
    const types = Object.keys(challengeTemplates);
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const template = challengeTemplates[selectedType];
    
    const title = template.titles[Math.floor(Math.random() * template.titles.length)];
    const descriptionTemplate = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
    const icon = template.icons[Math.floor(Math.random() * template.icons.length)];
    const color = template.colors[Math.floor(Math.random() * template.colors.length)];
    
    let description = descriptionTemplate;
    let target = 5;
    let points = 200;
    let difficulty = "medium";
    let materials = null;
    let categories = null;
    
    // Customize based on type
    if (selectedType === "material") {
      const material = template.materials[Math.floor(Math.random() * template.materials.length)];
      target = Math.floor(Math.random() * 8) + 3; // 3-10
      description = description.replace("{material}", material).replace("{count}", target);
      points = target * 30;
      difficulty = target <= 5 ? "easy" : target <= 8 ? "medium" : "hard";
      materials = wasteMaterials[material] || [];
    } else if (selectedType === "accuracy") {
      const percent = Math.floor(Math.random() * 10) + 90; // 90-99%
      const count = Math.floor(Math.random() * 5) + 5; // 5-9
      description = description.replace("{percent}", percent).replace("{count}", count);
      target = count;
      points = percent * 10;
      difficulty = percent >= 95 ? "hard" : "medium";
    } else if (selectedType === "streak") {
      target = Math.floor(Math.random() * 7) + 3; // 3-9 days
      description = description.replace("{count}", target);
      points = target * 50;
      difficulty = target <= 5 ? "easy" : "medium";
    } else if (selectedType === "social") {
      target = Math.floor(Math.random() * 3) + 2; // 2-4 people
      description = description.replace("{count}", target);
      points = target * 100;
      difficulty = target <= 2 ? "medium" : "hard";
      categories = Object.keys(wasteMaterials).slice(0, 3);
    }

    const newChallenge = {
      id: Date.now(),
      title,
      description,
      type: selectedType,
      target,
      current: 0,
      points,
      deadline: selectedType === "streak" ? "Ongoing" : "24 hours",
      difficulty,
      aiGenerated: true,
      icon,
      color,
      completed: false,
      timeLeft: selectedType === "streak" ? null : 86400000, // 24 hours
      active: false,
      materials,
      categories
    };

    setChallenges(prev => [...prev, newChallenge]);
    showNotification(`New AI challenge generated: ${title}!`, "success");
  };

  

  // Start Challenge Game Session
  const startChallenge = (challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setActiveChallenge(challenge);
    
    if (challenge.type === "daily" && challenge.materials) {
      setGameSession({
        isActive: true,
        currentMaterial: getRandomMaterial(challenge.materials),
        correctAnswers: 0,
        totalAnswers: 0,
        timeRemaining: 30,
        sessionScore: 0
      });
      
      setChallenges(prev => 
        prev.map(c => c.id === challengeId ? { ...c, active: true } : c)
      );
    } else if (challenge.type === "weekly" && challenge.categories) {
      setGameSession({
        isActive: true,
        currentMaterial: getRandomMaterialFromCategory(challenge.categories),
        correctAnswers: 0,
        totalAnswers: 0,
        timeRemaining: 45,
        sessionScore: 0
      });
    }

    showNotification(`Challenge started: ${challenge.title}!`, "info");
  };

  // Update impact data

  // Initialize predictions on component mount
  useEffect(() => {
    generatePredictions();
  }, [generatePredictions]);

  // Notification Component
  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500/90 border-green-400 text-white" :
            notification.type === "achievement" ? "bg-yellow-500/90 border-yellow-400 text-white" :
            notification.type === "error" ? "bg-red-500/90 border-red-400 text-white" :
            "bg-blue-500/90 border-blue-400 text-white"
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );

  return (
    <div className="home-container" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${RecyclingBanner})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="municipal-header">
            <Link to="/" className="back-btn">
              &larr; {t('back')}
            </Link>
            <div className="municipal-title">
              <h1 className="app-title">Gamification</h1>
            </div>
            <div className="header-controls">
              <select 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="language-selector"
              >
                <option value="en">🇺🇸 English</option>
                <option value="zu">🇿🇦 isiZulu</option>
                <option value="af">🇿🇦 Afrikaans</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="gamification-container">
        {/* Enhanced Profile Card */}
        <section className="profile-card">
          <div className="profile-header">
            <div className="avatar">👤</div>
            <div className="profile-info">
              <h2>EcoPlayer</h2>
              <div className="level-badge">
                Level {userStats.level} <span className="level-progress">({userStats.points}/{(userStats.level + 1) * 200} XP)</span>
              </div>
            </div>
            <div className="profile-rank">
              <Crown className="rank-icon" />
              <span>Rank #{userStats.rank}</span>
            </div>
          </div>
          
          <div className="profile-stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Trophy />
              </div>
              <div className="stat-content">
                <div className="stat-value">{userStats.points}</div>
                <div className="stat-label">Points</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Target />
              </div>
              <div className="stat-content">
                <div className="stat-value">{userStats.accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Zap />
              </div>
              <div className="stat-content">
                <div className="stat-value">{userStats.streak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Leaf />
              </div>
              <div className="stat-content">
                <div className="stat-value">{userStats.co2Saved} kg</div>
                <div className="stat-label">CO₂ Saved</div>
              </div>
            </div>
          </div>
          
          <div className="progress-section">
            <div className="progress-item">
              <div className="progress-header">
                <span>Level Progress</span>
                <span>{Math.round((userStats.points / ((userStats.level + 1) * 200)) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(userStats.points / ((userStats.level + 1) * 200)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav className="gamification-tabs">
          <button 
            className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            <Target className="tab-icon" />
            Challenges
          </button>
          <button 
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <Award className="tab-icon" />
            Achievements
          </button>
          <button 
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <TrendingUp className="tab-icon" />
            Leaderboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            <Globe className="tab-icon" />
            AI Predictions
          </button>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="challenges-grid">
              <div className="challenges-header">
                <h3>Active Challenges</h3>
                <button onClick={generateAIChallenge} className="generate-challenge-btn">
                  <RefreshCw className="btn-icon" />
                  Generate AI Challenge
                </button>
              </div>
              
              {challenges.filter(c => !c.completed).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎯</div>
                  <h4>No active challenges</h4>
                  <p>Generate a new challenge or check back later for updates</p>
                  <button onClick={generateAIChallenge} className="primary-btn">
                    Generate Challenge
                  </button>
                </div>
              ) : (
                <div className="challenges-list">
                  {challenges.filter(c => !c.completed).map(challenge => (
                    <div key={challenge.id} className={`challenge-card ${challenge.color} ${challenge.active ? 'active' : ''}`}>
                      <div className="challenge-icon">{challenge.icon}</div>
                      <div className="challenge-content">
                        <div className="challenge-header">
                          <h4>{challenge.title}</h4>
                          <span className={`difficulty-badge ${challenge.difficulty}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p>{challenge.description}</p>
                        
                        <div className="challenge-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                            ></div>
                          </div>
                          <span>{challenge.current}/{challenge.target}</span>
                        </div>
                        
                        {challenge.active ? (
                          <div className="challenge-game">
                            <div className="game-header">
                              <h5>Classify this item:</h5>
                              <div className="game-timer">
                                <Timer className="timer-icon" />
                                <span>{gameSession.timeRemaining}s</span>
                              </div>
                            </div>
                            <div className="game-item">{gameSession.currentMaterial}</div>
                            
                            <div className="game-categories">
                              {Object.keys(wasteMaterials).map(category => (
                                <button
                                  key={category}
                                  onClick={() => handleAnswer(category)}
                                  className="category-btn"
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                            
                            <div className="game-stats">
                              <span>Score: {gameSession.sessionScore}</span>
                              <span>Accuracy: {gameSession.totalAnswers > 0 ? 
                                Math.round((gameSession.correctAnswers / gameSession.totalAnswers) * 100) : 0}%</span>
                            </div>
                            
                            <button 
                              onClick={stopChallenge}
                              className="action-btn stop"
                            >
                              <Pause className="btn-icon" />
                              Stop Challenge
                            </button>
                          </div>
                        ) : (
                          <div className="challenge-footer">
                            <button 
                              onClick={() => startChallenge(challenge.id)}
                              className="action-btn start"
                            >
                              <Play className="btn-icon" />
                              Start
                            </button>
                            <div className="challenge-reward">
                              <Star className="reward-icon" />
                              +{challenge.points} pts
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
                
              <div className="completed-challenges">
                <h3>Completed Challenges</h3>
                {challenges.filter(c => c.completed).length === 0 ? (
                  <p className="no-completed">No challenges completed yet</p>
                ) : (
                  <div className="completed-list">
                    {challenges.filter(c => c.completed).map(challenge => (
                      <div key={challenge.id} className="completed-card">
                        <div className={`completed-icon ${challenge.color}`}>
                          {challenge.icon}
                          <CheckCircle className="checkmark" />
                        </div>
                        <div className="completed-details">
                          <h4>{challenge.title}</h4>
                          <p>+{challenge.points} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="achievements-grid">
              <div className="achievements-header">
                <h3>Your Achievements</h3>
                <div className="achievements-summary">
                  <span>{achievements.filter(a => a.unlocked).length} unlocked</span>
                  <span>{achievements.length} total</span>
                </div>
              </div>
              
              <div className="achievements-list">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className={`achievement-icon ${achievement.rarity}`}>
                      {achievement.icon}
                      {achievement.unlocked && (
                        <div className="unlocked-badge">
                          <CheckCircle className="check-icon" />
                        </div>
                      )}
                    </div>
                    
                    <div className="achievement-content">
                      <div className="achievement-header">
                        <h4>{achievement.title}</h4>
                        <span className="achievement-points">
                          <Star className="star-icon" />
                          {achievement.points}
                        </span>
                      </div>
                      
                      <p>{achievement.description}</p>
                      
                      {achievement.unlocked ? (
                        <div className="achievement-date">
                          Unlocked on {achievement.unlockedAt}
                        </div>
                      ) : (
                        <div className="achievement-progress">
                          {achievement.progress && (
                            <>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                ></div>
                              </div>
                              <span>{achievement.progress}/{achievement.target}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className={`achievement-ribbon ${achievement.rarity}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="leaderboard-container">
              <div className="leaderboard-header">
                <h3>Community Leaderboard</h3>
                <div className="leaderboard-filters">
                  <button className="filter-btn active">Weekly</button>
                  <button className="filter-btn">Monthly</button>
                  <button className="filter-btn">All-Time</button>
                </div>
              </div>
              
              <div className="leaderboard-list">
                {leaderboard.map(player => (
                  <div 
                    key={player.id}
                    className={`leaderboard-card ${player.isUser ? 'current-user' : ''}`}
                  >
                    <div className="player-rank">
                      {player.rank <= 3 ? (
                        <span className={`medal-${player.rank}`}>
                          {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span>#{player.rank}</span>
                      )}
                    </div>
                    
                    <div className="player-avatar">
                      {player.avatar}
                    </div>
                    
                    <div className="player-info">
                      <h4>{player.name}</h4>
                      <div className="player-stats">
                        <span className="stat-item">
                          <TrendingUp className="stat-icon" />
                          Level {player.level}
                        </span>
                        <span className="stat-item">
                          <Star className="stat-icon" />
                          {player.points} pts
                        </span>
                        <span className="stat-item">
                          <Target className="stat-icon" />
                          {player.weeklyScans} scans
                        </span>
                      </div>
                    </div>
                    
                    {player.isUser && (
                      <div className="user-badge">
                        You
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="leaderboard-stats">
                <div className="stat-card">
                  <div className="stat-value">Top 10%</div>
                  <div className="stat-label">Your Position</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">+450</div>
                  <div className="stat-label">Points to Next Rank</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">2.4x</div>
                  <div className="stat-label">Your Multiplier</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="predictions-container">
              <div className="predictions-header">
                <h3>AI Predictions & Recommendations</h3>
                <p>Our AI analyzes your activity to predict future achievements and suggest improvements</p>
                <button 
                  onClick={generatePredictions}
                  className="generate-predictions-btn"
                >
                  <RefreshCw className="btn-icon" />
                  Generate New Predictions
                </button>
              </div>
              
              {predictions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔮</div>
                  <h4>No predictions available</h4>
                  <p>Complete more challenges to get personalized predictions</p>
                  <button 
                    onClick={generatePredictions}
                    className="primary-btn"
                  >
                    Generate Predictions
                  </button>
                </div>
              ) : (
                <div className="predictions-grid">
                  {predictions.map(prediction => (
                    <div key={prediction.id} className="prediction-card">
                      <div className="prediction-icon">
                        {prediction.icon}
                      </div>
                      
                      <div className="prediction-content">
                        <div className="prediction-header">
                          <h4>{prediction.title}</h4>
                          <div className="probability-badge">
                            {prediction.probability}% likely
                          </div>
                        </div>
                        
                        <p>{prediction.description}</p>
                        
                        <div className="prediction-details">
                          <div className="detail-item">
                            <Timer className="detail-icon" />
                            <span>~{prediction.estimatedDays} days</span>
                          </div>
                          <div className="detail-item">
                            <Star className="detail-icon" />
                            <span>{prediction.type === 'level' ? 'Level up' : 'Achievement'}</span>
                          </div>
                        </div>
                        
                        <div className="recommendation">
                          <span className="recommendation-label">AI Suggests:</span>
                          {prediction.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                       
              <div className="impact-stats">
                <h4>Your Environmental Impact</h4>
                <div className="impact-grid">
                  <div className="impact-card">
                    <div className="impact-icon bg-green-500">
                      <Leaf />
                    </div>
                    <div className="impact-value">{impactData.co2Saved.toFixed(1)} kg</div>
                    <div className="impact-label">CO₂ Saved</div>
                  </div>
                  <div className="impact-card">
                    <div className="impact-icon bg-blue-500">
                      <Recycle />
                    </div>
                    <div className="impact-value">{impactData.wasteRecycled.toFixed(1)} kg</div>
                    <div className="impact-label">Waste Recycled</div>
                  </div>
                  <div className="impact-card">
                    <div className="impact-icon bg-yellow-500">
                      <Zap />
                    </div>
                    <div className="impact-value">{impactData.energySaved.toFixed(1)} kWh</div>
                    <div className="impact-label">Energy Saved</div>
                  </div>
                  <div className="impact-card">
                    <div className="impact-icon bg-cyan-500">
                      <Globe />
                    </div>
                    <div className="impact-value">{impactData.plasticBottlesSaved}</div>
                    <div className="impact-label">Plastic Bottles Saved</div>
                  </div>
                </div>
                
                <div className="impact-growth">
                  <div className="growth-label">
                    <TrendingUp className="growth-icon" />
                    <span>Monthly Impact Growth</span>
                  </div>
                  <div className="growth-value">
                    +{impactData.monthlyGrowth}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};

export default SmartGamification;