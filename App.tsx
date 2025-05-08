import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import HomeworkPage from "@/pages/homework-page";
import TextbooksPage from "@/pages/textbooks-page";
import CircularsPage from "@/pages/circulars-page";
import ComplaintPage from "@/pages/complaint-page";
import LiveClassesPage from "@/pages/live-classes-page";
import NoticeBoardPage from "@/pages/notice-board-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/homework" component={HomeworkPage} />
      <ProtectedRoute path="/textbooks" component={TextbooksPage} />
      <ProtectedRoute path="/circulars" component={CircularsPage} />
      <ProtectedRoute path="/complaints" component={ComplaintPage} />
      <ProtectedRoute path="/live-classes" component={LiveClassesPage} />
      <ProtectedRoute path="/notices" component={NoticeBoardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
