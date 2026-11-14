import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('skillpath_user_id') || 'user-lingesh';
  });

  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [matching, setMatching] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [stats, setStats] = useState({
    progress: 20,
    totalCourses: 5,
    completedCourses: 1,
    quizAccuracy: 90,
    matchPercentage: 42,
  });
  const [agentLogs, setAgentLogs] = useState([]);
  const [mentorMessages, setMentorMessages] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeQuizSkill, setActiveQuizSkill] = useState('JavaScript');
  const [isMentorDrawerOpen, setIsMentorDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationToast, setNotificationToast] = useState(null);

  const getHeaders = (extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    'x-user-id': currentUserId,
    ...extraHeaders,
  });

  const triggerToast = (message, type = 'info') => {
    setNotificationToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotificationToast(null);
    }, 5000);
  };

  // Fetch all students for quick switching
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/auth/users', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStudentsList(data.students || []);
      }
    } catch (e) {
      console.error('Failed to fetch students list:', e);
    }
  };

  // Fetch current student dashboard & mentor data
  const refreshData = async (targetUserId = null) => {
    const userIdToUse = targetUserId || currentUserId;
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?userId=${userIdToUse}`, {
        headers: { 'x-user-id': userIdToUse },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setAnalysis(data.analysis);
        setMatching(data.matching);
        setRoadmap(data.roadmap || []);
        if (data.stats) setStats(data.stats);
        if (data.agentLogs) setAgentLogs(data.agentLogs);
      }

      const mentorRes = await fetch(`/api/mentor/messages?userId=${userIdToUse}`, {
        headers: { 'x-user-id': userIdToUse },
      });
      if (mentorRes.ok) {
        const mData = await mentorRes.json();
        setMentorMessages(mData.messages || []);
      }

      await fetchStudents();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData(currentUserId);
  }, [currentUserId]);

  // Switch student profile
  const switchStudent = async (userId) => {
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(userId);
        localStorage.setItem('skillpath_user_id', userId);
        triggerToast(`Switched to student: ${data.profile.name} (${data.profile.targetCareer})`, 'success');
        setIsLoginModalOpen(false);
        setActiveTab('dashboard');
        await refreshData(userId);
      }
    } catch (err) {
      triggerToast('Failed to switch student', 'error');
    }
  };

  // Email Sign-In for Existing Students
  const loginWithEmail = async (email) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUserId(data.userId);
        localStorage.setItem('skillpath_user_id', data.userId);
        triggerToast(data.message, 'success');
        setIsLoginModalOpen(false);
        setActiveTab('dashboard');
        await refreshData(data.userId);
        return { success: true };
      } else {
        triggerToast(data.error || 'Student account not found', 'warning');
        return { success: false, error: data.error };
      }
    } catch (err) {
      triggerToast('Error during sign in', 'error');
      return { success: false, error: err.message };
    }
  };

  // Google Login / Student Sign-in
  const loginWithGoogle = async ({ email, name, avatar, targetCareer, currentSkills }) => {
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar, targetCareer, currentSkills }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.userId);
        localStorage.setItem('skillpath_user_id', data.userId);
        triggerToast(data.message, 'success');
        setIsLoginModalOpen(false);
        setActiveTab('dashboard');
        await refreshData(data.userId);
        return data;
      }
    } catch (err) {
      triggerToast('Google login error', 'error');
    }
    return null;
  };

  // Sign out
  const logout = () => {
    localStorage.removeItem('skillpath_user_id');
    setCurrentUserId(null);
    setProfile(null);
    setAnalysis(null);
    setMatching(null);
    setRoadmap([]);
    setMentorMessages([]);
    setIsLoginModalOpen(true);
    triggerToast('You have signed out of your account.', 'info');
  };

  const resetDemo = async () => {
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      if (res.ok) {
        triggerToast('Reset to default multi-student demo state!', 'success');
        await refreshData();
      }
    } catch (err) {
      console.error('Failed to reset demo:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUserId,
        profile,
        setProfile,
        analysis,
        setAnalysis,
        matching,
        setMatching,
        roadmap,
        setRoadmap,
        stats,
        setStats,
        agentLogs,
        setAgentLogs,
        mentorMessages,
        setMentorMessages,
        studentsList,
        activeTab,
        setActiveTab,
        activeQuizSkill,
        setActiveQuizSkill,
        isMentorDrawerOpen,
        setIsMentorDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loading,
        getHeaders,
        switchStudent,
        loginWithGoogle,
        loginWithEmail,
        logout,
        refreshData,
        resetDemo,
        notificationToast,
        triggerToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
