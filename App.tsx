import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat, Content } from "@google/genai";
import PlannerPage from './components/PlannerPage';
import TodoListPage from './components/TodoListPage';
import ChatbotComponent from './components/Chatbot';

type Page = 'home' | 'planner' | 'todolist';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Content[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Initialize chat
  useEffect(() => {
    const initChat = () => {
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are Smart Fitness Chat, a friendly and helpful AI nutrition and wellness assistant. Your goal is to provide clear, safe, and encouraging advice. Structure every response in the following format: 1. A clear, friendly title for the topic. 2. A brief introductory sentence. 3. A list of actionable points using asterisks. Use markdown for bolding to highlight the main idea of each point (e.g., "**Eat a Variety of Foods:** ..."). 4. End with this exact disclaimer: "*Please note: This information is for general wellness guidance and is not medical advice. If you have specific dietary needs or health concerns, it\'s always best to consult with a healthcare professional or a registered dietitian.*"',
        },
      });
      setChat(chatSession);
    };
    initChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat) return;

    const userMessage: Content = { role: 'user', parts: [{ text: userInput }] };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsChatLoading(true);

    try {
      const responseStream = await chat.sendMessageStream({ message: userInput });
      let fullResponse = "";
      for await (const chunk of responseStream) {
        fullResponse += chunk.text;
      }
      const modelMessage: Content = { role: 'model', parts: [{ text: fullResponse }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Content = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };


  const homeContent = (
    <>
      {/* Hero Section */}
      <section className="text-center py-16 lg:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 tracking-tight animate-fade-in">
          Unlock Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500">Personalized</span> Path to Wellness
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Harness the power of AI to create a diet plan that's tailored to your body, goals, and lifestyle. Start your journey to a healthier you today.
        </p>
        <button
          onClick={() => setPage('todolist')}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Create My Plan
        </button>
      </section>

      {/* About The App Section */}
      <section id="about" className="py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700">About The App</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Discover the tools designed to help you achieve your wellness goals intelligently and efficiently.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 animate-fade-in transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" alt="A healthy plate of food" className="w-full h-48 object-cover"/>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-3">AI Diet Planner</h3>
              <p className="text-gray-600">Get a personalized diet plan based on your unique profile and goals, powered by advanced AI.</p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 animate-fade-in transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden" style={{ animationDelay: '0.2s' }}>
             <img src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=600&auto=format&fit=crop" alt="A person writing in a planner" className="w-full h-48 object-cover"/>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-3">Wellness To-Do List</h3>
              <p className="text-gray-600">Track your daily health tasks, monitor your progress, and stay motivated on your wellness journey.</p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 animate-fade-in transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden" style={{ animationDelay: '0.4s' }}>
             <img src="https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=600&auto=format&fit=crop" alt="A robot hand pointing" className="w-full h-48 object-cover"/>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-3">AI Wellness Bot</h3>
              <p className="text-gray-600">Have a question about nutrition or wellness? Get instant, helpful answers from our friendly AI assistant.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen font-sans text-gray-800 w-full">
      <header className="sticky top-0 z-10 w-full p-4 bg-gradient-to-r from-white/60 to-blue-100/40 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => setPage('home')} className="flex items-center space-x-3 group text-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9 text-emerald-600 transition-transform duration-300 ease-in-out group-hover:animate-gentle-pulse">
              <path d="M21.25,8.88a1,1,0,0,0-1,0,7.25,7.25,0,0,1-14.5,0,1,1,0,0,0-1.73-1,9.25,9.25,0,0,0,17.23,0,1,1,0,0,0-.73-1ZM12,14a3,3,0,0,0,3-3V9a3,3,0,0,0-6,0v2A3,3,0,0,0,12,14Z"/>
              <path d="M12,2a10,10,0,0,0-7.07,2.93,1,1,0,0,0,1.41,1.41A8,8,0,0,1,12,4V2Z"/>
            </svg>
            <h1 className="text-2xl lg:text-3xl font-bold text-cyan-600 tracking-tight">Smart Diet Recommender</h1>
          </button>
          <div className="flex items-center space-x-4">
             <nav className="hidden md:block">
              <button onClick={() => setPage('planner')} className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold py-2 px-5 rounded-lg focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg">
                Get Your Plan
              </button>
            </nav>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-gentle-pulse"
              aria-label="Open wellness chatbot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-14.304 0c-1.978-.292-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {page === 'home' && <div className="container mx-auto p-4">{homeContent}</div>}
        {page === 'planner' && <PlannerPage goToHome={() => setPage('home')} />}
        {page === 'todolist' && <TodoListPage goToHome={() => setPage('home')} />}
      </main>

      {isChatOpen && (
         <ChatbotComponent
            messages={messages}
            inputValue={userInput}
            onInputChange={(e) => setUserInput(e.target.value)}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            onClose={() => setIsChatOpen(false)}
          />
      )}

      <footer className="bg-white/20 backdrop-blur-lg border-t border-white/20 text-center p-6 mt-16">
        <p className="font-semibold text-cyan-700">Smart Diet Recommender</p>
        <p className="text-sm text-gray-600 mt-1">
          Your intelligent partner for achieving your health and wellness goals.
        </p>
        <p className="text-xs text-gray-500 mt-4">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;